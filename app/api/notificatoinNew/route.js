export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'


import User from '@/models/User';
import jwt from 'jsonwebtoken'
import Notification from '@/models/Notification';




export async function GET(req) {

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
        await Notification.exists({ notification_for: userId, seen: false, user: { $ne: userId } })
            .then((result) => {
                if (result) {
                    data = { new_notification_available: true };
                    status = 200;
                    return NextResponse.json({ data }, { status })
                }
                else {
                    data = { new_notification_available: false }
                    status = 200;
                    return NextResponse.json({ data }, { status })
                }

            })
            .catch(err => {
                data = err.message
                status = 500;
                console.log(err.message);
                return NextResponse.json({ data }, { status })
            })
    }
    return NextResponse.json({ data }, { status })
}

