import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptiond";


const prisma=new PrismaClient()

export const GET =async(req:NextRequest)=>{
    const session=await getServerSession(authOptions)
    const images=await prisma.playlists.findMany({
        where:{
            userId:Number(session?.user.id)
        },
        orderBy:{id:"desc"}
    })
    return NextResponse.json({data:images})
}