export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'

import Blog from '@/models/Blog';
import User from '@/models/User';
import connectDB from '@/middleware/Connectdb';



export async function POST(req) {

    let data;
    let status;



    await Blog.countDocuments({ draft: false })
        .then(count => {
            data = { "totalDocs": count };
            status = 200;
            return NextResponse.json({ data }, { status })
        })
        .catch(err => {
            data = { message: "Failed To count Blogs" }
            status = 500;
            return NextResponse.json({ data }, { status })
        })

    return NextResponse.json({ data }, { status })

}

