"use client"

import { useEffect, useState } from "react"
import { useMyContext } from "../MyContext"
import ListMusic from "../component/listMusic"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"



export default function Update(){

   const {setDataMusicLiked,dataMusicLiked}=useMyContext()
   const[isLoading,setIsLoading]=useState(false)
    const getData=async()=>{
        setIsLoading(true)
        const data= await fetch("/api/songs/like")
        const json=await data.json()
       console.log(json)
       setIsLoading(false)
        setDataMusicLiked(json)
     }
useEffect(()=>{
    getData()
},[])

const route=useRouter()
const {data:session}=useSession()
  useEffect(()=>{
    if(!session){
    route.push('/')}
  },[session])

    return(
        <ListMusic isLoading={isLoading} getData={getData} dataMusic={dataMusicLiked} />
    )
}