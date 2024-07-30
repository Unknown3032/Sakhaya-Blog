
import Link from 'next/link'
import React, { useState, useContext } from 'react'
import { getDay } from '@/Common/Date'
import NotificationCommentField from './NotificationCommentField'
import { UserContext } from '.././app/layout'
import axios from 'axios'

const NotificationCard = ({ data, index, notificationState }) => {

    let { seen, type, reply, createdAt, comment, replied_on_comment, user, user: { personal_info: { profile_img, username, fullname } }, blog: { blog_id, title, _id }, _id: notification_id } = data

    const [isReplying, setIsReplying] = useState(false)

    const { userAuth: { profile_img: author_profile_img, username: author_username, token } } = useContext(UserContext)
    let { notifications, notifications: { results, totalDocs }, setNotifications } = notificationState

    const handleReply = () => {
        setIsReplying(!isReplying)
    }

    const handleDelete = (comment_id, type, target) => {

        target.setAttribute("disabled", true)

        axios.post(process.env.NEXT_PUBLIC_URL + '/api/deleteComment', { _id: comment_id }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                if (type == 'comment') {
                    results.splice(index, 1)
                } else {
                    delete results[index].reply
                }

                target.removeAttribute("disabled")
                setNotifications({ ...notifications, results, totalDocs: totalDocs - 1, deleteDocCount: notifications.deleteDocCount + 1 })

            }).catch(err => {
                console.log(err.message);
            })

    }


    return (
        <div className={'p-6 border-b border-grey border-l-black ' + (!seen ? 'border-l-2' : '')}>
            <div className='flex gap-5 mb-3'>
                <img className='w-14 h-14 flex-none rounded-full' src={profile_img} alt="" />

                <div className='w-full'>
                    <h1 className='font-medium text-xl text-dark-grey'>
                        <span className='lg:inline-block hidden capitalize'>{fullname}</span>
                        <Link className='mx-1 text-black underline' href={`/user/${username}`}>@{username}</Link>
                        <span className='font-normal'>
                            {
                                type == 'like' ? "liked your blog" :
                                    type == 'comment' ? "commented on your blog" :
                                        "replied on"
                            }
                        </span>
                    </h1>

                    {
                        type == 'reply' ?
                            <div><p>{replied_on_comment.comment}</p></div> :
                            <Link className='font-medium text-dark-grey hover:underline line-clamp-1' href={`/blogPage/${blog_id}`}>"{title}"</Link>
                    }

                </div>

            </div>

            {
                type != 'like' ?
                    <p>{comment.comment}</p> :
                    ''
            }
            <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
                <p>{getDay(createdAt)}</p>

                {
                    type != "like" ?
                        <>
                            {
                                !reply ?
                                    <button onClick={handleReply} className='underline hover:text-black'>Reply</button>
                                    : ''
                            }
                            <button onClick={(e) => handleDelete(comment._id, "comment", e.target)} className='underline hover:text-black'>Delete</button>
                        </>
                        : ''
                }
            </div>
            {
                isReplying ?
                    <div className='mt-8'>
                        <NotificationCommentField _id={_id} blog_author={user} index={index} replyingTo={comment._id} setReplying={setIsReplying} notification_id={notification_id} notificationData={notificationState} />
                    </div>
                    : ""
            }

            {
                reply ?
                    <div className='ml-20 p-5 bg-grey mt-5 rounded-md'>
                        <div className='flex gap-3 mb-3'>
                            <img src={author_profile_img} className='w-8 h-8 rounded-full' />

                            <div>
                                <h1 className='font-medium text-xl text-dark-grey'>
                                    <Link href={`/user/${author_username}`} className='mx-1 text-black underline'>
                                        @{author_username}
                                    </Link>

                                    <span className='font-normal'>replied to</span>

                                    <Link href={`/user/${username}`} className='mx-1 text-black underline'>
                                        @{username}
                                    </Link>
                                </h1>
                            </div>
                        </div>

                        <p className='ml-14 font-gelasio text-xl my-2'>{reply.comment}</p>

                        <button onClick={(e) => handleDelete(reply._id, "reply", e.target)} className='ml-14 mt-2 underline hover:text-black'>Delete</button>

                    </div>
                    : ''

            }

        </div>
    )
}

export default NotificationCard