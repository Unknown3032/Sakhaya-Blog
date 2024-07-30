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
        let { _id, comment, blog_author, replying_to, notification_id } = await req.json();

        if (!comment.length) {
            data = { error: "write someting in order to leave comment" }
            status = 403
            return NextResponse.json({ data }, { status })
        }

        let commenObj = {
            blog_id: _id, comment, blog_author, commented_by: userId
        }

        if (replying_to) {
            commenObj.parent = replying_to;
            commenObj.isReply = true;
        }

        await new Comment(commenObj).save().then(async commentFile => {
            let { comment, commentedAt, children } = commentFile;

            await Blog.findOneAndUpdate({ _id }, {
                $push: { "comments": commentFile?._id },
                $inc: { "activity.total_parent_comments": replying_to ? 0 : 1, "activity.total_comments": 1 },
            }).then(blog => {
                console.log("new comment created");
            }).catch(err => {
                console.log(err.message);
            })

            let notificationObj = {
                type: replying_to ? "reply" : "comment",
                blog: _id,
                notification_for: blog_author,
                user: userId,
                comment: commentFile
            }

            if (replying_to) {
                notificationObj.replied_on_comment = replying_to;

                await Comment.findOneAndUpdate({ _id: replying_to }, { $push: { children: commentFile._id } })
                    .then(replyingToCommentDoc => { notificationObj.notification_for = replyingToCommentDoc.commented_by })

                if (notification_id) {
                    Notification.findOneAndUpdate({ _id: notification_id }, { reply: commentFile._id })
                        .then(() => {
                            console.log("notification updated");
                        }).catch(err => {
                            console.log(err.message);
                        })
                }
            }

            new Notification(notificationObj).save().then(notificationFile => console.log('notification created'))

            data = { comment, commentedAt, _id: commentFile._id, user_id: userId, children }

        })


        return NextResponse.json({ data }, { status })
    }
    return NextResponse.json({ data }, { status })
}

