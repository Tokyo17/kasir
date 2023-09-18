"use client"
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react'
import { useMyContext } from './MyContext'
import ListMusic from './component/listMusic'
import { useSession } from 'next-auth/react'

export default function Home() {

  const {data:session}=useSession()
  const{music,setDataMusic,dataMusic,isPlaying}=useMyContext()
  const[isLoading,setIsLoading]=useState(false)

  const getData=async()=>{
    setIsLoading(true)
    const data= await fetch("/api")
    const json=await data?.json()

    // console.log(outputJSON)
    setIsLoading(false)
    console.log(data)
    setDataMusic(json)

 }
 useEffect(()=>{
  console.log(isLoading)
 },[isLoading])

  useEffect(()=>{
    getData()
    console.log(session)
  },[session])

  return (
    <ListMusic full={true} isLoading={isLoading} dataMusic={dataMusic} getData={getData}/>
  )
}
