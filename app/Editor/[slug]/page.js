"use client"; // This is a client component 👈🏽
import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from '../../layout'
// import BlogEditor from '@/Components/BlogEditor';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/Components/Loader';
import axios from 'axios';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const blogSturcture = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: {} }
}

export const EditorContext = createContext({})




const Editor = ({ params }) => {
    let { userAuth: { token }, setCriteria } = useContext(UserContext)
    const [blog, setBlog] = useState(blogSturcture)
    const [textEditor, setTextEditor] = useState({ isReady: false })
    const [loading, setLoading] = useState(true)
    const router = useRouter()


    let { slug: blogId } = useParams()

    useEffect(() => {
        if (token) {
            setCriteria(true)
        }
        if (blogId == 'empty') {
            setLoading(false)
            return
        }

        axios.post(process.env.NEXT_PUBLIC_URL + "/api/getSingleBlog", { blog_id: blogId, draft: true, mode: "edit" })
            .then(({ data: { data: { blog } } }) => {
                setBlog(blog)
                setLoading(false)
            }).catch(err => {
                setBlog(null)
                setLoading(false)
            })
    }, [])


    if (!token) {
        return router.push('/')
    }

    return (
        <>
            <EditorContext.Provider value={{ blog, setBlog, textEditor, setTextEditor }}>
                <div>
                    {
                        loading ? <Loader /> :
                            // <BlogEditor />
                            <></>
                    }
                </div>
            </EditorContext.Provider>
        </>
    )
}

export default Editor