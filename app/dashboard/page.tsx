
"use client"
import { signIn,signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

export default function Dashboard(){

    const route=useRouter()
    const {data:session}=useSession()
  
    useEffect(()=>{
        if(!session){
          route.push('/')
        }
    },[session])

    return(
        <div>
            Dashboard

         <p>{JSON.stringify(session)}</p>
        <div onClick={()=>{route.push('/login')}}>Login</div>
        <div onClick={()=>{signOut({redirect:false})}}>Logout</div>
        </div>
        
    )
}