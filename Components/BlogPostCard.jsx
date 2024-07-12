import { getDay } from '@/Common/Date';
import Link from 'next/link';
import { GoHeart } from "react-icons/go";

const BlogPostCard = ({ content, author }) => {
    let { publishedAt, tags, title, banner, des, activity: { total_likes }, blog_id: id } = content;
    let { fullname, username, profile_img } = author;
    return (
        <Link href={`/blogPage/${id}`} className=' flex gap-8 items-center border-b border-grey pb-5 mb-4'>
            <div className='w-full '>
                <div className='flex gap-2 items-center mb-7 '>
                    <img src={profile_img} className='w-6 h-6 rounded-full' alt="" />
                    <p className='line-clamp-1'>{fullname} @{username}</p>
                    <p className='min-w-fit'>{getDay(publishedAt)}</p>
                </div>

                <h1 className='blog-title'>{title}</h1>

                <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100ox]:hidden line-clamp-2'>{des}</p>

                <div className='flex gap-4 mt-7'>
                    <span className='btn-light py-1 px-4'>{tags[0]}</span>
                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                        <GoHeart className='text-xl' />
                        {total_likes}
                    </span>
                </div>
            </div>


            <div className='h-28 aspect-square bg-grey'>
                <img src={banner} className='w-full h-full aspect-square object-cover' alt="" />
            </div>
        </Link>
    )
}

export default BlogPostCard