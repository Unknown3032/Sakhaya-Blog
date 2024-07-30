export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'


import jwt from 'jsonwebtoken'
import Blog from '@/models/Blog';


const bcrypt = require('bcrypt');


export async function POST(req) {

    // variables
    let data;
    let status;
    let jwtToken;
    let userId;


    const authorizationToken = headers().get('authorization');
    jwtToken = authorizationToken && authorizationToken.split(" ")[1];

    if (jwtToken == null) {
        data = { message: "No access Token" }
        status = 403;
        console.log("err");
        return NextResponse.json({ data }, { status })
    }



    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            data = { message: "Invalid Token" }
            status = 403;
            return NextResponse.json({ data }, { status })
        }

        userId = user?.id
    })

    // check user is logged in or not 
    if (userId) {
        let { page, draft, query, deletedDocCount } = await req.json();
        let maxLimit = 5;
        let skipDocs = (page - 1) * maxLimit;

        if (deletedDocCount) {
            skipDocs -= deletedDocCount
        }

        let findQuery = { author: userId, draft }

        if (query) {
            findQuery = { author: userId, draft, title: new RegExp(query, 'i') }
        }

        await Blog.find(findQuery)
            .skip(skipDocs)
            .limit(maxLimit)
            .sort({ publishedAt: -1 })
            .select(" title banner publishedAt blog_id activity des draft -_id")
            .then((blogs) => {
                data = { blogs }
                status = 200
                return NextResponse.json({ data }, { status })
            }).catch(err => {
                data = { message: "Error fetching blogs" }
                status = 500
                return NextResponse.json({ data }, { status })
            })

    }
    return NextResponse.json({ data }, { status })
}

