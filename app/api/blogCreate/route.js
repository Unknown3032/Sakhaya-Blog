export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'


import User from '@/models/User';
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid';
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
        let { banner, title, des, content, tags, draft, id } = await req.json();

        if (!title?.length) {
            data = { message: "Give title to your blog " }
            status = 403;
            return NextResponse.json({ data }, { status })
        }

        if (!draft) {

            if (!des?.length || des.length > 200) {
                data = { message: "Write description ('max length is 200') for your blog in order to publish it" }
                status = 403;
                return NextResponse.json({ data }, { status })
            }

            if (!banner?.length) {
                data = { message: "Upload blog Banner for your blog in order to publish it" }
                status = 403;
                return NextResponse.json({ data }, { status })
            }

            if (!tags?.length) {
                data = { message: "Add atleast one tag for your blog in order to publish it" }
                status = 403;
                return NextResponse.json({ data }, { status })
            }

            if (!content?.blocks?.length) {
                data = { message: "Write some content for your blog in order to publish it" }
                status = 403;
                return NextResponse.json({ data }, { status })
            }

        }



        tags = tags?.map(tag => tag.toLowerCase())
        let blog_id = id || title.replace(/[^a-zA-Z1-9]/g, " ").replace(/\s+/g, "-").trim() + nanoid();

        if (id) {
            await Blog.findOneAndUpdate({ blog_id }, { banner, title, des, content, tags, draft: draft ? draft : false })
                .then(() => {
                    data = { id: blog_id }
                    status = 200;
                    return NextResponse.json({ data }, { status })
                }).catch(err => {
                    console.log(err.message);

                    data = { message: err.message }
                    status = 500;
                    return NextResponse.json({ data }, { status })
                })

        } else {
            let blog = new Blog({
                title, banner, des, content, tags, author: userId, blog_id, draft: draft ? draft : false
            })
            await blog.save().then(async blog => {
                let incrementBlogLen = draft ? 0 : 1;

                await User.findOneAndUpdate({ _id: userId }, { $inc: { "account_info.total_posts": incrementBlogLen }, $push: { "blogs": blog._id } }).then(user => {
                    data = { message: blog._id }
                    status = 200;
                    return NextResponse.json({ data }, { status })

                }).catch(err => {
                    console.log(err.message);

                    data = { message: "filed to update total number of posts" }
                    status = 500;
                    return NextResponse.json({ data }, { status })
                })

            }).catch(err => {
                console.log(err.message);
                data = { message: "filed to publish blog" }
                status = 500;
                return NextResponse.json({ data }, { status })
            })
        }



    }

    return NextResponse.json({ data }, { status })

}

