import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



const prisma=new PrismaClient()

export const GET=async(req:NextRequest,contex:{params:{id:string}})=>{
        const id =Number(contex.params.id)||0
        
        
        const image=await prisma.songsOnPlaylists.findMany({
            where:{
                playlistId:id
            },
            include:{
                songs:true
            }
        })
        const newJson=image.map(v=> v.songs)
        // console.log("idnya : ",image.ma)
        if(!image){
            return NextResponse.json({message:"error"},{status:404})
        }
        return NextResponse.json(newJson)

}