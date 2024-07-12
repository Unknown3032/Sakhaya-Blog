export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'

import Blog from '@/models/Blog';
import User from '@/models/User';
import connectDB from '@/middleware/Connectdb';



export async function POST(req) {

    let data;
    let status;
    let maxLimit = 5;
    let { page } = await req.json()
    // db connection 
    await connectDB();

    await Blog.find({ draft: false })
        .populate('author', "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {
            data = { blogs };
            status = 200;
            return NextResponse.json({ data }, { status })
        })
        .catch(err => {
            data = { message: "Failed To fetch Blogs" }
            status = 500;
            return NextResponse.json({ data }, { status })
        })

    return NextResponse.json({ data }, { status })

}

