import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse, } from "next/server";
import { getServerSession } from "next-auth"


const prisma=new PrismaClient()



export const GET =async(req:NextRequest)=>{
    const url=new URL(req.url).searchParams
    const name = url.get('name')
    console.log("namanya : ",name)
    const user=await prisma.users.findFirst({
        where:{
            name:name||''
        }
    })
    return NextResponse.json({user})
}


