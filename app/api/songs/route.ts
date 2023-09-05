import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/authOptiond"
import {  PrismaClient } from "@prisma/client"





const prisma =new PrismaClient()


export const POST=async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const {title,url}=await req.json()
    // console.log(name,session?.user.id)
    const playlists=await prisma.songs.create({
        data:{
            title:title,
            url:url,
        }
    })
    return NextResponse.json({status:"post success"})
}   
