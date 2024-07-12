import Link from 'next/link'
import React from 'react'
import { CiFacebook, CiYoutube, CiInstagram, CiGlobe, CiTwitter } from "react-icons/ci";
import { AiFillGithub } from "react-icons/ai";
import { getFullDay } from '@/Common/Date';

const AboutProfile = ({ social_links, joinedAt, bio, className }) => {
    const Capatlize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className={"md: w-[90%] md:mt-7 " + className}>

            <p className='text-xl leading-7'>{bio?.length ? bio : "Nothing to read in bio "}</p>

            <div className='flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey'>
                {
                    Object.keys(social_links).map((key) => {
                        let link = social_links[key]
                        // let iconsSocial = ()

                        return link ? <Link href={link} key={key} target='_blank' className=''>
                            <i class={"fi " + (key !== 'website' ? "fi-brands-" + key : "fi-rr-globe") + " text-2xl hover:text-black"}></i>
                        </Link> :
                            " "
                    })
                }
            </div>

            <p className='text-xl leading-7 text-dark-grey'>Joined on {getFullDay(joinedAt)}</p>

        </div>
    )
}

export default AboutProfile