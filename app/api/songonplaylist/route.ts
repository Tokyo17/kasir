import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptiond";


const prisma=new PrismaClient()

export const POST=async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const {playlistId,songId}=await req.json()
    console.log(playlistId,songId)
    const playlists=await prisma.songsOnPlaylists.create({
        data:{
            playlistId:playlistId,
            songId:songId
        }
    })
    return NextResponse.json({status:"post success"})
}   