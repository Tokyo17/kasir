"use client"
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react'
import { useMyContext } from './MyContext'
import ListMusic from './component/listMusic'
import { useSession } from 'next-auth/react'

export default function Home() {

  const {data:session}=useSession()
  const{music,setDataMusic,dataMusic,isPlaying}=useMyContext()

  const getData=async()=>{

    const data= await fetch("/api")
    const json=await data?.json()

    // console.log(outputJSON)
    console.log(json)
    setDataMusic(json)
 }

  useEffect(()=>{
    getData()
    console.log(session)
  },[session])

  return (
    <ListMusic dataMusic={dataMusic} getData={getData}/>
  )
}
