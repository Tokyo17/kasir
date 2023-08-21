import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse, } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptiond";


const prisma=new PrismaClient()



export const GET =async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const songs=await prisma.songs.findMany({
        where:{
            likeds:{
               some:{
                userId:session?.user?.id
               }
            }
        }
    })
    return NextResponse.json({songs})
}


