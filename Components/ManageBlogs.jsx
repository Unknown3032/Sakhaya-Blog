'use client'

import { UserContext } from "@/app/layout"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { FilterPaginationData } from "./FilterPaginationData"
import { Toaster } from "react-hot-toast"
import InPageNavigation from "./InPageNavigation"
import Loader from "./Loader"
import NoDataFound from "./NoDataFound"


import { fadeIn } from '@/Common/Animate'
import { motion } from 'framer-motion';
import { AuthorBlogCard, AuthorDraftCard } from "./AuthorBlogCard"
import LoadMore from "./LoadMore"

const ManageBlogs = () => {

    const [blogs, setBlogs] = useState(null)
    const [drafts, setDrafts] = useState(null)
    const [query, setQuery] = useState(null)

    const { userAuth: { token } } = useContext(UserContext)




    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {

        axios.post(process.env.NEXT_PUBLIC_URL + '/api/author-blogs', {
            page, draft, query, deletedDocCount
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        )
            .then(async ({ data: { data } }) => {


                let formatedData = await FilterPaginationData({
                    state: draft ? drafts : blogs,
                    data1: data.blogs,
                    page,
                    user: token,
                    countRoute: "/api/author-blogs-count",
                    data_to_send: { draft, query }
                })

                if (draft) {
                    setDrafts(formatedData)
                }
                else {
                    setBlogs(formatedData)
                }

            })
            .catch(err => {
                console.log(err.message);
            })

    }

    useEffect(() => {
        if (token) {
            if (blogs == null) {
                getBlogs({ page: 1, draft: false })
            }
            if (drafts == null) {
                getBlogs({ page: 1, draft: true })
            }
        }

    }, [token, blogs, drafts, query])

    const handleSearch = (e) => {
        let searchQuery = e.target.value;

        setQuery(searchQuery);

        if (e.keyCode == 13 && searchQuery.length) {
            setBlogs(null)
            setDrafts(null)
        }
    }

    const handleChange = (e) => {
        if (!e.target.value.length) {
            setBlogs(null)
            setDrafts(null)
            setQuery('')
        }
    }



    return (
        <>
            <h1 className="max-md:hidden">Manage Blogs</h1>

            <Toaster />

            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search Blogs"
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                />

                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>

            </div>

            <InPageNavigation routes={['Published Blogs', 'Drafts']} defaulActiveIndex={activeTab != 'draft' ? 0 : 1}>

                {
                    blogs == null ? <Loader /> :
                        blogs.results.length ?
                            <>
                                {
                                    blogs.results.map((blog, i) => {
                                        return (
                                            <motion.div
                                                key={i}
                                                variants={fadeIn(0.2, 0.2 * i)}
                                                initial='hidden'
                                                animate='show'
                                                exit='hidden'
                                            >
                                                <AuthorBlogCard blog={{ ...blog, index: i, setStateFunc: setBlogs }} />
                                            </motion.div>
                                        )
                                    })

                                }

                                <LoadMore state={blogs} fetchDataFunc={getBlogs} additionalParam={{ draft: false, deletedDocCount: blogs.deletedDocCount }} />
                            </>
                            :
                            <NoDataFound message={'No Published Blog'} />
                }

                {
                    drafts == null ? <Loader /> :
                        drafts.results.length ?
                            <>
                                {
                                    drafts.results.map((blog, i) => {
                                        return (
                                            <motion.div
                                                key={i}
                                                variants={fadeIn(0.2, 0.2 * i)}
                                                initial='hidden'
                                                animate='show'
                                                exit='hidden'
                                            >
                                                <AuthorDraftCard blog={{ ...blog, index: i, setStateFunc: setDrafts }} />
                                            </motion.div>
                                        )
                                    })

                                }

                                <LoadMore state={drafts} fetchDataFunc={getBlogs} additionalParam={{ draft: true, deletedDocCount: drafts.deletedDocCount }} />
                            </>
                            :
                            <NoDataFound message={'No Draft Blog'} />
                }

            </InPageNavigation>

        </>
    )
}

export default ManageBlogs

