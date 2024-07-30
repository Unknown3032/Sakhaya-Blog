export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'


import User from '@/models/User';
import jwt from 'jsonwebtoken'
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
        let { page, filter, deletedDocCount } = await req.json()

        let maxLimit = 10;
        let skipDoc = (page - 1) * maxLimit;

        let findQuery = { notification_for: userId, user: { $ne: userId } }

        if (filter != 'all') {
            findQuery.type = filter
        }

        if (deletedDocCount) {
            skipDoc -= deletedDocCount;
        }

        await Notification.find(findQuery)
            .skip(skipDoc)
            .limit(maxLimit)
            .populate("blog", "title blog_id")
            .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
            .populate("comment", "comment")
            .populate("replied_on_comment", "comment")
            .populate("reply", "comment")
            .sort({ createdAt: -1 })
            .select("createdAt type seen reply")

            .then(async (notifications) => {

                await Notification.updateMany(findQuery, { seen: true })
                    .skip(skipDoc)
                    .limit(maxLimit)
                    .then(() => {
                        console.log("notification seen");
                    })

                data = { notifications }
                status = 200
                return NextResponse.json({ data }, { status })
            })
            .catch((err) => {
                console.log(err.message);
                data = err.message
                status = 500
                return NextResponse.json({ data }, { status })
            })

    }
    return NextResponse.json({ data }, { status })
}

