import { EditorContext } from '@/app/Editor/[slug]/page';
import React, { useContext } from 'react'
import { IoIosCut } from "react-icons/io";

const Tag = ({ tag, tagIndex }) => {
    let { blog, blog: { tags }, setBlog } = useContext(EditorContext)


    const handleTagDelete = () => {
        tags = tags.filter(t => t != tag);
        setBlog({ ...blog, tags });
    }

    const handleTagEdit = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault();

            let currentTag = e.target.innerText;
            tags[tagIndex] = currentTag;
            setBlog({ ...blog, tags });
            e.target.setAttribute("contentEditable", false)
        }
    }

    const addEditableTag = (e) => {
        e.target.setAttribute("contentEditable", true)
        e.target.focus;
    }

    return (
        <div className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10'>
            <p
                onKeyDown={handleTagEdit}
                onClick={addEditableTag}
                className='outline-none' >
                {tag}
            </p>


            <button
                className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2'
                onClick={handleTagDelete}
            >
                <IoIosCut className='text-sm pointer-events-none' />
            </button>
        </div>
    )
}

export default Tag