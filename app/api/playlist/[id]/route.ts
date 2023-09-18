import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptiond";



const prisma=new PrismaClient()

export const GET=async(req:NextRequest,contex:{params:{id:string}})=>{
        const id =Number(contex.params.id)||0
        const session=await getServerSession(authOptions)
        
        const result=await prisma.songs.findMany({
            where:{
               playlists:{
                    some:{
                        playlistId:id
                    }
               }
            },include:{
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