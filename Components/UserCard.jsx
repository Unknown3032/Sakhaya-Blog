import Link from 'next/link'
import React from 'react'

const UserCard = ({ user }) => {
    let { personal_info: { fullname, username, profile_img } } = user;
    return (
        <Link href={`/user/${username}`}
            className='flex gap-5 items-center mb-5'
        >
            <img className='w-14 h-14 rounded-full' src={profile_img} alt="" />

            <div>
                <h1 className='font-medium text-xl line-clamp-2'>{fullname}</h1>
                <p className='text-dark-grey'>@{username}</p>
            </div>
        </Link>
    )
}

export default UserCard