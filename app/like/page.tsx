"use client"

import { useEffect, useState } from "react"
import { useMyContext } from "../MyContext"
import ListMusic from "../component/listMusic"



export default function Update(){

   const {setDataMusicLiked,dataMusicLiked}=useMyContext()
    const getData=async()=>{
        const data= await fetch("/api/songs/like")
        const json=await data.json()
       console.log(json)
        setDataMusicLiked(json)
     }
useEffect(()=>{
    getData()
},[])

    return(
        <ListMusic getData={getData} dataMusic={dataMusicLiked} />
    )
}