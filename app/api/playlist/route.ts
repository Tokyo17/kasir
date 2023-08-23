import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptiond";


const prisma=new PrismaClient()

export const GET =async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const url=new URL(req.url).searchParams
    const songId = Number(url.get('songid'))
    console.log("songId : ",songId)

    const result=await prisma.playlists.findMany({
        where:{
            userId:Number(session?.user?.id)
        },select:{
            name:true,
            id:true,
            songs:{
                select:{
                    songId:true
                }
            },

        },
        orderBy:{id:"desc"}
    })
    const playlists=result?.map((item:{id:number,name:string,songs:{songId: number}[]})=>(
        {
            "id":item.id,
            "name":item.name,
            "listed":item.songs.some(item=>item.songId==songId)
        }
    ))
    return NextResponse.json({playlists})
}

export const POST=async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const {name}=await req.json()
    // console.log(name,session?.user.id)
    const playlists=await prisma.playlists.create({
        data:{
            name:name,
            userId:Number(session?.user?.id)
        }
    })
    return NextResponse.json({status:"post success"})
}   

export const DELETE=async(req:NextRequest)=>{
    const url=new URL(req.url).searchParams
    const id = Number(url.get('id'))
    await prisma.playlists.delete({
        where:{
            id:id
        }
    })
    return NextResponse.json({status:"delete success"})
}

export const PUT=async(req:NextRequest)=>{
    const {id,name}=await req.json()
    await prisma.playlists.update({
        where:{
            id:id
        },
        data:{
            name:name
        }
    })
    return NextResponse.json({status:"update success"})
}