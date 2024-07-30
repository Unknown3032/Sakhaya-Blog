'use client'
import { BlogContext } from '@/app/blogPage/[slug]/page'
import { UserContext } from '@/app/layout'
import axios from 'axios'
import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const CommentField = ({ action, index = undefined, replyingTo, setReplying }) => {
    const [comment, setComment] = useState("")

    let { blog: { _id, author: { _id: blog_author }, comments, comments: { results: commentArr }, activity, activity: { total_comments, total_parent_comments } }, setBlog, blog, totalParentCommentLoaded, setTotalParentCommentLoaded, setRefreshcom, refreshcom } = useContext(BlogContext)

    let { userAuth: { token, username, fullname, profile_img } } = useContext(UserContext)


    const handleComment = () => {
        if (!token) {
            return toast.error("Login first to leave a comment")
        }

        if (!comment.length) {
            return toast.error("write something to leave a comment...")
        }

        axios.post(process.env.NEXT_PUBLIC_URL + "/api/addComment", {
            _id, blog_author, comment, replying_to: replyingTo
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(async ({ data: { data } }) => {

                setComment("")
                data.commented_by = { persnal_info: { username, profile_img, fullname } }
                let newCommentArr;


                if (replyingTo) {

                    commentArr[index].children.push(data?._id);

                    data.childrenLevel = (commentArr[index].childrenLevel + 1);


                    data.parentIndex = index;
                    commentArr[index].isReplyLoaded = true;
                    commentArr.splice(index + 1, 0, data)

                    newCommentArr = commentArr

                } else {
                    data.childrenLevel = 0;
                    newCommentArr = commentArr

                }


                let parentCommentIncrementVal = replyingTo ? 0 : 1;

                await setBlog({
                    ...blog, comments: { ...comments, results: newCommentArr },
                    activity: { ...activity, total_comments: total_comments + 1, total_parent_comments: total_parent_comments + 1 }
                })

                setRefreshcom(!refreshcom)
                setTotalParentCommentLoaded(preVal => preVal + parentCommentIncrementVal)

            }).catch(err => {
                console.log(err.message);
            })
    }

    return (
        <>
            <Toaster />
            <textarea value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Leave a comment...'
                className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
            ></textarea>

            <button className='btn-dark mt-5 px-10'
                onClick={handleComment}
            >{action}</button>
        </>
    )
}

export default CommentField