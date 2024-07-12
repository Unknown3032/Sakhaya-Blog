"use client"; // This is a client component 👈🏽

import Image from 'next/image'
import Link from 'next/link';
import React, { useContext, useRef, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/Common/Animate';
import toast, { Toaster } from 'react-hot-toast';


// icons 
import { IoMdEye, IoMdEyeOff, IoIosKey } from "react-icons/io";
import { RiUserFill } from "react-icons/ri";
import { UserContext } from '../layout';
import { authWithGoogle } from '@/middleware/firebase';
import { storeInSession } from '@/SessionFunc';


const Signup = () => {
    const [eye, setEye] = useState(false)  // This is a client component 👈🏽
    const auth = useRef()
    const { push } = useRouter();

    let { userAuth: { token }, setUserAuth } = useContext(UserContext)

    const userAuthServer = (formData) => {
        let loadingToast = toast.loading("Signing...")

        axios.post(process.env.NEXT_PUBLIC_URL + "/api/Signup", formData).then(({ data }) => {
            toast.dismiss(loadingToast);
            toast.success("Signed in Successfully👍")

            setTimeout(() => {
                storeInSession("user", JSON.stringify(data?.data))
                setUserAuth(data?.data);
            }, 1000);

        }).catch(({ response }) => {
            toast.error(response?.data?.data?.error);
        })
    }

    const googleAuthServer = (formData) => {
        let loadingToast = toast.loading("Signing...")

        axios.post(process.env.NEXT_PUBLIC_URL + "/api/googleAuth", formData).then(({ data }) => {
            toast.dismiss(loadingToast);
            toast.success("Signed in Successfully👍")

            setTimeout(() => {
                storeInSession("user", JSON.stringify(data))
                setUserAuth(data);
            }, 1000);

        }).catch(({ response }) => {
            toast.error("Internal Server Error ");
        })
    }

    const handleGoogleSubmit = async (e) => {
        e.preventDefault()
        let token
        await authWithGoogle().then((user) => {
            token = user.accessToken

        }).catch((err) => {
            console.log(err);
        })

        let formData = {
            token
        }
        googleAuthServer(formData)
    }

    // submit the data in server 
    const handleSubmit = (e) => {
        e.preventDefault();

        // regex
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        // form data 
        let form = new FormData(auth.current)
        let formData = {}
        let data;

        for (let [key, value] of form.entries()) {
            formData[key] = value
        }

        let { fullname, email, password } = formData

        // checking conditoins 
        if (fullname.length < 3) {
            data = { "error": "fullname at least 3 letter long" }
            return toast.error(data.error);

        }

        if (email.length <= 0) {
            data = { "error": "Email is required" }
            return toast.error(data.error);

        }

        if (!emailRegex.test(email)) {
            data = { "error": "Email is invalid" }
            return toast.error(data.error);

        }

        if (!passwordRegex.test(password)) {
            data = { "error": "Password should be 6 to 20 charaters long with 1 numeric, 1 lowercase and 1 uppercase" }
            return toast.error(data.error);
        }

        userAuthServer(formData)
    }

    return (
        token ?
            push('/')
            :
            <div  >
                <>
                    <Toaster />
                    <motion.div
                        variants={fadeIn(0.1)}
                        initial='hidden'
                        animate='show'
                        exit='hidden'
                        className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1"
                    >

                        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                            <div className='w-14 mx-auto flex-none'>
                                <Image src={'/hindu.jpg'} className="" width={400} height={400} alt='logo' />
                            </div>
                            <div className="mt-12 flex flex-col items-center">
                                <h1 className="text-3xl font-semibold">
                                    Join Us Today
                                </h1>
                                <div className="w-full flex-1 mt-8">

                                    {/* input section  start*/}
                                    <form ref={auth} className="mx-auto max-w-xs">
                                        <div className="relative ">
                                            <input
                                                className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                                                id="name"
                                                type="text"
                                                name='fullname'
                                                placeholder="User Name"
                                            />
                                            <div className="absolute left-0 inset-y-0 flex items-center">
                                                <RiUserFill className='h-7 w-7 ml-3 text-gray-400 p-1' />
                                            </div>
                                        </div>

                                        <div className="relative mt-3">
                                            <input
                                                className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                                                id="email"
                                                type="text"
                                                name='email'
                                                placeholder="Email"
                                            />
                                            <div className="absolute left-0 inset-y-0 flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-7 w-7 ml-3 text-gray-400 p-1"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                                                    />
                                                    <path
                                                        d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="relative mt-3">
                                            <input
                                                className="appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                                                id="password"
                                                name='password'
                                                type={eye ? "text" : "password"}
                                                placeholder="Password"
                                            />
                                            <div className="absolute left-0 inset-y-0 flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-7 w-7 ml-3 text-gray-400 p-1"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="absolute right-0 inset-y-0 flex items-center">
                                                {!eye ? <IoMdEye onClick={() => setEye(!eye)} className='h-7 w-7 mr-3 text-gray-400 p-1 cursor-pointer' /> : <IoMdEyeOff onClick={() => setEye(!eye)} className='h-7 w-7 mr-3 text-gray-400 p-1 cursor-pointer' />}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            type='submit'
                                            className="btn-dark mt-5 tracking-wide w-full py-4 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                        >
                                            <svg
                                                className="w-6 h-6 -ml-2"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                <circle cx="8.5" cy="7" r="4" />
                                                <path d="M20 8v6M23 11h-6" />
                                            </svg>
                                            <span className="ml-3 ">
                                                Sign In
                                            </span>
                                        </button>

                                    </form>
                                    {/* input section end */}


                                    <div className="my-12 border-b text-center">
                                        <div
                                            className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"
                                        >
                                            Or sign in with google
                                        </div>
                                    </div>

                                    {/* google section  */}
                                    <div className="flex flex-col items-center">
                                        <button
                                            onClick={handleGoogleSubmit}
                                            className="btn-dark w-full max-w-xs  py-3 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                                        >
                                            <div className="text-2xl p-2 rounded-full">
                                                <svg className="w-4" viewBox="0 0 533.5 544.3">
                                                    <path
                                                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                                                        fill="#4285f4"
                                                    />
                                                    <path
                                                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                                                        fill="#34a853"
                                                    />
                                                    <path
                                                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                                                        fill="#fbbc04"
                                                    />
                                                    <path
                                                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                                                        fill="#ea4335"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="ml-4">
                                                Sign In with Google
                                            </span>
                                        </button>

                                        <p className="mt-6 text-xs text-gray-600 text-center">
                                            Already have an account ?
                                            <Link href="/Login" className="border-b border-gray-800 text-black border-solid">
                                                Sign Up
                                            </Link>

                                        </p>

                                        <p className="mt-6 text-xs text-gray-600 text-center">
                                            I agree to abide by templatana's
                                            <Link href="/" className="border-b border-gray-500 border-dotted">
                                                Terms of Service
                                            </Link>
                                            and its
                                            <Link href="/" className="border-b border-gray-500 border-dotted">
                                                Privacy Policy
                                            </Link>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            </div>
    )
}

export default Signup 