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


    // to delete the comments 
    const deleteComments = (commentId) => {
        Comment.findOneAndDelete({ _id: commentId })
            .then(comment => {
                if (comment.parent) {
                    Comment.findOneAndUpdate({ _id: comment.parent }, { $pull: { children: commentId } })
                        .then(data => console.log("comment delete from parent"))
                        .catch(err => console.log(err))
                }

                Notification.findOneAndDelete({ comment: commentId })
                    .then(notification => console.log('comment notification deleted'))

                Notification.findOneAndUpdate({ reply: commentId }, { $unset: { reply: 1 } })
                    .then(notification => console.log('reply notification deleted'))

                Blog.findOneAndUpdate({ _id: comment.blog_id }, { $pull: { comments: commentId }, $inc: { "activity.total_comments": -1, "activity.total_parent_comments": comment.parent ? 0 : -1 } })
                    .then(blog => {
                        if (comment.children.length) {
                            comment.children.map(replies => {
                                deleteComments(replies)
                            })
                        }
                    })
            })
            .catch(err => {
                console.log("first", err.message)
            })
    }

    // check user is logged in or not 
    if (userId) {
        let { _id } = await req.json();

        Comment.findOne({ _id })
            .then(comment => {
                if (userId == comment.commented_by || userId == comment.blog_author) {
                    deleteComments(_id)
                    data = { "staus": "done" }
                    status = 200;

                    return NextResponse.json({ data }, { status })

                }
            }).catch(err => {
                data = { message: "Something went wrong" }
                status = 500;
                console.log("last", err.message);
                return NextResponse.json({ data }, { status })
            })


        return NextResponse.json({ data }, { status })
    }
    return NextResponse.json({ data }, { status })
}

