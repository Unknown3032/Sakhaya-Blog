export const dynamic = 'force-dynamic' // defaults to force-static
import { NextResponse } from 'next/server'

import { nanoid } from 'nanoid';
import aws from 'aws-sdk'
require('aws-sdk/lib/maintenance_mode_message').suppress = true;



export async function GET(req) {
    const s3 = new aws.S3({
        region: "ap-south-1",
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    })

    const genrateUploadUrl = async () => {
        const date = new Date();

        const imageName = `${nanoid()}-${date.getTime()}.jpeg`

        let imgurl = await s3.getSignedUrlPromise('putObject', {
            Bucket: "myblogbanner",
            Key: imageName,
            Expires: 1000,
            ContentType: 'image/jpeg'

        })
        return imgurl
    }

    let data;
    const e = await genrateUploadUrl().then((url) => {
        data = url
        return NextResponse.json({ "url": url }, { status: 200 })

    }).catch((err) => {
        data = err.message
    })

    return NextResponse.json({ "url": data }, { status: 200 })



}

// export default connectDb(handler);