'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '@/app/layout'
import { useRouter } from 'next/navigation';
import EditorProfile from '@/Components/EditorProfile';
import PasswordChange from '@/Components/PasswordChange';
import Link from 'next/link';


import { IoDocumentTextOutline } from "react-icons/io5";
import { FiBell, FiEdit, FiUser, FiLock } from "react-icons/fi";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";

const Page = ({ params }) => {
    let { slug: curPage } = params
    let { push } = useRouter()


    const [pageState, setPageState] = useState(curPage.replace('-', ' '))
    const [showideNav, setShowSideNav] = useState(false)
    let { userAuth: { token, new_notification_available } } = useContext(UserContext)


    let activeTabLine = useRef()
    let sideBarIconTab = useRef()
    let pageStateTab = useRef()

    useEffect(() => {
        if (token) {
            setShowSideNav(false);

            pageStateTab.current.click();
        }

    }, [pageState])


    const changePageState = (e) => {
        let { offsetWidth, offsetLeft } = e.target;

        activeTabLine.current.style.width = offsetWidth + 'px'
        activeTabLine.current.style.left = offsetLeft + 'px'

        if (e.target == sideBarIconTab.current) {
            setShowSideNav(true)
        } else {
            setShowSideNav(false)
        }
    }


    return (
        token == null ? push('/Login') :
            <>

                <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
                    <div className='sticky top-[80px]  z-30 '>

                        <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>

                            <button ref={sideBarIconTab} onClick={changePageState} className='p-5 capitalize'>
                                <HiOutlineBars3CenterLeft className='pointer-events-none ' />
                            </button>

                            <button ref={pageStateTab} onClick={changePageState} className='p-5 capitalize'>
                                {pageState}
                            </button>

                            <hr ref={activeTabLine} className='absolute bottom-0 duration-500' />

                        </div>

                        <div className={'min-w-[200px] md:h-cover h-[calc(100vh-80px-60px)]  md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+40px)] max-md:px-16 max-md:-ml-7 duration-500 ' + (!showideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")} >
                            <h1 className='text-xl text-dark-grey mb-3'>Dashboard</h1>
                            <hr className=' border-grey -ml-6 mb-8 mr-6 ' />

                            <Link href={'/dashboard/blog'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <IoDocumentTextOutline />
                                Blog
                            </Link>

                            <Link href={'/dashboard/notifications'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <div className='relative'>
                                    {/* <FiBell /> */}
                                    <i className='fi fi-rr-bell'></i>
                                    {
                                        new_notification_available ?
                                            <span className='bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0'></span>
                                            : ""
                                    }
                                </div>
                                Notification
                            </Link>

                            <Link href={'/Editor/empty'} onClick={(e) => setPageState(e.target.innerText)} className='sidebar-link'>
                                <FiEdit />
                                write
                            </Link>

                            <h1 className='text-xl text-dark-grey mt-20 mb-3'>Settings</h1>
                            <hr className=' border-grey -ml-6 mb-8 mr-6 ' />

                            <Link href={'/settings/editProfile'} onClick={(e) => setPageState(e.target.innerText)} className={'sidebar-link ' + (curPage == 'editProfile' ? 'sidebar-link-active' : '')}>
                                <FiUser />
                                Edit Profile
                            </Link>

                            <Link href={'/settings/change-password'} onClick={(e) => setPageState(e.target.innerText)} className={'sidebar-link ' + (curPage == 'change-password' ? 'sidebar-link-active' : '')}>
                                <FiLock />
                                Change Password
                            </Link>

                        </div>

                    </div>


                    <div className='max-md:-mt-8 mt-5 w-full'>
                        {
                            curPage == 'editProfile' ?
                                <EditorProfile /> :
                                ''
                        }
                        {
                            curPage == 'change-password' ?
                                <PasswordChange /> :
                                ''
                        }
                    </div>
                </section>


            </>
    )
}

export default Page