export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'


import Blog from '@/models/Blog';
import connectDB from '@/middleware/Connectdb';





export async function POST(req) {

    let data;
    let status;
    let { tag, page, query, author, limit, eliminate_blog } = await req.json()
    let maxLimit = limit ? limit : 5;

    connectDB();

    let findQuery;
    if (tag) {
        findQuery = {
            tags: tag, draft: false, blog_id: { $ne: eliminate_blog }
        }
    }

    else if (query) {
        findQuery = { title: new RegExp(query, 'i'), draft: false }
    }

    else if (author) {
        console.log(author);
        findQuery = { author: author.toLowerCase(), draft: false }
    }


    await Blog.find(findQuery)
        .populate('author', "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {
            // console.log(blogs);
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

