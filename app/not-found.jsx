import Link from 'next/link'

export default async function NotFound({ params }) {

    return (
        <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
            <img className='select-none border-2 border-grey w-72 aspect-square object-cover rounded' src={'/404.png'} alt="" />

            <h1 className='text-4xl font-gelasio leading-7'>Page not found</h1>
            <p className='mt-5 text-dark-grey'>The page you are looking for does not exists. Head back to the <Link className='text-black underline' href={'/'}>home page</Link></p>


            <div className='mt-auto'>
                <img className='h-20 object-contain block mx-auto select-none' src={'/anime.png'} alt="" />
                <p className='mt-3 text-dark-grey'>Read millions of stories around the world</p>
            </div>
        </section>
    )
}