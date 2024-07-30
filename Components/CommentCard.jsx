import { UserContext } from '@/app/layout';
import { getDay } from '@/Common/Date'
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import CommentField from './CommentField';

import { BlogContext } from '@/app/blogPage/[slug]/page';
import axios from 'axios';

import { FaRegCommentDots } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";


const CommentCard = ({ index, leftVal, commentsData, setIndexReply }) => {
    // commentsData?.commented_by?.personal_info.fullname &&
    const [isReplying, setIsReplying] = useState(false)
    const [loadeMoreReply, setloadeMoreReply] = useState(0)

    let { commented_by: { personal_info: { fullname, profile_img, username: commentedByUsername } }, commentedAt, comment, _id, children } = commentsData;

    let { userAuth: { token, username } } = useContext(UserContext);

    let { blog, blog: { comments, activity, activity: { total_parent_comments }, comments: { results: commentsArr }, author: { personal_info: { username: blog_author } } }, setBlog, setTotalParentCommentLoaded } = useContext(BlogContext)


    const handleReplyClick = () => {
        if (!token) {
            return toast.error("login for reply")
        }
        setIndexReply(index)
        setIsReplying(!isReplying)
    }

    const getParent = () => {
        let startingPoint = index + 1;

        try {
            while (commentsArr[startingPoint]?.childrenLevel >= commentsData?.childrenLevel) {
                startingPoint--;
            }
        } catch (error) {
            console.log(error.message);
            startingPoint = undefined
        }
        return startingPoint;

    }

    const removCommentsCards = (startingPoint, isDelete = false) => {

        if (commentsArr[startingPoint]) {
            while (commentsArr[startingPoint].childrenLevel > commentsData.childrenLevel) {
                commentsArr.splice(startingPoint, 1)

                if (!commentsArr[startingPoint]) {
                    break;
                }
            }
        }

        if (isDelete) {
            let parentIndex = getParent();
            if (parentIndex != undefined) {
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id)

                if (!commentsArr[parentIndex].children.length) {
                    commentsArr[parentIndex].isReplyLoaded = false
                }
            }

            commentsArr.splice(index, 1)
        }

        if (commentsData.childrenLevel == 0 && isDelete) {
            setTotalParentCommentLoaded(preVal => preVal - 1)
        }

        setBlog({ ...blog, comments: { results: commentsArr }, activity: { ...activity, total_parent_comments: total_parent_comments - (commentsData.childrenLevel == 0 && isDelete ? 1 : 0) } })
    }

    const hideReplies = () => {
        commentsData.isReplyLoaded = false;

        removCommentsCards(index + 1)
    }

    const loadReplies = ({ skip = 0, currentIndex = index }) => {
        if (commentsArr[currentIndex].children.length) {

            hideReplies();

            axios.post(process.env.NEXT_PUBLIC_URL + "/api/getReplies",
                {
                    _id: commentsArr[currentIndex]._id, skip
                }
            ).then(({ data: { data: { replies } } }) => {

                commentsArr[currentIndex].isReplyLoaded = true;

                for (let i = 0; i < replies.length; i++) {

                    replies[i].childrenLevel = commentsArr[currentIndex].childrenLevel + 1;

                    commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i])
                }

                setloadeMoreReply(getParent())

                setBlog({ ...blog, comments: { ...comments, results: commentsArr } })
            })

        }
    }

    const handleDeleteComment = (e) => {
        e.target.setAttribute("disabled", true)
        console.log("clicked");
        axios.post(process.env.NEXT_PUBLIC_URL + "/api/deleteComment",
            { _id },
            {
                headers: { "Authorization": `Bearer ${token}` }
            }
        ).then(() => {
            e.target.removeAttribute("disabled")
            removCommentsCards(index + 1, true)
        }).catch(err => {
            console.log("flast", err.message);
        })

    }

    const LoadMoreRepliesButton = () => {
        let parentIndex = loadeMoreReply

        let loadBtn = <button onClick={() => loadReplies({ skip: (index - parentIndex), currentIndex: parentIndex })}
            className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
        >
            Load More Replies
        </button>;



        if (commentsArr[index + 1]) {
            if (commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel) {
                if ((index - parentIndex) < commentsArr[parentIndex]?.children?.length) {
                    return loadBtn;

                }
            }
        } else {
            if (parentIndex) {
                if ((index - parentIndex) < commentsArr[parentIndex]?.children?.length) {
                    return loadBtn;
                }
            }
        }


    }

    return (
        <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className='my-5 p-6 rounded-md border border-grey'>

                <div className='flex gap-3 items-center mb-8'>
                    <img className='w-6 h-6 rounded-full' src={profile_img} alt="" />

                    <p className='line-clamp-1'>{fullname} @{commentedByUsername}</p>
                    <p>{getDay(commentedAt)}</p>
                </div>

                <p className='font-gelasio text-xl ml-3'>{comment}</p>

                <div className='flex gap-5 items-center mt-5'>

                    {
                        commentsData.isReplyLoaded ?
                            <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                                onClick={hideReplies}
                            >
                                <FaRegCommentDots />
                                Hide Reply
                            </button >
                            :
                            <button className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
                                onClick={loadReplies}>
                                <FaRegCommentDots />
                                {children?.length} Reply
                            </button>
                    }

                    <button className='underline' onClick={handleReplyClick}>
                        Reply
                    </button>

                    {
                        username == commentedByUsername || username == blog_author ?
                            <button className='p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center'
                                onClick={handleDeleteComment}
                            >
                                <RiDeleteBin6Line className='pointer-events-none' />
                            </button>
                            :
                            ""
                    }
                </div>

                {
                    isReplying ?
                        <div className='mt-8'>
                            <CommentField action={"reply"} index={index} replyingTo={_id} setReplying={setIsReplying} />
                        </div>
                        : ""
                }

            </div>
            {
                commentsArr[index] && <LoadMoreRepliesButton />
            }
        </div>
    )
}


export default CommentCard