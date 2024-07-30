"use client"; // This is a client component 👈🏽
import InPageNavigation from '@/Components/InPageNavigation';
import { fadeIn } from '@/Common/Animate'
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Loader from '@/Components/Loader';
import BlogPostCard from '@/Components/BlogPostCard';
import NoDataFound from '@/Components/NoDataFound';
import LoadMore from '@/Components/LoadMore';
import { FilterPaginationData } from '@/Components/FilterPaginationData';
import axios from 'axios';
import UserCard from '@/Components/UserCard';
import { LuUser2 } from "react-icons/lu";

const Page = ({ params }) => {
    const [latestBlogs, setLatestBlogs] = useState(null)
    const [searchUsers, setSearchUsers] = useState(null)


    const searchBlogs = async ({ page, create_new_arr = false }) => {
        await axios.post(process.env.NEXT_PUBLIC_URL + "/api/searchBlog",
            {
                query: params?.slug,
                page
            })
            .then(async ({ data }) => {
                let formatedData = await FilterPaginationData({
                    state: latestBlogs,
                    data1: data?.data?.blogs,
                    countRoute: "/api/searchBlogCount",
                    data_to_send: { query: params?.slug },
                    page,
                    create_new_arr
                })
                // console.log(data?.data?.blogs);
                setLatestBlogs(formatedData)
            })
    }

    const searchUser = async () => {
        await axios.post(process.env.NEXT_PUBLIC_URL + "/api/searchUser",
            {
                query: params?.slug,
            })
            .then(async ({ data }) => {
                setSearchUsers(data?.data?.users)
            }).catch(err => {
                console.log(err.message);
            })
    }

    useEffect(() => {
        searchBlogs({ page: 1, create_new_arr: true })
        // create a resset state function if needed
        searchUser();
    }, [params?.slug])

    const UserWrapCard = () => {
        return (
            <>
                {
                    searchUsers == null ? <Loader /> :
                        searchUsers?.length ?
                            searchUsers.map((user, i) => {
                                return (
                                    <motion.div
                                        variants={fadeIn(0.2, 0.08 * i)}
                                        initial='hidden'
                                        animate='show'
                                        exit='hidden'
                                        key={i}>
                                        <UserCard user={user} />
                                    </motion.div>
                                )
                            }) :
                            <NoDataFound message={'No user found'} />
                }
            </>
        )
    }
    return (
        <motion.div
            variants={fadeIn(0.2)}
            initial='hidden'
            animate='show'
            exit='hidden'
            className='center'
        >
            <section className='h-cover flex justify-center gap-10'>
                <div className='w-full'>
                    <InPageNavigation routes={[`Search results for ${params?.slug}`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                        <>
                            {!latestBlogs ?
                                <Loader /> :
                                latestBlogs?.results.length ?
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
                            <LoadMore state={latestBlogs} fetchDataFunc={searchBlogs} />
                        </>
                        <div>
                            <UserWrapCard />
                        </div>
                    </InPageNavigation>
                </div>

                {/* users  */}
                <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
                    <h1 className='font-medium text-xl mb-8 flex gap-1 items-center'>User realated to search <LuUser2 className='mt-1' /> </h1>
                    <UserWrapCard />
                </div>

            </section>
        </motion.div>
    )
}

export default Page