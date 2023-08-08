import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient()

export const GET =async(req:NextRequest)=>{
    const images=await prisma.menus.findMany({
        orderBy:{id:"desc"}
    })
    return NextResponse.json({data:images})
}

export const POST=async(req:NextRequest)=>{
    const {image_name,url,name_menu,price}=await req.json()
    const menus=await prisma.menus.create({
        data:{
            img_name:image_name,
            url:url,
            name_menu:name_menu,
            price:price
        }
    })
    return NextResponse.json({status:"post success"})
}   