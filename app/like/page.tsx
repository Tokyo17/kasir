"use client"

import { useEffect, useState } from "react"



export default function Update(){

    const[dataMusic,setDataMusic]=useState<any>(null)
    const getData=async()=>{
        const data= await fetch("/api/songs/like")
        const json=await data.json()
       console.log(json)
        setDataMusic(json)
     }
useEffect(()=>{
    getData()
},[])

    return(
        <div >
            <p>Like : </p> 
            {dataMusic?.songs?.map((item:{id:number,title:string,url:string})=>{
                return <p key={item.id}>{item.title}</p>
            })}
        </div>
    )
}