export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'


import User from '@/models/User';
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid';
import Blog from '@/models/Blog';
import Notification from '@/models/Notification';
import Comment from '@/models/Comment';


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
        let { blog_id } = await req.json();

        await Blog.findOneAndDelete({ blog_id })
            .then((blog) => {
                Notification.deleteMany({ blog: blog._id }).then(data => console.log('notification deleted'))
                Comment.deleteMany({ blog_id: blog._id }).then(data => console.log('comment deleted'))


                User.findOneAndUpdate({ _id: userId }, { $pull: { blog: blog._id }, $inc: { "account_info.total_posts": -1 } })
                    .then((user) => {
                        console.log("blog deleted");
                    })

                data = { status: "done" }
                status = 200;
                return NextResponse.json({ data }, { status })
            }).catch(err => {
                data = { message: "Error deleting blog" }
                status = 500;
                return NextResponse.json({ data }, { status })
            })


    }
    return NextResponse.json({ data }, { status })
}

