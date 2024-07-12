export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'


import connectDB from '@/middleware/Connectdb';
import User from '@/models/User';
import jwt from 'jsonwebtoken'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
var serviceAccount = require("../../../nextjs-blog-77594-firebase-adminsdk-3dbr5-de3ee00839.json");



export async function POST(req) {
    // dbconnection 
    connectDB();

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    let luser



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

    // creating unique user name 
    const userNameGenrator = async (email) => {
        let username = email.split("@")[0]
        let uniqueUserName = await User.exists({ "personal_info.username": username }).then((result) => result)
        uniqueUserName ? username += nanoid().substring(0, 5) : ""

        return username
    }

    let { token } = await req.json()

    await getAuth().verifyIdToken(token).then(async (decodedUser) => {
        let { name, email, picture } = decodedUser

        picture = picture.replace("s96-c", "s384-c")

        let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
            return u || null
        }).catch((err) => {
            return NextResponse.json({ "error": err.message }, { status: 500 })
        })

        // login check 
        if (user) {
            if (!user.google_auth) {
                return NextResponse.json({ "error": "This email is signed up without google. Please login with password to access account" }, { status: 500 })
            }
        }
        else {// signup
            let username = await userNameGenrator(email)
            user = new User({
                personal_info: { fullname: name, email, username },
                google_auth: true
            })

            await user.save().then((u) => {
                user = u
            }).catch((err) => {
                console.log(err.message);
                return NextResponse.json({ "error": err.message }, { status: 500 })
            })
        }

        luser = user

    }).catch((err) => {
        return NextResponse.json("{ error }", { status: 403 })
    })


    return NextResponse.json(formattedData(luser), { status: 200 })

}