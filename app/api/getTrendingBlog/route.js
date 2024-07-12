export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'


import Blog from '@/models/Blog';
import User from '@/models/User';
import connectDB from '@/middleware/Connectdb';




export async function GET(req) {

    let data;
    let status;
    let maxLimit = 5;
    await connectDB();

    await Blog.find({ draft: false })
        .populate('author', "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "activity.total_read": -1, "activity.total_like": -1, "publishedAt": -1 })
        .select("blog_id title publishedAt -_id")
        .limit(maxLimit)
        .then(blogs => {
            data = { blogs };
            status = 200;
            return NextResponse.json({ data }, { status })
        })
        .catch(err => {
            console.log(err);
            data = { message: "Failed To fetch Trending Blogs" }
            status = 500;
            return NextResponse.json({ data }, { status })
        })

    return NextResponse.json({ data }, { status })
}

