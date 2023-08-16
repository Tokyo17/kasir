"use client"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

 export default function Login(){
    

    const [username,setUsername]=useState('')
    const route=useRouter()
    const {data:session}=useSession()
    const login =async ()=>{
        
        try{
            if(username){
          const statusLogin=await  signIn("credentials",
            { username: username, 
                password: "1234",
                redirect:false
            }
           )
           console.log(statusLogin)
           if(!statusLogin?.error){
                route.push("/dashboard")
           }}
        }catch{

        }finally{

        }
        
    }

    useEffect(()=>{
        if(session){
            route.push("/dashboard")
        }
    },[session])

    return(
        <>
        <p>{JSON.stringify(session)}</p>
        <div >Login Page</div>
        <input type="text" onChange={(e)=>setUsername(e.target.value)} value={username}/>
        <button onClick={login}>Login</button>
        </>
    )
}