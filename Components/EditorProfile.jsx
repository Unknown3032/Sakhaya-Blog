'use clients'
import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { profileDataStructure } from '@/app/user/[slug]/page'
import { UserContext } from '@/app/layout'

import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/Common/Animate';
import Loader from './Loader'
import toast, { Toaster } from 'react-hot-toast'
import { uploadImage } from '@/middleware/aws'
import { storeInSession } from '@/SessionFunc'


const EditorProfile = () => {
    let bioLimit = 150
    const [profile, setProfile] = useState(profileDataStructure)
    const [loading, setLoading] = useState(true)
    const [charactersLeft, setCharactersLeft] = useState(bioLimit)
    const [uploadedPreviewImg, setUploadedPreviewImg] = useState(null)
    const prviewProfileImg = useRef();
    const editedProfle = useRef()

    let { userAuth, userAuth: { token }, setUserAuth } = useContext(UserContext)

    let { personal_info: { fullname, username: profile_username, profile_img, email, bio }, social_links } = profile;

    useEffect(() => {

        if (token) {
            axios.post(process.env.NEXT_PUBLIC_URL + '/api/getProfile', {
                username: userAuth.username
            }).then(({ data: { data: { user } } }) => {
                setProfile(user)
                setLoading(false)
            })
        }

    }, [token])


    const handleCharacterChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length)
    }

    const handleImage = (e) => {
        let img = e.target.files[0];

        prviewProfileImg.current.src = URL.createObjectURL(img)
        setUploadedPreviewImg(img)
    }

    const handleImageUpload = async (e) => {
        e.preventDefault()

        if (uploadedPreviewImg) {
            let loadingToast = toast.loading("Uploading...🤔");
            e.target.setAttribute("diabled", true)

            await uploadImage(uploadedPreviewImg).then(async url => {


                if (url) {

                    await axios.post(process.env.NEXT_PUBLIC_URL + "/api/ProfileImgUpdate", { url }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }).then(({ data: { data } }) => {
                        let newUserAuth = { ...userAuth, profile_img: data.profile_img }

                        storeInSession('user', JSON.stringify(newUserAuth));
                        setUserAuth(newUserAuth)

                        setUploadedPreviewImg(null)
                        toast.dismiss(loadingToast)
                        e.target.removeAttribute("disabled")
                        toast.success("Uploaded 👍")
                    }).catch(({ response: { data: { data } } }) => {
                        toast.dismiss(loadingToast)
                        e.target.removeAttribute("disabled")
                        toast.error(data.message)
                    })

                }
            })
                .catch((err) => {
                    console.log(err);
                })

        }
    }

    const handlesubmit = (e) => {
        e.preventDefault()

        let form = new FormData(editedProfle.current)
        let formdata = {};

        for (let [key, value] of form.entries()) {
            formdata[key] = value
        }

        let { username, bio, youtube, instagram, facebook, twitter, github, website } = formdata

        if (bio.length > bioLimit) {
            return toast.error(`Bio should be not be more than ${bioLimit}`)
        }
        if (username > 3) {
            return toast.error("Username should be at least 3 letters long")
        }

        let loadingToast = toast.loading("Updating....🤔")
        e.target.setAttribute("diabled", true);
        axios.post(process.env.NEXT_PUBLIC_URL + "/api/profileUpdate", {
            username, bio,
            social_links: { youtube, facebook, twitter, github, website, instagram }
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(({ data: { data } }) => {

            if (data.message) {
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                return toast.error(data.message)
            }
            if (userAuth.username != data.username) {
                let newUserAuth = { ...userAuth, username: data.username }
                storeInSession("user", JSON.stringify(newUserAuth))
                setUserAuth(newUserAuth)
            }

            toast.dismiss(loadingToast)
            e.target.removeAttribute("disabled")
            toast.success("Updated 👍"
            )
        }).catch(({ response: { data } }) => {
            toast.dismiss(loadingToast)
            e.target.removeAttribute("disabled")
            console.log(data?.message);
            toast.error(data?.message)
        })
    }
    return (
        <motion.div
            variants={fadeIn(0.2)}
            initial='hidden'
            animate='show'
            exit='hidden'
        >
            {
                loading ? <Loader /> :
                    <form ref={editedProfle} >
                        <Toaster />

                        <h1 className='max-md:hidden'>Edit Profile</h1>

                        <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>

                            <div className='max-lg:center mb-5'>

                                <label htmlFor="uploadImg" id='profileImgLable' className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'>
                                    <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer'>
                                        Update Image
                                    </div>
                                    <img ref={prviewProfileImg} src={profile_img} alt="" />
                                </label>

                                <input onChange={handleImage} type="file" id='uploadImg' accept='jpeg, .png, .jpg' hidden />

                                <button onClick={handleImageUpload} className='btn-light mt-5 max-lg:center lg:w-full px-10'>Upload</button>

                            </div>

                            <div className='w-full'>
                                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                                    <div>
                                        <div className="relative">
                                            <input
                                                className="  input-box "
                                                id="name"
                                                type="text"
                                                placeholder="name"
                                                value={fullname}
                                                disabled={true}
                                            />
                                            <i className="fi fi-rr-user absolute left-4 inset-y-0 flex items-center text-dark-grey"></i>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="relative max-md:mt-3">
                                            <input
                                                className="  input-box "
                                                id="email"
                                                type="email"
                                                name='email'
                                                placeholder="Email"
                                                value={email}
                                                disabled={true}
                                            />
                                            <i className="fi fi-rr-envelope absolute left-4 inset-y-0 flex items-center text-dark-grey"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative mt-3 text-dark-grey">
                                    <input
                                        className="  input-box "
                                        id="username"
                                        type="text"
                                        name='username'
                                        placeholder="username"
                                        defaultValue={profile_username}
                                    />
                                    <i className="fi fi-rr-at absolute left-4 inset-y-0 flex items-center "></i>
                                </div>

                                <p className='text-dark-grey '>Username will use to search user and will be visible to all users</p>

                                <textarea name="bio" id="bio"
                                    className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5'
                                    placeholder='Bio'
                                    onChange={handleCharacterChange}
                                ></textarea>

                                <p className='mt-1 text-dark-grey'>{charactersLeft} characters left</p>


                                <p className='my-6 text-dark-grey'>Add your social handles</p>

                                <div className='md:grid md:grid-cols-2 gap-x-6'>
                                    {
                                        Object.keys(social_links)?.map((key, i) => {
                                            let link = social_links[key]
                                            return (

                                                <div key={i} className="relative mt-3 text-dark-grey">
                                                    <input
                                                        className='input-box' name={key} type='text'
                                                        defaultValue={link}
                                                        placeholder='https://'
                                                    />
                                                    <i className={"fi " + (key !== 'website' ? "fi-brands-" + key : "fi-rr-globe") + " absolute left-4 inset-y-0 flex items-center"}></i>
                                                </div>

                                            )
                                        })
                                    }
                                </div>

                                <button onClick={handlesubmit} className='btn-dark w-auto px-10 mt-4'>
                                    Update
                                </button>

                            </div>

                        </div>

                    </form>
            }
        </motion.div>

    )
}

export default EditorProfile