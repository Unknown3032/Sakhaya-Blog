import { getDay } from '@/Common/Date';
import Link from 'next/link';

import React from 'react'

const MinimalBlogCard = ({ content, author, index }) => {
    let { fullname, username, profile_img } = author;
    let { title, blog_id: id, publishedAt } = content;

    return (
        <Link className='flex gap-5 mb-8 ' href={`/blogPage/${id}`}>
            <h1 className='blog-index'>{index < 10 ? "0" + (index + 1) : index}</h1>

            <div>
                <div className='flex gap-2 items-center mb-7 '>
                    <img src={profile_img} className='w-6 h-6 rounded-full' alt="" />
                    <p className='line-clamp-1'>{fullname} @{username}</p>
                    <p className='min-w-fit'>{getDay(publishedAt)}</p>

                </div>
                <h1 className='blog-title'>{title}</h1>
            </div>
        </Link>
    )
}

export default MinimalBlogCard