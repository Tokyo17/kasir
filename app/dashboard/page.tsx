
"use client"
import { signIn,signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { DOMAttributes, FormEvent, FormEventHandler, useEffect } from "react"

export default function Dashboard(){

    const route=useRouter()
    const {data:session}=useSession()
  
    useEffect(()=>{
        if(!session){
          route.push('/')
        }
    },[session])

    const addMenu=async( e:any)=>{
        e.preventDefault()
        await fetch("/api",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                url:"image",
                image_name:"image_name",
                name_menu:e.target.name_menu.value,
                price:e.target.price.value,

            })
        }).then(res=>{
            if(res.ok){
                 console.log("succes",res)
            }else{
           console.log("error")}
        }).catch(err=>{
            console.log("error",err)
        })
    }

    return(
        <div>
            Dashboard

         <p>{JSON.stringify(session)}</p>
        <div onClick={()=>{route.push('/login')}}>Login</div>
        <div onClick={()=>{signOut({redirect:false})}}>Logout</div>

        <form onSubmit={addMenu}>
            <input className="border-4 border-indigo-200" placeholder="name" type="text" name="name_menu"/>
            <input className="border-4 border-indigo-200" placeholder="price" type="text" name="price"/>
            <button>ADD</button>
        </form>
        </div>
        
    )
}