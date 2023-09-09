import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/authOptiond"
import {  PrismaClient } from "@prisma/client"





const prisma =new PrismaClient()


export const POST=async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const {title,url,duration}=await req.json()
    // console.log(name,session?.user.id)
    const playlists=await prisma.songs.create({
        data:{
            title:title,
            url:url,
            userId:Number(session?.user?.id),
            duration:duration
        }
    })
    return NextResponse.json({status:"post success"})
}   


export const DELETE=async(req:NextRequest)=>{
    const url=new URL(req.url).searchParams
    const id = url.get('id')
    const song=await prisma.songs.delete({
        where:{
            id:Number(id)
        }
    })
    return NextResponse.json({status:"dlete succes"})
}

export const GET =async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const result=await prisma.songs.findMany({
        where:{
                userId:Number(session?.user?.id)
        },
        include:{
            likeds:true
        }

    })
    const songs =result.map((song:{id:number,duration:string,title:string,url:string,likeds:{userId: number,songId: number}[]}) => (
        {
        "id": song.id,
        "title": song.title,
        "url": song.url,
        "duration":song.duration,
        "liked": song.likeds.some(likedEntry => likedEntry.userId === Number(session?.user?.id)) // Change userId to the desired user's ID
      }))
    return NextResponse.json({songs})
}