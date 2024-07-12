export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'

import Blog from '@/models/Blog';
import User from '@/models/User';
import connectDB from '@/middleware/Connectdb';



export async function POST(req) {

    let data;
    let status;
    let { tag, query, author } = await req.json();

    let findQuery;
    if (tag) {
        findQuery = { tags: tag, draft: false }
    }

    else if (query) {
        findQuery = { title: new RegExp(query, 'i'), draft: false }
    }

    else if (author) {
        findQuery = { author: author, draft: false }
    }

    await Blog.countDocuments(findQuery)
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

