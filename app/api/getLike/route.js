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
        let { _id, isLiked } = await req.json();
        let incrementVal = !isLiked ? 1 : -1;

        await Blog.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } })
            .then(async (blog) => {
                if (!isLiked) {
                    let like = new Notification({
                        type: "like",
                        blog: _id,
                        notification_for: blog.author,
                        user: userId
                    })
                    await like.save().then(notification => {
                        data = { message: "true" }
                        status = 200
                        return NextResponse.json({ data }, { status })
                    }).catch(err => {
                        data = { message: false }
                        status = 500
                        return NextResponse.json({ data }, { status })
                    })
                }
                else {
                    await Notification.findOneAndDelete({ user: userId, type: "like", blog: _id })
                        .then(result => {
                            data = { message: false }
                            status = 200
                            return NextResponse.json({ data }, { status })

                        })
                        .catch(err => {
                            data = { message: err.message }
                            status = 500
                            return NextResponse.json({ data }, { status })
                        })
                }
            }).catch(err => {
                data = { message: false }
                status = 500
                return NextResponse.json({ data }, { status })
            })
        return NextResponse.json({ data }, { status })
    }
    return NextResponse.json({ data }, { status })
}

