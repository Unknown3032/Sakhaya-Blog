export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'


import User from '@/models/User';
import jwt from 'jsonwebtoken'
import connectDB from '@/middleware/Connectdb';


const bcrypt = require('bcrypt');


export async function POST(req) {

    connectDB()

    // variables
    let data;
    let status;
    let jwtToken;
    let userId;


    const authorizationToken = headers().get('authorization');
    jwtToken = authorizationToken && authorizationToken.split(" ")[1];

    if (jwtToken == null) {
        data = { message: "No access Token" }
        status = 403;
        console.log("err");
        return NextResponse.json({ data }, { status })
    }



    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            data = { message: "Invalid Token" }
            status = 403;
            return NextResponse.json({ data }, { status })
        }

        userId = user?.id
    })

    // check user is logged in or not 
    if (userId) {
        let { curPassword, newPassword } = await req.json();
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


        if (!passwordRegex.test(curPassword) || !passwordRegex.test(newPassword)) {
            data = { message: "Password must be 6-20 characters long and contain at least one number and one uppercase and lowercase letter." }
            status = 403;
            return NextResponse.json({ data }, { status })
        }


        await User.findOne({ _id: userId }).then(async (user) => {

            if (user.google_auth) {
                data = { message: "You can't change account's password becouse you logged in through google" }
                status = 403;
                return NextResponse.json({ data }, { status })
            }

            const result = await new Promise((resolve, reject) => {
                bcrypt.compare(curPassword, user.personal_info.password, async (err, re) => {
                    if (err) {
                        data = { message: "Something went wrong, try again later" }
                        status = 500;
                        return NextResponse.json({ data }, { status })
                    }


                    resolve(re)
                })
            })
            if (!result) {
                data = { message: "Current password is incorrect" }
                status = 403;
                return NextResponse.json({ data }, { status })
            }

            const hashPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(newPassword, 10, (err, hashed_password) => {
                    if (err) {
                        data = { message: "Something went wrong, try again later" }
                        status = 500;
                        return NextResponse.json({ data }, { status })

                    }

                    resolve(hashed_password)
                })
            })
            if (hashPassword) {
                await User.findOneAndUpdate({ _id: userId }, { "personal_info.password": hashPassword })
                    .then((u) => {
                        data = { message: "Password changed successfully👍" }
                        status = 200;
                        return NextResponse.json({ data }, { status })
                    }).catch(err => {
                        data = { message: "Something went wrong, try again later" }
                        status = 500;
                        return NextResponse.json({ data }, { status })
                    })
            }


        }).catch(err => {
            data = { message: "Something went wrong, try again later" }
            status = 500;
        })

    }

    return NextResponse.json({ data }, { status })
}

