"use client"
import { UserContext } from '@/app/layout';
import AboutProfile from '@/Components/AboutProfile';
import Loader from '@/Components/Loader';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'

import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/Common/Animate';
import BlogPostCard from '@/Components/BlogPostCard';
import { FilterPaginationData } from '@/Components/FilterPaginationData';
import NoDataFound from '@/Components/NoDataFound';
import LoadMore from '@/Components/LoadMore';
import InPageNavigation from '@/Components/InPageNavigation';
import { useRouter } from 'next/navigation';

export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: ""
    },
    account_info: {
        total_posts: 0,
        total_reads: 0,
    },
    social_links: {},
    joinedAt: ""
}

const Page = ({ params }) => {
    let profileId = params?.slug;
    const [profile, setProfile] = useState(profileDataStructure)
    const [profileBlogLoaded, setProfileBlogLoaded] = useState("")
    const [loading, setLoading] = useState(true)
    const [latestBlogs, setLatestBlogs] = useState(null)
    const { push } = useRouter();

    let { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile;

    let { userAuth: { username } } = useContext(UserContext)

    const fetchUserProfile = async () => {
        await axios.post(process.env.NEXT_PUBLIC_URL + '/api/getProfile', {
            username: profileId
        }).then(({ data }) => {
            if (data?.data?.user != null) {
                setProfile(data?.data?.user)
            }
            setProfileBlogLoaded(profileId)
            // console.log(data?.data?.user._id);
            let user_id = data?.data?.user._id
            getblogs({ "user_id": user_id })
            setLoading(false)
        }).catch(err => {
            console.log(err.message);
            setLoading(false)
        })
    }

    const getblogs = async ({ page = 1, user_id }) => {

        let user_id1 = user_id?.length ? user_id : latestBlogs?.user_id
        await axios.post(process.env.NEXT_PUBLIC_URL + '/api/searchBlog', {
            author: user_id1,
            page
        }).then(async ({ data }) => {

            let formatedData = await FilterPaginationData({
                state: latestBlogs,
                data1: data?.data?.blogs,
                page,
                countRoute: "/api/searchBlogCount",
                data_to_send: { author: user_id1 }
            })
            formatedData.user_id = user_id;


            setLatestBlogs(formatedData)

        }).catch(err => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        if (profileId != profileBlogLoaded) {
            setLatestBlogs(null)
        }
        if (latestBlogs == null) {
            resetSate()
            fetchUserProfile();
        }
    }, [profileId, latestBlogs])


    const resetSate = () => {
        setProfileBlogLoaded("")
    }

    return (
        loading ? <Loader /> :
            profile_username ?
                <motion.div
                    variants={fadeIn(0.2)}
                    initial='hidden'
                    animate='show'
                    exit='hidden'

                >
                    <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
                        <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] py-10'>

                            <img className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32' src={profile_img} alt="" />

                            <h1 className='text-2xl font-medium'>@{profile_username}</h1>
                            <p className='text-xl capitalize h-6'>{fullname}</p>

                            <p className=''>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>


                            <div className='flex gap-4 mt-2'>
                                {
                                    profileId == username ?
                                        <Link href={'/settings/editProfile'} className='btn-light rounded-md'>
                                            Edit Profile
                                        </Link> : ''
                                }
                            </div>

                            <AboutProfile className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />
                        </div>

                        <div className='max-md:mt-12 w-full'>
                            <InPageNavigation className={'flex flex-col justify-center items-center w-full'} routes={["Blogs published", "About"]} defaultHidden={["About"]} >
                                <>
                                    {!latestBlogs ?
                                        <Loader /> :
                                        latestBlogs?.results?.length ?
                                            latestBlogs?.results?.map((blog, i) => {
                                                return (
                                                    <motion.div
                                                        variants={fadeIn(0.2, 0.2 * i)}
                                                        initial='hidden'
                                                        animate='show'
                                                        exit='hidden'
                                                        key={i}
                                                    >
                                                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                                                    </motion.div>
                                                )
                                            }) :
                                            <NoDataFound message={"No Blogs Found"} />
                                    }
                                    <LoadMore state={latestBlogs} fetchDataFunc={getblogs} />
                                </>

                                <AboutProfile bio={bio} social_links={social_links} joinedAt={joinedAt} />
                            </InPageNavigation>
                        </div>
                    </section>
                </motion.div>
                :

                // notfound 
                <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
                    <img className='select-none border-2 border-grey w-72 aspect-square object-cover rounded' src={'/404.png'} alt="" />

                    <h1 className='text-4xl font-gelasio leading-7'>User not found</h1>
                    <p className='mt-5 text-dark-grey'>The User you are looking for does not exists. Head back to the <Link className='text-black underline' href={'/'}>home page</Link></p>


                    <div className='mt-auto'>
                        <img className='h-8 object-contain block mx-auto select-none' src={'/hindu.jpg'} alt="" />
                        <p className='mt-5 text-dark-grey'>Read millions of stories around the world</p>
                    </div>
                </section>

    )
}

export default Page