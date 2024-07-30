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
        let { username, bio, social_links } = await req.json()
        let bioLimit = 150;

        if (bio.length > bioLimit) {
            data = { message: `Bio should be not be more than ${bioLimit}` }
            status = 500
            return NextResponse.json({ data }, { status })
        }
        if (username > 3) {
            data = { message: "Username should be at least 3 letters long" }
            status = 500
            return NextResponse.json({ data }, { status })
        }

        let socialLinksArr = Object.keys(social_links)

        try {
            for (let i = 0; i < socialLinksArr.length; i++) {
                if (social_links[socialLinksArr[i]].length) {
                    let hostName = new URL(social_links[socialLinksArr[i]]).hostname;

                    if (!hostName.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website') {
                        data = { message: `${socialLinksArr[i]} link is invalid` }
                        status = 200
                        return NextResponse.json({ data }, { status })
                    }
                }
            }
        } catch (error) {
            data = { message: "You must provide full social links with http(s) included" }
            status = 200
            return NextResponse.json({ data }, { status })
        }

        let UpadateObj = {
            'personal_info.username': username,
            'personal_info.bio': bio,
            social_links
        }

        await User.findOneAndUpdate({ _id: userId }, UpadateObj, {
            runValidaters: true
        }).then(() => {
            data = { username }
            status = 200
            return NextResponse.json({ data }, { status })
        }).catch((err) => {
            data = { message: err.message }
            console.log(err.message);
            status = 500
            return NextResponse.json({ data }, { status })
        })


    }
    return NextResponse.json({ data }, { status })
}

