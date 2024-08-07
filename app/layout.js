"use client"; // This is a client component 👈🏽


import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { NextUIProvider } from "@nextui-org/react";



import Navbar from "../Components/Navbar";
import { lookInSession } from '@/SessionFunc';
import Editor from './Editor/[slug]/page';



import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });


export const UserContext = createContext({})


export default function RootLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const [userAuth, setUserAuth] = useState({})
  const [criteria, setCriteria] = useState(false)

  useEffect(() => {


    let userInSession = lookInSession("user")
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ token: null })


    if (pathname === '/') {
      // router.refresh()
      setCriteria(false)
    }

  }, [pathname])

  // console.log(userAuth.token);
  return (
    <html lang="en">
      <head>
        <title>AniFills</title>

        <meta name='description' content='Explore the vibrant world of anime with our blog, where we dive deep into character analyses, show reviews, and the latest news. Join us as we celebrate your favorite series and uncover hidden gems in the anime universe!D' />

        <link rel="icon" href="/favicon.png" sizes="48x48" />
      </head>
      <body className={inter.className}>
        <NextUIProvider>
          <UserContext.Provider value={{ userAuth, setUserAuth, setCriteria, criteria }}>
            {!criteria ?
              <div>
                <Navbar />
                {children}
              </div> :
              <div >
                <Editor />
              </div>}
          </UserContext.Provider>
        </NextUIProvider>
      </body>
    </html>
  );
}
