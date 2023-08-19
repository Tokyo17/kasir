import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptiond";


const prisma=new PrismaClient()

export const GET =async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const playlists=await prisma.playlists.findMany({
        where:{
            userId:Number(session?.user.id)
        },
        orderBy:{id:"desc"}
    })
    return NextResponse.json({playlists})
}

export const POST=async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const {name}=await req.json()
    console.log(name,session?.user.id)
    const playlists=await prisma.playlists.create({
        data:{
            name:name,
            userId:Number(session?.user.id)
        }
    })
    return NextResponse.json({status:"post success"})
}   