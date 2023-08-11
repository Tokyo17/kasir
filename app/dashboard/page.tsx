
"use client"
import { url } from "inspector"
import { signIn,signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { DOMAttributes, FormEvent, FormEventHandler, useEffect, useRef, useState } from "react"
import { useMyContext } from "../MyContext"
import Link from "next/link"

export default function Dashboard(){

    // const [dataMusic,setDataMusic]=useState<any>(null)
    // const [music,setMusic]=useState<any>(null)
    const route=useRouter()
    const {data:session,status}=useSession()
    const{music,setMusic,setDataMusic,dataMusic}=useMyContext()


    useEffect(()=>{
        if(!session&&status == "unauthenticated"){
          route.push('/')
        }
    },[status])


    const getData=async()=>{
       const data= await fetch("/api")
       const json=await data.json()
        const newJson = json?.data?.map((item: { index:number,img_name: string, url: string },index:number) => ({
        index:index,
        name: item.img_name,
        url: item.url
      }));
      console.log(newJson)
       setDataMusic(newJson)
    }

    
    // const audio=new Audio(music||'')
   

    useEffect(()=>{
        getData()
    },[])
 

    return(
        <div>
            Dashboard
            {/* {json} */}
            <Link href="/">landing</Link>

        <div onClick={()=>{route.push('/login')}}>Login</div>
        <div onClick={()=>{signOut({redirect:false})}}>Logout</div>

        {dataMusic?.map((item:{index:number,name:string,url:string},index:number)=>{
             return <p onClick={()=>{setMusic({index:index,url:item.url,name:item.name})}} key={index}>{item.name}</p>

        })}
        {/* <button onClick={()=>{audio.current.play()}}>Play</button> */}
        </div>
        
    )
}