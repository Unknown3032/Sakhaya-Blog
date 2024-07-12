export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'


import connectDB from '@/middleware/Connectdb';
import User from '@/models/User';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken'


const bcrypt = require('bcrypt');

export async function POST(req) {
    // dbconnection 
    connectDB();

    // variables
    let data;
    let status;

    // regex
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    // request.body 
    const { fullname, email, password } = await req.json()

    // checking conditoins 
    if (fullname.length < 3) {
        data = { "error": "fullname at least 3 letter long" }
        status = 403

        return NextResponse.json({ data }, { status })

    }

    if (email.length <= 0) {
        data = { "error": "Email is required" }
        status = 403

        return NextResponse.json({ data }, { status })
    }

    if (!emailRegex.test(email)) {
        data = { "error": "Email is invalid" }
        status = 403

        return NextResponse.json({ data }, { status })
    }

    if (!passwordRegex.test(password)) {
        data = { "error": "Password should be 6 to 20 charaters long with 1 numeric, 1 lowercase and 1 uppercase" }
        status = 403

        return NextResponse.json({ data }, { status })
    }


    // hashing password 
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })



    // creating unique user name 
    const userNameGenrator = async (email) => {
        let username = email.split("@")[0]
        let uniqueUserName = await User.exists({ "personal_info.username": username }).then((result) => result)
        uniqueUserName ? username += nanoid().substring(0, 5) : ""

        return username
    }

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

    // insert data new user in database 
    let username = await userNameGenrator(email)
    let user = await new User({
        personal_info: { fullname, email, password: hashedPassword, username }
    })
    await user.save().then((u) => {
        data = formattedData(u)
        status = 200
        return new Response("hello", {
            status: 200,
        })
    }).catch((e) => {
        if (e.code === 11000) {
            // console.log("Email already exists");
            data = { "error": "Email already exists" }
            status = 500
            return NextResponse.json({ "error": "Email already exists" }, { status: 500 })
        }

        console.log("error", e.message);
    });



    return NextResponse.json({ data }, { status })

}

// export default connectDb(handler);