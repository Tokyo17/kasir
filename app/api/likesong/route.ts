import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptiond";


const prisma=new PrismaClient()

export const POST=async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const {songId}=await req.json()
    const playlists=await prisma.likeds.create({
        data:{
            userId:session?.user?.id,
            songId:songId
        }
    })
    return NextResponse.json({status:"post success"})
}   

export const DELETE=async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const {songId}=await req.json()
    const images=await prisma.likeds.delete({
        where:{
            userId_songId:{
                userId:session?.user?.id,
                songId:songId
            }
        }
    })
    return NextResponse.json({status:"post success"})
} 