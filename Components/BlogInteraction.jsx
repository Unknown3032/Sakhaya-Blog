"use client"

import { BlogContext } from "@/app/blogPage/[slug]/page";
import { UserContext } from "@/app/layout";
import Link from "next/link";
import { useContext } from "react"

import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";


const BlogInteraction = () => {

    let { blog: { title, blog_id, author: { personal_info: { username: authorUsername } }, activity, activity: { total_likes, total_comments } }, setBlog } = useContext(BlogContext);

    let { userAuth: { username } } = useContext(UserContext)
    return (
        <>
            <hr className="border-grey my-2" />

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">

                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <CiHeart />
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <FaRegCommentDots />
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>

                </div>

                <div className="flex gap-6 items-center">

                    {username == authorUsername ?
                        <Link className="underline hover:text-purple" href={`/Editor/${blog_id}`}>Edit</Link>
                        : ""
                    }

                    <Link href={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
                        <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                    </Link>

                </div>
            </div>

            <hr className="border-grey my-2" />
        </>
    )
}

export default BlogInteraction