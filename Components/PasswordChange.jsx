
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/Common/Animate';
import { useContext, useRef, useState } from 'react';
import { IoMdEyeOff, IoMdEye } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '@/app/layout';

const PasswordChange = () => {

    const [eye, setEye] = useState(false)
    const [eye1, setEye1] = useState(false)
    let changePasswordForm = useRef()
    let { userAuth: { token } } = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault();

        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


        let form = new FormData(changePasswordForm.current)
        let formdata = {};

        for (let [key, value] of form.entries()) {
            formdata[key] = value;
        }

        let { curPassword, newPassword } = formdata;

        if (!curPassword.length || !newPassword.length) {
            return toast.error("Fill all the inputs")
        }

        if (!passwordRegex.test(curPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and one uppercase letters")
        }

        e.target.setAttribute("disabled", true)

        let loadingToast = toast.loading("Updating...");

        await axios.post(process.env.NEXT_PUBLIC_URL + "/api/changePassword", formdata,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(({ response }) => {
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                return toast.success("Password updated successfully👍");

            }).catch(({ response: { data: { data } } }) => {
                toast.dismiss(loadingToast)
                e.target.removeAttribute("disabled")
                return toast.error(data.message)
            })

    }

    return (
        <motion.div
            variants={fadeIn(0.1)}
            initial='hidden'
            animate='show'
            exit='hidden'>

            <Toaster />

            <form ref={changePasswordForm} >

                <h1 className=' max-md:hidden'>Change Password</h1>

                <div className='py-10 w-full md:max-w-[400px]'>

                    <div className="relative">
                        <input
                            className=" input-box appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                            id="password"
                            type={eye ? "text" : "password"}
                            name='curPassword'
                            placeholder="Current Password"
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

                    <div className="relative mt-3">
                        <input
                            className=" input-box appearance-none border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
                            id="newpassword"
                            type={eye1 ? "text" : "password"}
                            name='newPassword'
                            placeholder="New Password"
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
                            {!eye1 ? <IoMdEye onClick={() => setEye1(!eye1)} className='h-7 w-7 mr-3 text-gray-400 p-1 cursor-pointer' /> : <IoMdEyeOff onClick={() => setEye1(!eye1)} className='h-7 w-7 mr-3 text-gray-400 p-1 cursor-pointer' />}
                        </div>
                    </div>

                    <button onClick={handleSubmit} className='btn-dark px-10 mt-8' type='submit'>Change Password</button>

                </div>

            </form>

        </motion.div>
    )
}

export default PasswordChange