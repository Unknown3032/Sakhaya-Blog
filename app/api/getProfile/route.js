export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'


import connectDB from '@/middleware/Connectdb';
import User from '@/models/User';





export async function POST(req) {

    let data;
    let status;
    let { username } = await req.json()

    // connectDB();
    connectDB();
    let findQuery = { 'personal_info.username': username }


    await User.findOne(findQuery)
        .select("-personal_info.password -google_auth -updatedAt -blogs")
        .then(user => {
            // console.log(blogs);
            data = { user };
            status = 200;
            return NextResponse.json({ data }, { status })
        })
        .catch(err => {
            data = { message: "Failed To fetch User" }
            status = 500;
            return NextResponse.json({ data }, { status })
        })

    return NextResponse.json({ data }, { status })
}

