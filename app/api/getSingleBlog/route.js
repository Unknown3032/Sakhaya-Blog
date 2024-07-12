export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'

import Blog from '@/models/Blog';
import User from '@/models/User';
import connectDB from '@/middleware/Connectdb';



export async function POST(req) {

    let data;
    let status;
    let { blog_id, mode, draft } = await req.json();
    let incVal = mode != 'edit' ? 1 : 0;



    await Blog.findOneAndUpdate({ blog_id },
        { $inc: { "activity.total_reads": incVal } }
    )
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
        .select("title des content banner activity publishedAt blog_id tags")
        .then(blog => {
            User.findOneAndUpdate({ "persnal_info.username": blog.author.personal_info.username },
                { $inc: { "account_info.total_reads": incVal } }
            ).catch(err => {
                data = { message: err.message }
                status = 500;
                return NextResponse.json({ data }, { status })
            })

            if (blog.draft && !draft) {
                data = { message: "you can not draft blog" };
                status = 500;
                return NextResponse.json({ data }, { status })
            }

            data = { blog };
            status = 200;
            return NextResponse.json({ data }, { status })
        })
        .catch(err => {
            data = { message: "Failed To fetch Blog" }
            status = 500;
            console.log(err.message);
            return NextResponse.json({ data }, { status })
        })



    return NextResponse.json({ data }, { status })

}

