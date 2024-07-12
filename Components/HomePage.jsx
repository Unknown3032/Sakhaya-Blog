"use client";
import { fadeIn } from '@/Common/Animate'
import { motion } from 'framer-motion';
import InPageNavigation, { activeButtonRef, activeTabLineRef } from './InPageNavigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import BlogPostCard from './BlogPostCard';
import MinimalBlogCard from './MinimalBlogCard';
import { FaArrowTrendUp } from "react-icons/fa6";
import NoDataFound from './NoDataFound';
import { FilterPaginationData } from './FilterPaginationData';
import LoadMore from './LoadMore';


const HomePage = () => {

    const [latestBlogs, setLatestBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)
    const [pageSate, setPageSate] = useState("home")
    const category = ["Naruto", "Pain", "Demon Slayer", "JJK", "One Peace", "Solo Leveling", "AOT", "Bleach", "Death Note", "Code Geass"]

    const fetchLatestBlogs = async ({ page }) => {

        await axios.post(process.env.NEXT_PUBLIC_URL + "/api/getLatestBlog", { page })
            .then(async ({ data }) => {

                let formatedData = await FilterPaginationData({
                    state: latestBlogs,
                    data1: data?.data?.blogs,
                    page,
                    countRoute: "/api/latestBlogCount"
                })

                setLatestBlogs(formatedData)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const fetchTrendingBlogs = async () => {
        await axios.get(process.env.NEXT_PUBLIC_URL + "/api/getTrendingBlog").then(({ data }) => {
            // console.log()
            setTrendingBlogs(data?.data?.blogs)
        })
    }

    const fetchBlogByCategory = async ({ page }) => {

        await axios.post(process.env.NEXT_PUBLIC_URL + "/api/searchBlog",
            {
                tag: pageSate.toLowerCase(),
                page
            })
            .then(async ({ data }) => {
                let formatedData = await FilterPaginationData({
                    state: latestBlogs,
                    data1: data?.data?.blogs,
                    page,
                    countRoute: "/api/searchBlogCount",
                    data_to_send: { tag: pageSate }
                })
                // console.log(data?.data?.blogs);
                setLatestBlogs(formatedData)
            })
    }

    const loadCategoryBlog = (e) => {
        let category = e.target.innerText.toLowerCase();
        setLatestBlogs(null)

        if (pageSate == category) {
            setPageSate("home")
            return;
        }

        setPageSate(category)
    }

    useEffect(() => {
        activeButtonRef.current.click();
        if (pageSate == "home") {
            fetchLatestBlogs({ page: 1 });
        } else {
            fetchBlogByCategory({ page: 1 });
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }
    }, [pageSate])



    return (
        <>
            <motion.div
                variants={fadeIn(0.2)}
                initial='hidden'
                animate='show'
                exit='hidden'
            >
                <section className='h-cover flex justify-center gap-10 pl-10'>

                    {/* latest blogs  */}
                    <div className='w-full'>
                        <InPageNavigation className={'flex flex-col justify-center items-center w-full'} routes={[pageSate, "trending page"]} defaultHidden={["trending page"]} >
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
                                <LoadMore state={latestBlogs} fetchDataFunc={(pageSate == 'home' ? fetchLatestBlogs : fetchBlogByCategory)} />
                            </>
                            {!trendingBlogs ?
                                <Loader /> :
                                trendingBlogs.length ?
                                    trendingBlogs?.map((blog, i) => {
                                        return (
                                            <motion.div
                                                variants={fadeIn(0.2, 0.2 * i)}
                                                initial='hidden'
                                                animate='show'
                                                exit='hidden'
                                                key={i}
                                            >
                                                <MinimalBlogCard index={i} content={blog} author={blog.author.personal_info} />
                                            </motion.div>
                                        )
                                    })
                                    :
                                    <NoDataFound message={"No Trending Blogs Found"} />
                            }
                        </InPageNavigation>

                    </div>

                    {/* trending blogs  */}
                    <div className='min-w-[40%] hidden md:block lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3'>
                        <div className='flex flex-col gap-10'>
                            <h1 className='font-medium text-xl mb-8'>Stories from all interests</h1>
                            <div className='flex gap-3 flex-wrap'>
                                {
                                    category?.map((category, i) => {
                                        return <button key={i} className={'tag ' + (pageSate == category.toLowerCase() ?
                                            ' text-white bg-black ' : " ")}
                                            onClick={loadCategoryBlog}
                                        >
                                            {category}
                                        </button>
                                    })
                                }
                            </div>

                            <div>
                                <h1 className='font-medium text-xl mb-8 flex items-center '>Trending <FaArrowTrendUp /></h1>
                                {!trendingBlogs ?
                                    <Loader /> :
                                    trendingBlogs.length ?
                                        trendingBlogs?.map((blog, i) => {
                                            return (
                                                <motion.div
                                                    variants={fadeIn(0.2, 0.2 * i)}
                                                    initial='hidden'
                                                    animate='show'
                                                    exit='hidden'
                                                    key={i}
                                                >
                                                    <MinimalBlogCard index={i} content={blog} author={blog.author.personal_info} />
                                                </motion.div>
                                            )
                                        })
                                        :
                                        <NoDataFound message={"No Trending Blogs Found"} />
                                }
                            </div>
                        </div>
                    </div>

                </section>
            </motion.div >

        </>
    )
}

export default HomePage