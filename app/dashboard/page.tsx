
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
    const[name,setName]=useState('')


    useEffect(()=>{
        if(!session&&status == "unauthenticated"){
          route.push('/')
        }
    },[status])


    const  updateHandler=(id:number)=>{
        route.push(`/dashboard/${id}`)
      }

    const getData=async()=>{
       const data= await fetch("/api/playlist")
       const json=await data.json()
    //     const newJson = json?.data?.map((item: { index:number,img_name: string, url: string },index:number) => ({
    //     index:index,
    //     name: item.img_name,
    //     url: item.url
    //   }));
      console.log(json)
       setDataMusic(json)
    }

    
    const addPlaylist=async()=>{

        if(name){
            await fetch("/api/playlist",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name:name
                })
            }).then(res=>{
                getData()
                setName('')
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        }
    }


 
    useEffect(()=>{
        getData()
    },[])
 

    return(
        <div>
            Dashboard
           
            <Link href="/">landing2</Link>

        <div onClick={()=>{route.push('/login')}}>Login</div>
        <div onClick={()=>{signOut({redirect:false})}}>Logout</div>
        <p>ADD Playlist</p>
        <input onChange={(e)=>setName(e.target.value) } value={name}/>
        <button onClick={addPlaylist}>ADD</button>
        {dataMusic?.playlists?.map((item:{id:number,name:string},index:number)=>{
             return <p  key={index} onClick={()=>{updateHandler(item.id)}}>{item.name}</p>

        })}
        
        </div>
        
    )
}