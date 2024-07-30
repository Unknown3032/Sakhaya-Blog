'use client'

import { BlogContext } from '@/app/blogPage/[slug]/page'
import React, { useContext, useState } from 'react'
import { ImCross } from "react-icons/im";
import CommentField from './CommentField';
import axios from 'axios';
import NoDataFound from './NoDataFound';
import CommentCard from './CommentCard';

import { fadeIn } from '@/Common/Animate'
import { motion } from 'framer-motion';

export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFunc, comment_array = null, }) => {
    let res;

    await axios.post(process.env.NEXT_PUBLIC_URL + "/api/getBlogComment", { blog_id, skip })
        .then(({ data: { data } }) => {

            data?.comments?.map(comment => {
                comment.childrenLevel = 0;
            })

            setParentCommentCountFunc(preVal => preVal + data?.comments?.length)

            if (comment_array == null) {
                res = { results: data?.comments }
            } else {
                res = { results: [...comment_array, ...data?.comments] }
            }
        })

    return res;
}

const CommentsComponent = () => {

    const [indexReply, setIndexReply] = useState(0)

    let { blog, commentsWrapper, setCommentsWrapper, blog: { _id, title, comments: { results: commentsArr }, activity: { total_parent_comments } }, totalParentCommentLoaded, setTotalParentCommentLoaded, setBlog } = useContext(BlogContext)

    const loadMoreComments = async () => {
        let newCommentsArr = await fetchComments({ skip: totalParentCommentLoaded, blog_id: _id, setParentCommentCountFunc: setTotalParentCommentLoaded, comment_array: commentsArr })

        setBlog({ ...blog, comments: newCommentsArr })
    }



    return (
        <div className={'max-sm:w-full fixed ' + (commentsWrapper ? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]') + ' duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden'}>

            <div className='relative'>
                <h1 className='text-xl font-medium'>Comments</h1>
                <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>
                    {title}
                </p>

                <button
                    onClick={() => setCommentsWrapper(!commentsWrapper)}
                    className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'>
                    <ImCross className='text-2xl mt-1' />
                </button>

                <hr className='border-grey my-8 w-[120%] -ml-10' />

                <CommentField action={'Comment'} />

                {
                    commentsArr && commentsArr.length
                        ?
                        commentsArr?.map((comment, i) => {
                            return commentsArr[i]?.commented_by?.personal_info?.fullname && <motion.div
                                variants={fadeIn(0.2)}
                                initial='hidden'
                                animate='show'
                                exit='hidden'
                                key={i}
                            >
                                <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentsData={comment} setIndexReply={setIndexReply} />
                            </motion.div>

                        })

                        :
                        <NoDataFound message={"no comments found"} />
                }

                {
                    total_parent_comments > totalParentCommentLoaded ?
                        <button
                            onClick={loadMoreComments}
                            className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'>
                            Load More
                        </button>
                        : ""
                }
            </div>
        </div >
    )
}

export default CommentsComponent