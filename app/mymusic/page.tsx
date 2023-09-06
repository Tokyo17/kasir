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
  const{music,setDataMusic,dataMusic,successUploadMusic}=useMyContext()

  const getData=async()=>{

    const data= await fetch("/api/songs")
    const json=await data?.json()

    // console.log(outputJSON)
    console.log(json)
    setDataMusic(json)
 }

  useEffect(()=>{
    getData()
    console.log(session)
  },[session])


  
  const addMusic=async(title:string,url:string,duration:string)=>{
    await fetch("/api/songs",{
method:"POST",
headers:{
    "Content-Type":"application/json"
},
body:JSON.stringify({
    title:title,
    url:url,
    duration:duration
})
}).then(res=>{
if(res.ok){
    getData()
    successUploadMusic()
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
// const audio = useRef(typeof Audio !== "undefined" ? new Audio("") : undefined);

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
            const reader = new FileReader();
            let duration=''

            if(file){

                reader.onload = () => {
                    const audioUrl = reader.result as string || '';
                    
                   const  audio = new Audio(audioUrl);
                    audio.addEventListener('loadedmetadata', () => {
                        const time =Math.floor(audio?.duration)
                        const minutes = Math.floor(time / 60);
                        const seconds = time - minutes * 60;
                        duration=`${minutes}:${seconds}`
                        console.log(duration)

                    const storageRef=ref(storage,`music/${file?.name}`)
                    const uploadTask=uploadBytesResumable(storageRef,file)

                return  uploadTask.on("state_changed",
                     (snapshot)=>{
                        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        console.log(progress)
                        Swal.fire({
                            title: `Uploading music ${progress}%`,
                            didOpen:()=>{
                                Swal.showLoading()
                            },
                            
                            toast:true,
                            heightAuto:false,
                            // showClass:{
                            //     popup: '',
                            //     backdrop: '',
                            //     icon: ''
                            // },
                            // hideClass:{
                            //     popup: '',
                            //     backdrop: '',
                            //     icon: ''
                            // },
                            position: 'top-end',
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: false          
                        })
    
                    },(err:any)=>{
                        Swal.showValidationMessage(
                            `please input your music`
                        )
                    },()=>{
                        getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
                        addMusic(file?.name,url,duration)

                        })
                    }
                    )

                    });
                    // Mulai memuat audio
                    audio.src = audioUrl;
                };
                reader.readAsDataURL(file);
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
