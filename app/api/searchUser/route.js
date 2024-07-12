export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'


import Blog from '@/models/Blog';
import connectDB from '@/middleware/Connectdb';
import User from '@/models/User';





export async function POST(req) {
    let data;
    let status;
    let maxLimit = 50;
    let { query } = await req.json()

    connectDB()
    let findQuery = { "personal_info.username": new RegExp(query, 'i') }



    await User.find(findQuery)
        .limit(maxLimit)
        .select("personal_info.username personal_info.fullname personal_info.profile_img  -_id")
        .then(users => {
            // console.log(blogs);
            data = { users };
            status = 200;
            return NextResponse.json({ data }, { status })
        })
        .catch(err => {
            data = { message: "Failed To fetch users" }
            status = 500;
            console.log(err.message);
            return NextResponse.json({ data }, { status })
        })

    return NextResponse.json({ data }, { status })
}

