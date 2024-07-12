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
