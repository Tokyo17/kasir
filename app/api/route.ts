import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse, } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]/authOptiond";

const prisma=new PrismaClient()



export const GET =async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
// console.log(session)
    const result=await prisma.songs.findMany({
        include:{
            likeds:true
        },
        orderBy:{id:"desc"}
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

// export const POST=async(req:NextRequest)=>{
//     const {image_name,url,name_menu,price}=await req.json()
//     const menus=await prisma.menus.create({
//         data:{
//             img_name:image_name,
//             url:url,
//             name_menu:name_menu,
//             price:price
//         }
//     })
//     return NextResponse.json({status:"post success"})
// }   