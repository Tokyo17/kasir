"use client"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"

 export default function Login(){
    
    const route=useRouter()
    const {data:session}=useSession()
    const login =async ()=>{
        
        try{
          const statusLogin=await  signIn("credentials",
            { username: "jsmith", 
                password: "1234",
                redirect:false
            }
           )
           console.log(statusLogin?.ok)
           if(statusLogin?.ok){
                route.push("/")
           }
        }catch{

        }finally{

        }
        
    }

    useEffect(()=>{
        if(session){
            route.push("/")
        }
    },[session])

    return(
        <>
        <p>{JSON.stringify(session)}</p>
        <div >Login Page</div>
        <button onClick={login}>Login</button>
        </>
    )
}