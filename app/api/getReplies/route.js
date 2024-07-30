export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'

import Blog from '@/models/Blog';
import User from '@/models/User';
import connectDB from '@/middleware/Connectdb';
import Comment from '@/models/Comment';




export async function POST(req) {

    let data;
    let status;
    let { _id, skip } = await req.json();
    let maxLimit = 5



    await Comment.findOne({ _id })
        .populate({
            path: "children",
            options: {
                limit: maxLimit,
                skip: skip,
                sort: { 'commentedAt': -1 }
            },
            populate: { path: "commented_by", select: "personal_info.profile_img personal_info.fullname personal_info.username" },
            select: "-blog_id, -updatedAt"
        })
        .select("children")
        .then(doc => {
            data = { replies: doc.children }
            status = 200;
            return NextResponse.json({ data }, { status })
        })
        .catch(err => {
            data = { message: err.message }
            status = 500;
            console.log(err.message);
            return NextResponse.json({ data }, { status })
        })



    return NextResponse.json({ data }, { status })

}

