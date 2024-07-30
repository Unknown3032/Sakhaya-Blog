import React, { useContext, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation';


import Image from 'next/image'
import Link from 'next/link'

// import PublishModal from './PublishModal';

import { uploadImage } from '@/middleware/aws'
import toast, { Toaster } from 'react-hot-toast';



// context 
import { UserContext } from '@/app/layout'
import { EditorContext } from '@/app/Editor/[slug]/page'
import EditorJS from '@editorjs/editorjs';
import { tools } from './EditorTools'

//modals import 
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, modal } from "@nextui-org/react";
import Tag from './Tag';
import axios from 'axios';




const BlogEditor = () => {
    let { setCriteria, userAuth: { token } } = useContext(UserContext)
    let { blog, blog: { title, banner, content, tags, des }, setBlog, setTextEditor, textEditor } = useContext(EditorContext)
    const { push } = useRouter();
    let imageUrl = banner.length ? banner : '/blogBanner.png'
    const [imgUrl, setImgUrl] = useState(imageUrl)
    const router = useRouter()
    let { slug: blogId } = useParams()

    //modal states 
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [scrollBehavior, setScrollBehavior] = React.useState("outside");
    const [modal, setModal] = useState(null)
    let characterLimit = 200;
    let tagLimit = 10;

    // console.log(blog.banner);

    useEffect(() => {

        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: 'textEditor',
                tools: tools,
                data: Array.isArray(content) ? content[0] : content,
                placeholder: "Start writing your brilliant story from here"
            })
            )
        }

        // setCriteria(true)
    }, [])

    const handleBannerUpload = async (e) => {
        let img = e.target.files[0]

        const tos = toast.loading("Uploading Image...")
        if (img) {
            //do something else
            await uploadImage(img).then((url) => {
                setBlog({ ...blog, banner: url })
                setImgUrl(url)
                toast.dismiss(tos);
            }).catch(err =>
                toast.error("Some went wrong ")
            )
        }
        toast.success("Uploaded 👍");
    }

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault()
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + 'px'
        setBlog({ ...blog, title: input.value })
    }

    const handlePublish = () => {
        if (!banner?.length) {
            return toast.error("Upload blog Banner for your blog in order to publish it")
        }

        else if (!title?.length) {
            return toast.error("Give title to your blog in order to publish it")
        }
        else if (textEditor.isReady) {
            textEditor.save().then(content => {
                if (content?.blocks.length) {
                    setBlog({ ...blog, content: content });
                    setModal(onOpen)
                } else {
                    return toast.error("Write some content for your blog in order to publish it")
                }
            })
                .catch((err => {
                    console.log(err)
                }))
        }
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, title: input.value })
    }

    const handleBlogDesChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, des: input.value })
    }


    const handleTagKeyDown = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault();
            let tag = e.target.value;


            if (tags.length < tagLimit) {
                if (!tags.includes(tag) && tag?.length > 1) {
                    setBlog({ ...blog, tags: [...tags, tag] })
                }
            } else {
                toast.error(`You can max ${tagLimit} Tags`)
            }

            e.target.value = "";
        }
    }


    const handlePublishForm = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            return toast.error("Give title to your blog in order to publish it")
        }

        if (!tags.length) {
            return toast.error("Add atleast one tag for your blog in order to publish it")
        }

        if (!des.length || des.length > characterLimit) {
            return toast.error(`Write description ('max length is ${characterLimit} ') for your blog in order to publish it`)
        }

        let loadingToast = toast.loading("Publishing🤔...")

        e.target.classList.add("disable");

        let blogObj = {
            title, des, banner, tags, content, draft: false
        }

        let sentData = {
            ...blogObj
        }

        if (blogId != "empty") {
            sentData = {
                ...blogObj,
                id: blogId,
            }
        }

        axios.post(process.env.NEXT_PUBLIC_URL + "/api/blogCreate", sentData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(({ response }) => {
                e.target.classList.remove("disable");
                toast.dismiss(loadingToast);
                toast.success("Blog published successfully👍")

                setTimeout(() => {
                    push("/");
                }, 2000);

            }).catch(({ response }) => {
                toast.error(response?.data?.message);
            })
    }

    const handleSaveDraft = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            return toast.error("Give title to your blog in order to publish it")
        }


        let loadingToast = toast.loading("Saving🤔...")

        e.target.classList.add("disable");

        let blogObj = {
            title, des, banner, tags, content, draft: true
        }

        let sentData = {
            ...blogObj
        }

        if (blogId != "empty") {
            sentData = {
                ...blogObj,
                id: blogId,
            }
        }

        axios.post(process.env.NEXT_PUBLIC_URL + "/api/blogCreate", sentData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(({ response }) => {
                e.target.classList.remove("disable");
                toast.dismiss(loadingToast);
                toast.success("Blog saved successfully👍")

                setTimeout(() => {
                    push("/");
                }, 2000);

            }).catch(({ response }) => {
                toast.error(response?.data?.message);
            })
    }

    return (
        <>
            <Toaster />
            {/* Same as */}
            {/* navbar start */}
            <nav className='navbar z-10'>
                <Link href={'/'} className='flex-none w-10'>
                    <Image className='fill-black' src={"/hindu.jpg"} width={200} height={200} alt='hindu' />
                </Link>

                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {title?.length ? title : "New Blog"}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <Button
                        className='whitespace-nowrap bg-black text-white rounded-full px-5 text-xl capitalize hover:bg-opacity-80 py-6'
                        onClick={handlePublish}
                        onPress={modal}
                    >
                        Publish
                    </Button>

                    <button
                        onClick={handleSaveDraft}
                        className='btn-light py-2'>
                        Save
                    </button>
                </div>

            </nav >
            {/* navbar end */}

            <div div className='' >

                <section>
                    {/* main div */}
                    <div className='mx-auto max-w-[900px] w-full z-0'>
                        {/* blog banner */}
                        <div className='relative aspect-video hover:opacity-80 border-4 bg-white border-grey'>
                            <label htmlFor="uploadBanner">
                                <img
                                    src={imgUrl}
                                    alt='Blog Banner'
                                    className='z-20 object-cover cursor-pointer' />

                                <input
                                    id='uploadBanner'
                                    accept='.png, .jpg, .jpeg'
                                    hidden
                                    type="file"
                                    onChange={handleBannerUpload} />
                            </label>
                        </div>

                        {/* Blog title  */}
                        <textarea
                            name="Blog Tittle"
                            placeholder='Blog Tittle'
                            defaultValue={title}
                            className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        >
                        </textarea>

                        <hr className='w-full opacity-10 my-5' />

                        {/* text editor  */}
                        <div id='textEditor' className='font-gelasio'></div>
                    </div>


                </section>
            </div >

            {/* public modal start here  */}
            <div div className='w-[100vw]' >
                <div className="flex flex-col gap-2 h-[100vh]">
                    {/* nextui starts */}
                    <Modal
                        isOpen={isOpen}
                        size="full"
                        height="100vh"
                        placement="center"
                        backdrop="opaque"
                        classNames={{
                            backdrop: "bg-white shadow-none"
                        }}
                        onOpenChange={onOpenChange}
                        scrollBehavior={scrollBehavior}

                    >
                        <ModalContent className=' bg-white shadow-none'>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="max-w-[540px] center ">
                                        <p className='text-2xl'>Publish Form</p>
                                    </ModalHeader>
                                    <ModalBody className='bg-white shadow-none'>

                                        {/* blog preview  */}
                                        <section className=' grid items-center lg:grid-cols-2 py-16 lg:gap-4'>

                                            <div className='max-w-[540px] center'>
                                                <p className='text-dark-grey mb-1'>Preview</p>

                                                {/* blog banner  */}
                                                <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
                                                    <img src={banner} alt="" />
                                                </div>

                                                {/* Blog title  */}
                                                <h1 className='text-4xl font-medium mt-2 line-clamp-2 leading-tight'>
                                                    {title}
                                                </h1>

                                                {/* blog short description  */}
                                                <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{des}</p>
                                            </div>

                                            {/* publish form  */}
                                            <div className='border-grey lg:border-1 lg:px-6 '>

                                                <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
                                                <input type="text"
                                                    placeholder='Blog Title'
                                                    defaultValue={title}
                                                    className='input-box pl-4'
                                                    onChange={handleBlogTitleChange}
                                                />

                                                <p className='text-dark-grey mb-2 mt-9'>Short description about your blog</p>
                                                <textarea
                                                    maxLength={characterLimit}
                                                    defaultValue={des}
                                                    className='h-40 resize-none leading-7 input-box pl-4'
                                                    onChange={handleBlogDesChange}
                                                    onKeyDown={handleTitleKeyDown}
                                                ></textarea>
                                                <p className='mt-1 text-dark-grey text-sm text-right'>{characterLimit - des?.length} characters left</p>

                                                <p className='text-dark-grey mb-2 mt-9'>Topics -(Help's in searching and ranking your blog post )</p>
                                                <div className='relative input-box pl-2 py-2 pb-4'>
                                                    <input type="text" placeholder='Topic'
                                                        className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
                                                        onKeyDown={handleTagKeyDown}
                                                    />
                                                    {
                                                        tags?.map((tag, i) => {
                                                            return <Tag tag={tag} tagIndex={i} key={i} />
                                                        })
                                                    }
                                                </div>

                                                <p className='mt-1 mb-4 text-dark-grey text-right'>{tagLimit - tags?.length} Tags left</p>

                                                <button
                                                    onClick={handlePublishForm}
                                                    className='btn-dark px-8'>
                                                    Publish
                                                </button>
                                            </div>
                                        </section>
                                    </ModalBody>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </div >
        </>
    )
}


export default BlogEditor