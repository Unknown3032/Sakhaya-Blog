"use client"; // This is a client component 👈🏽
import React, { useContext, useEffect, useState } from 'react'
import UserNavigation from './UserNavigation';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';


// icons 
import { IoMdSearch } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { LuFileEdit } from "react-icons/lu";
import { GoBell } from "react-icons/go";
import { UserContext } from '@/app/layout';
import axios from 'axios';
import { storeInSession } from '@/SessionFunc';


const Navbar = () => {
    const [search, setSearch] = useState(false) // This is a client component 👈🏽
    const [userNavigate, setUserNavigate] = useState(false) // This is a client component 👈🏽
    const { userAuth, userAuth: { token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext);
    const { push } = useRouter();


    const handleSearchPage = (e) => {
        let query = e.target.value;
        if (e.keyCode == 13 && query.length) {
            push(`/search/${query}`)
            e.target.value = null
        }
    }

    useEffect(() => {

        if (token) {
            axios.get(process.env.NEXT_PUBLIC_URL + '/api/notificatoinNew', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(({ data: { data } }) => {

                let newUserAuth = { ...userAuth, ...data }
                storeInSession("user", JSON.stringify(newUserAuth))
                setUserAuth(newUserAuth)

            })
                .catch(err => {
                    console.log(err.message)
                })
        }

    }, [token])



    return (
        <nav className='navbar z-50'>
            {/* log  */}
            <Link href={"/"} className='w-10 flex-none'>
                <Image className='fill-black' src={"/hindu.jpg"} width={200} height={200} alt='hindu' />
            </Link>

            {/* search  */}
            <div
                className={'absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' + (search ? "show" : "hide")}>
                <input type="text"
                    placeholder='Search'
                    className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
                    onKeyDown={handleSearchPage}
                />
                {/* icon  */}
                <IoMdSearch className='absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-2xl text-dark-grey ' />
            </div>

            {/* buttons  */}
            <div className='flex items-center gap-3 md:gap-6 ml-auto'>
                <button onClick={() => setSearch(!search)} className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'>
                    <IoSearch className='text-xl text-dark-grey ' />
                </button>

                {token && <Link href={"/Editor/empty"} className='hidden md:flex gap-2 link md:justify-center md:items-center'>
                    <LuFileEdit />
                    <p>write</p>
                </Link>}
                {
                    token ?
                        <>
                            <Link href={'/dashboard/notifications'}>
                                <button className=' flex justify-center items-center w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                                    <i className='text-2xl text-dark-grey block mt-1 fi fi-rr-bell'></i>
                                    {/* <GoBell className='text-2xl text-dark-grey block mt-1' /> */}
                                    {new_notification_available ?
                                        <span className='bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2'></span>
                                        : ""}
                                </button>
                            </Link>

                            <div className='relative'
                                onMouseEnter={() => setUserNavigate(true)}
                                onMouseLeave={() => setUserNavigate(false)}
                                onClick={() => setUserNavigate(!userNavigate)}
                            >
                                <button className='w-12 h-12 mt-1'>
                                    <img className='w-full h-full rounded-full object-cover' src={profile_img} alt='profile' />
                                </button>
                                {
                                    userNavigate ?
                                        <UserNavigation /> :
                                        ""
                                }
                            </div>
                        </>
                        :
                        <>
                            <Link href={"/Login"} className='btn-dark py-2'>
                                Sign In
                            </Link>

                            <Link href={"/Signup"} className='btn-light py-2 hidden md:block' >
                                Sign Up
                            </Link>
                        </>
                }

            </div>

        </nav >
    )
}

export default Navbar