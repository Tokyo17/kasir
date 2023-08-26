"use client"
import { PiGuitarFill } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";
import { IoLibraryOutline ,IoMenuSharp} from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function NavTop(){
    const [isShow,setIsShow]=useState(false)
    const route=useRouter()
    const {data:session}=useSession()

    return <div className='nav-top'>
        <div className="nav-icon">
          <PiGuitarFill onClick={()=>route.push("/")} size="35px"/>
          Senandung
        </div>


        <div className="nav-action-icon">
            {/* <IoLibraryOutline onClick={()=>route.push("/dashboard")} size="35px"/>
            <IoMdLogOut size="35px"/> */}
            <IoMenuSharp onClick={()=>setIsShow(!isShow)} size="35px"/>
        </div>

        <div className="side-nav" style={isShow?{}:{transform:"translate(400px, -42px)"}}>
            <div className="nav-link">MY SONG</div>
            <div className="nav-link" onClick={()=>{
                          setIsShow(false)
                        route.push("/like")}}>LOVE SONG</div>
            <div className="nav-link" onClick={()=>{
                          setIsShow(false)
                        route.push("/playlist")}}>PLYALIST</div>
            <div className="nav-link">SETTING</div>
            {
                session?    <div className="sign">
                                 <div className="signout"  onClick={()=>{
                                    setIsShow(false)
                                    signOut({redirect:false})}}>SIGNOUT</div>
                            </div>
                :
                <div className="sign">
                    <div className="signin" onClick={()=>{
                          setIsShow(false)
                        route.push("/login")}}>SIGNIN</div>
                    <span> or </span>
                    <div className="register">REGISTER</div>
                </div>
            }
        </div>

    </div>
}