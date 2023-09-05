"use client"
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react'
import { IoAdd } from "react-icons/io5";
import { useSession } from 'next-auth/react'
import { useMyContext } from '../MyContext'
import ListMusic from '../component/listMusic'
import Swal from 'sweetalert2';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';

export default function MyMusic() {

  const {data:session}=useSession()
  const{music,setDataMusic,dataMusic,isPlaying}=useMyContext()

  const getData=async()=>{

    const data= await fetch("/api")
    const json=await data?.json()

    // console.log(outputJSON)
    console.log(json)
    setDataMusic(json)
 }

  useEffect(()=>{
    getData()
    console.log(session)
  },[session])


  
  const addMusic=async(title:string,url:string)=>{
    await fetch("/api/songs",{
method:"POST",
headers:{
    "Content-Type":"application/json"
},
body:JSON.stringify({
    title:title,
    url:url
})
}).then(res=>{
if(res.ok){
    getData()
    Swal.fire({
        title:'Success!',
        icon:'success',
        timer: 1000,
        toast:true,
        position: 'top-end',
        showConfirmButton:false
      })
}else{
    Swal.fire({
        title:'Error!s',
        icon:'error',
        timer: 1000,
        showConfirmButton:false
      })
}
console.log(res)
}).catch(err=>{
console.log(err)
})
}

  const popUpUpload=async()=>{
    const { value: formValues } = await Swal.fire({
        title: 'Multiple inputs',
        html:
          '<input type="file" accept=".mp3" id="swal-inputImage" class="swal-input-image">'+
          '<p class="upload-title">Title Of Song</p>'+
          '<input id="swal-inputTitle" placeholder="input your music title" class="swal2-input">',
        focusConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: async() => {
            const inputElement = document.getElementById('swal-inputImage') as HTMLInputElement;
            const file = inputElement.files ? inputElement.files[0] : null;
            if(file){
                console.log(file)
                Swal.fire({
                    title: "Uploading music",
                    didOpen:()=>{
                        Swal.showLoading()
                    },
                    toast:true,
                    position: 'top-end',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false          
                })

                const storageRef=ref(storage,`music/${file?.name}`)
                const uploadTask=uploadBytesResumable(storageRef,file)

              return  uploadTask.on("state_changed",
               ()=>{

                },(err:any)=>{
                    Swal.showValidationMessage(
                        `please input your music`
                      )
                },()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
                       addMusic(file?.name,url)

                    })
                }
                )
            }else{
                Swal.showValidationMessage(
                    `please input your music`
                  )
            }

        //   return [
        //     file,
        //     (document.getElementById('swal-inputTitle') as HTMLInputElement)?.value
        //     ]
        }
      })

  }

  return (
    <div style={{height:"100%"}}>
        <div onClick={popUpUpload} className="add-playlist">
            <IoAdd color="#45b98d" size="30px"/>Upload Music
        </div>
            <ListMusic dataMusic={dataMusic} getData={getData}/>
    </div>

  )
}
