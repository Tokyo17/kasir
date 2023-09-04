"use client"
import { PiGuitarFill } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";
import { IoLibraryOutline ,IoMenuSharp} from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function NavTop(){
    const [isShow,setIsShow]=useState(false)
    const route=useRouter()
    const {data:session}=useSession()


    const login=async()=>{
        const { value: formValues } = await Swal.fire({
            title: 'Login!',
            html:
             '<p class="pass-title">Username</p>'+
              '<input id="swal-input1" class="swal2-input">' +
              '<p class="pass-title">Password</p>'+
              '<input id="swal-input2" class="swal2-input">',
            focusConfirm: false,
            showLoaderOnConfirm: true,
            preConfirm: async() => {
              if( (document.getElementById('swal-input1')  as HTMLInputElement)?.value&&(document.getElementById('swal-input2')  as HTMLInputElement)?.value){
                const statusLogin=await  signIn("credentials",
                { username:   (document.getElementById('swal-input1')  as HTMLInputElement)?.value, 
                    password: "1234",
                    redirect:false
                }
               )
               if(statusLogin?.error){
                Swal.showValidationMessage(
                  `please check your username and password`
                )
               }else{              
                Swal.fire({
                  title:'Login Success!',
                  icon:'success',
                  timer: 1000,
                  showConfirmButton:false
                })        
                 return statusLogin
               }
              }else{
                Swal.showValidationMessage(
                  `please input username and password`
                )
              // return [
              //   document.getElementById('swal-input1')?.value,
              //   document.getElementById('swal-input2')?.value
              // ]
              }
            }
          })
          
          // if (formValues[0]&&formValues[1]) {
          //   // Swal.fire(JSON.stringify(formValues))
          // }else{

          // }
    }

    
    const navLink=(address:string)=>{
      setIsShow(false)
      if(session){
        route.push(address)
      }else{
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'Plase login first',
        })
      }
    }


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

        <div className="side-nav" style={isShow?{}:{transform:"translate(400px, -107px)"}}>
        <div className="nav-link" onClick={()=>{
                          setIsShow(false)
                        route.push("/")}}>HOME</div>
            <div className="nav-link">MY SONG</div>
            <div className="nav-link" onClick={()=>{navLink("/like")}}>LOVED SONG</div>
            <div className="nav-link" onClick={()=>{navLink("/dashboard")}}>PLYALIST</div>
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
                        // route.push("/login")
                        login()
                        }}>SIGNIN</div>
                    <span> or </span>
                    <div className="register">REGISTER</div>
                </div>
            }
        </div>

    </div>
}