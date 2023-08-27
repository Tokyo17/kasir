import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse, } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptiond";


const prisma=new PrismaClient()



export const GET =async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const result=await prisma.songs.findMany({
        where:{
            likeds:{
               some:{
                userId:Number(session?.user?.id)
               }
            }
        },
        include:{
            likeds:true
        }
    })
    const songs =result.map((song:{id:number,title:string,url:string,likeds:{userId: number,songId: number}[]}) => (
        {
        "id": song.id,
        "title": song.title,
        "url": song.url,
        "liked": song.likeds.some(likedEntry => likedEntry.userId === Number(session?.user?.id)) // Change userId to the desired user's ID
      }))
    return NextResponse.json({songs})
}


