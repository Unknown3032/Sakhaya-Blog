"use client"
import Loader from '@/Components/Loader';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'

import { fadeIn } from '@/Common/Animate'
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getDay } from '@/Common/Date';
import BlogInteraction from '@/Components/BlogInteraction';
import BlogPostCard from '@/Components/BlogPostCard';
import BlockContent from '@/Components/BlockContent';
import CommentsComponent, { fetchComments } from '@/Components/CommentsComponent';

const blogStructure = {
  title: "",
  content: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
}

export const BlogContext = createContext({})

const Page = ({ params }) => {
  let { slug: blog_id } = params;

  const [blog, setBlog] = useState(blogStructure)
  const [refreshcom, setRefreshcom] = useState(false)
  const [similarBlogs, setSimilarBlogs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [commentsWrapper, setCommentsWrapper] = useState(false)
  const [totalParentCommentLoaded, setTotalParentCommentLoaded] = useState(0)


  let { title, content, banner, author: { personal_info: { fullname, username: blogUsername, profile_img } }, publishedAt } = blog

  const fetchBlog = async () => {
    await axios.post(process.env.NEXT_PUBLIC_URL + "/api/getSingleBlog", { blog_id })
      .then(async ({ data: { data: { blog } } }) => {

        blog.comments = await fetchComments({ blog_id: blog._id, setParentCommentCountFunc: setTotalParentCommentLoaded, })
        setBlog(blog)

        await axios.post(process.env.NEXT_PUBLIC_URL + "/api/searchBlog", { tag: blog?.tags[1], limit: 5, eliminate_blog: blog_id }).then(async ({ data }) => {

          setSimilarBlogs(data?.data?.blogs)
        }).catch(err => {
          console.log(err.message);
        })

        setLoading(false)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  useEffect(() => {
    fetchBlog()

  }, [refreshcom])


  return (
    loading ?
      <Loader /> :
      <BlogContext.Provider value={{ blog, setBlog, isLiked, setIsLiked, commentsWrapper, setCommentsWrapper, totalParentCommentLoaded, setTotalParentCommentLoaded, setRefreshcom, refreshcom }}>
        <div>
          <CommentsComponent />
        </div>
        <motion.div
          variants={fadeIn(0.2)}
          initial='hidden'
          animate='show'
          exit='hidden'
        >
          <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
            <img className='aspect-video' src={banner} alt="" />

            <div className='mt-12'>
              <h2>{title}</h2>

              <div className='flex max-sm:flex-col justify-between my-8'>
                <div className='flex gap-5 items-start'>

                  <img className='w-12 h-12 rounded-full' src={profile_img} alt="" />
                  <p className='capitalize'>
                    {fullname}
                    <br />
                    @
                    <Link className='underline' href={`/user/${blogUsername}`}>{blogUsername}</Link>
                  </p>

                </div>
                <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>Published On {getDay(publishedAt)}</p>

              </div>
            </div>

            <BlogInteraction />
            <div className='my-12 font-gelasio blog-page-content'>
              {
                content[0].blocks.map((block, i) => {
                  return <div className='my-4 md:my-8' key={i}>
                    <BlockContent block={block} />
                  </div>
                })
              }
            </div>
            <BlogInteraction />

            {
              similarBlogs != null && similarBlogs.length ?
                <>
                  <h1 className='text-2xl mt-14 mb-10 font-medium'>
                    Similar Blogs
                  </h1>

                  {
                    similarBlogs?.map((blog, i) => {
                      let { author: { personal_info } } = blog;
                      return (<motion.div
                        key={i}
                        variants={fadeIn(1 * 0.8)}
                        initial='hidden'
                        animate='show'
                        exit='hidden'
                      >
                        <BlogPostCard content={blog} author={personal_info} />
                      </motion.div>)
                    })

                  }


                </> :
                ""
            }
          </div>
        </motion.div>
      </BlogContext.Provider>
  )
}

export default Page