"use client"
import Image from 'next/image'

import { signIn,signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {

  const route=useRouter()
  const {data:session}=useSession()

  useEffect(()=>{
      if(!session){
        // route.push('/login')
      }
  },[session])

  return (
    <div >
        LANDING PAGE
        <p>{JSON.stringify(session)}</p>
        <div onClick={()=>{route.push('/login')}}>Login</div>
        <div onClick={()=>{signOut({redirect:false})}}>Logout</div>

    </div>
  )
}
