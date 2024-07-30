export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'


import User from '@/models/User';
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid';
import Blog from '@/models/Blog';
import Notification from '@/models/Notification';


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
        let { draft, query } = await req.json();

        let findQuery = { author: userId, draft }

        if (query) {
            findQuery = { author: userId, draft, title: new RegExp(query, 'i') }
        }

        await Blog.countDocuments(findQuery)
            .then((count) => {
                data = { totalDocs: count }
                status = 200
                return NextResponse.json({ data }, { status })

            })
            .catch(err => {
                data = { message: err.message }
                status = 500
                return NextResponse.json({ data }, { status })
            })

    }
    return NextResponse.json({ data }, { status })
}

