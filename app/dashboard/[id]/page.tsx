'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

export default function Update({params}:{params:{id:string}}){

    const [song,setSong]=useState<any>(null)

    const id=params.id
    const getData=async()=>{
        const data= await fetch(`/api/playlist/${id}`)
        const json=await data.json()
     //     const newJson = json?.data?.map((item: { index:number,img_name: string, url: string },index:number) => ({
     //     index:index,
     //     name: item.img_name,
     //     url: item.url
     //   }));
     setSong(json)
       console.log(json)
     }
 
     
     const route=useRouter()

 
     useEffect(()=>{
         getData()
     },[])
  
    return(
        <div>
            <p>Song:</p>
            {id}

            {
                song?.map((item:{id:number,title:string},index:number)=>{
                   return <p>{item.title}</p>
                })
            }
        </div>
    )
}