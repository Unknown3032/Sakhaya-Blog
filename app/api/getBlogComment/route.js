export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'


import connectDB from '@/middleware/Connectdb';
import Comment from '@/models/Comment';



export async function POST(req) {

    let data;
    let status;
    let maxLimit = 5;
    let { blog_id, skip } = await req.json()
    // db connection 
    await connectDB();

    await Comment.find({ blog_id, isReply: false })
        .populate('commented_by', "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .skip(skip)
        .limit(maxLimit)
        .sort({ "commentedAt": -1 })
        .then(comments => {
            data = { comments };
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

