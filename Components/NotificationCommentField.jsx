import { UserContext } from '@/app/layout';
import axios from 'axios';
import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const NotificationCommentField = ({ _id, blog_author, index = undefined, replyingTo = undefined, setReplying, notification_id, notificationData }) => {

    const [comment, setComment] = useState('');
    const { userAuth: { token } } = useContext(UserContext)

    let { _id: user_id } = blog_author;
    let { notifications, notifications: { results }, setNotifications } = notificationData


    const handleComment = () => {
        if (!comment.length) {
            return toast.error("write something to leave a comment...")
        }

        axios.post(process.env.NEXT_PUBLIC_URL + "/api/addComment", {
            _id, blog_author: user_id, comment, replying_to: replyingTo, notification_id
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(async ({ data: { data } }) => {

                setReplying(false)
                results[index].reply = { comment, _id: data._id }
                setNotifications({ ...notifications, results })

            }).catch(err => {
                console.log(err.message);
            })
    }

    return (
        <>
            <Toaster />
            <textarea value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Leave a reply...'
                className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
            ></textarea>

            <button className='btn-dark mt-5 px-10'
                onClick={handleComment}
            >Reply</button>
        </>
    )
}

export default NotificationCommentField