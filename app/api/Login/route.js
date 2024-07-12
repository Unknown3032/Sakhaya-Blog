export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'


import connectDB from '@/middleware/Connectdb';
import User from '@/models/User';
import jwt from 'jsonwebtoken'


const bcrypt = require('bcrypt');


export async function POST(req) {
    // dbconnection 
    connectDB();

    // variables
    let data;
    let status;
    let error

    // format frontend data 
    const formattedData = (user) => {
        const token = jwt.sign({ "id": user._id }, process.env.JWT_SECRET);
        return {
            token,
            "profile_img": user.personal_info.profile_img,
            "username": user.personal_info.username,
            "fullname": user.personal_info.fullname,
        }
    }


    // request.body 
    const { email, password } = await req.json()

    // find user by email
    await User.findOne({ "personal_info.email": email }).then(async (user) => {
        if (!user) {
            data = { "error": "Email not found" }
            status = 403
            return NextResponse.json({ "error": "Email not found" }, { status: 403 })
        }

        if (!user.google_auth) {

            // check password 
            const result = await new Promise((resolve, reject) => {
                bcrypt.compare(password, user?.personal_info?.password, (err, re) => {
                    if (err) reject(err)
                    error = err
                    resolve(re)
                });
            })


            if (error) {
                data = { "error": "Error ocuured please try again" }
                status = 403
                return NextResponse.json({ "error": "Error ocuured please try again" }, { status: 403 })
            }

            if (!result) {
                status = 403
                data = { "error": "Password is incorrect" }
                return NextResponse.json({ "error": "Password is incorrect" }, { status: 403 })
            }

            else {
                data = formattedData(user)
                status = 200
                return NextResponse.json({ "message": "Logged in successfully", "data": formattedData(user) })
            }
        }
        else {
            status = 403
            data = { "error": "Account was created using google. Please try to log in with google" }
            return NextResponse.json({ "error": "Account was created using google. Please try to log in woth google" }, { status: 403 })
        }
    })

    return NextResponse.json({ data }, { status })

}