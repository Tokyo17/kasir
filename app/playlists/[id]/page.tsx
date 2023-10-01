'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import ListMusic from "@/app/component/listMusic"
import { useSession } from "next-auth/react"

export default function Update({params}:{params:{id:string}}){

    const [songs,setSongs]=useState<any>(null)
    const [isLoading,setIsloading]=useState(false)

    const id=params.id
    const getData=async()=>{
        setIsloading(true)
        const data= await fetch(`/api/playlist/${id}`)
        const json=await data.json()
     //     const newJson = json?.data?.map((item: { index:number,img_name: string, url: string },index:number) => ({
     //     index:index,
     //     name: item.img_name,
     //     url: item.url
     //   }));
     setIsloading(false)
     setSongs(json)
       console.log(json)
     }
 
     
     const route=useRouter()

 
     useEffect(()=>{
         getData()
     },[])
  


const {data:session}=useSession()
  useEffect(()=>{
    console.log(session)
    if(!session){
    route.push('/')}
  },[session])
    return(
        <ListMusic isLoading={isLoading} getData={getData} dataMusic={songs} />
        // <div>
        //     <p>Song:</p>
        //     {id}

        //     {
        //         song?.map((item:{id:number,title:string},index:number)=>{
        //         return  <p key={index}>
        //                     {item.title}
        //                 </p>
        //         })
        //     }
        // </div>
    )
}