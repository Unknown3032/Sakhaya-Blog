export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'


import User from '@/models/User';
import jwt from 'jsonwebtoken'


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
        let { url } = await req.json()


        await User.findOneAndUpdate({ _id: userId }, { "personal_info.profile_img": url })
            .then(() => {
                data = { profile_img: url }
                status = 200;
                return NextResponse.json({ data }, { status })
            })
            .catch((err) => {
                data = { message: "Something went wrong" }
                status = 500;
                return NextResponse.json({ data }, { status })
            })
    }
    return NextResponse.json({ data }, { status })
}

