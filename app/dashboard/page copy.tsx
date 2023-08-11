
"use client"
import { signIn,signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { DOMAttributes, FormEvent, FormEventHandler, useEffect, useRef, useState } from "react"

export default function Dashboard(){

    const [dataMusic,setDataMusic]=useState<any>(null)
    const [music,setMusic]=useState<any>(null)
    const route=useRouter()
    const {data:session,status}=useSession()
  
    useEffect(()=>{
        if(!session&&status == "unauthenticated"){
          route.push('/')
        }
    },[status])

    const addMenu=async( e:any)=>{
        e.preventDefault()
        await fetch("/api",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                url:"image",
                image_name:"image_name",
                name_menu:e.target.name_menu.value,
                price:e.target.price.value,
            })
        }).then(res=>{
            if(res.ok){
                 console.log("succes",res)
            }else{
           console.log("error")}
        }).catch(err=>{
            console.log("error",err)
        })
    }

    const getData=async()=>{
       const data= await fetch("/api")
       const json=await data.json()
        const newJson = json?.data?.map((item: { img_name: string, url: string }) => ({
        img_name: item.img_name,
        url: item.url
      }));
      console.log(newJson)
       setDataMusic(newJson)
    }

    
    // const audio=new Audio(music||'')
    const audio = useRef(new Audio(''));

    useEffect(()=>{
        getData()
    },[])

    useEffect(()=>{
        audio.current.pause()
        audio.current=new Audio(music)
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: "Unforgettable",
              artist: "Nat King Cole",
              album: "The Ultimate Collection (Remastered)",
            });
        }
                    
        audio.current.play()
    },[music])

    return(
        <div>
            Dashboard

        <div onClick={()=>{route.push('/login')}}>Login</div>
        <div onClick={()=>{signOut({redirect:false})}}>Logout</div>

        <form onSubmit={addMenu}>
            <input className="border-4 border-indigo-200" placeholder="name" type="text" name="name_menu"/>
            <input className="border-4 border-indigo-200" placeholder="price" type="text" name="price"/>
            <button>ADD</button>
        </form>

        {dataMusic?.map((item:{img_name:string,url:string},index:number)=>{
             return <p onClick={()=>{setMusic(item.url)}} key={index}>{item.img_name}</p>

        })}
        <button onClick={()=>{audio.current.play()}}>Play</button>
        </div>
        
    )
}