"use client"

import { BlogContext } from "@/app/blogPage/[slug]/page";
import { UserContext } from "@/app/layout";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect } from "react"
import { toast, Toaster } from "react-hot-toast";

import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosHeart } from "react-icons/io";


const BlogInteraction = () => {

    let { blog, blog: { _id, title, blog_id, author: { personal_info: { username: authorUsername } }, activity, activity: { total_likes, total_comments } }, setBlog, isLiked, setIsLiked, commentsWrapper, setCommentsWrapper, } = useContext(BlogContext);


    let { userAuth: { username, token } } = useContext(UserContext)


    useEffect(() => {
        if (token) {
            axios.post(process.env.NEXT_PUBLIC_URL + "/api/isLikedByUser", {
                _id
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(({ data: { data: { result } } }) => {
                setIsLiked(Boolean(result))
            }).catch(err => {
                console.log(err.message);
            })

        }

    }, [])


    const handleLike = async () => {
        if (token) {
            setIsLiked(!isLiked);
            !isLiked ? total_likes++ : total_likes--;
            setBlog({ ...blog, activity: { ...activity, total_likes } })

            await axios.post(process.env.NEXT_PUBLIC_URL + "/api/getLike", {
                _id, isLiked
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(({ data: { data } }) => {
                    console.log(data);
                }).catch(err => {
                    console.log(err.message);
                })
        }
        else {
            toast.error("Please login for like blog")
        }
    }

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">

                    {!isLiked ? <button
                        onClick={handleLike}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <CiHeart />
                    </button>
                        :
                        <button
                            onClick={handleLike}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-red/20 text-red">
                            <IoIosHeart />
                        </button>
                    }
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <FaRegCommentDots onClick={() => setCommentsWrapper(!commentsWrapper)} />
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