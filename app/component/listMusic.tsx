"use client"
import Image from 'next/image'

import { signIn,signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { IoPlayOutline,IoPauseSharp,IoHeartOutline,IoHeartSharp,IoAddCircleOutline } from 'react-icons/io5';
import { useMyContext } from '../MyContext'
import { AiOutlineDelete,AiOutlineEdit } from "react-icons/ai";
import { deleteObject, ref } from 'firebase/storage'
import { storage } from '../firebase'
import { toastLoading } from './loadingPopup'

export default function ListMusic({dataMusic,getData,delButton}:any) {


  const{music,setMusic,isPlaying,setDataQueueMusic,playHandler,pauseHandler,toastSucces}=useMyContext()



  const {data:session}=useSession()

const getDataPlaylist=async(songId:number)=>{
    if(session){
      Swal.fire({
        heightAuto:false,
        didOpen: () => {
            Swal.showLoading()
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
      })

        try{
            const data= await fetch(`/api/playlist?songid=${songId}`)
            const json=await data.json()
                    const j = json?.playlists?.reduce((obj:any, item:any) => {
                    if(!item.listed){
                    obj[item.id] = item.name;}
                    return obj;
                }, {});
        console.log(json)
        console.log(j)
            showNavPlaylist(j,songId)
        }catch(err){
            console.log(err)
        }finally{

        }
    }else{
        Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: 'Plase login first',
          })
    }
}
const showNavPlaylist=async(value:any,songId:number)=>{

  Swal.fire({
    title: 'Select your playlist',
    input: 'select',
    inputOptions: value,
    showDenyButton:true,
    denyButtonText:"Add",
    inputPlaceholder: 'Select a playlist',
    showCancelButton: true,
    heightAuto:false,
    cancelButtonColor:'#7066e0',
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value) {
          
          addSongPlaylist(Number(value),songId)

        } else {
          resolve('You must to select playlist :)')
        }
      })
    }
  }).then(result=>{
    let inputValue
      if(result.isDenied){
        Swal.fire({
          title: 'Enter your name playlist',
          input: 'text',
          inputLabel: 'Your playlist',
          inputValue: inputValue,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!'
            }else{
              addPlaylist(value,songId)
            }
          }
        })
      }
  })
}

const addSongPlaylist=async(playlistId:number,songId:number)=>{
  Swal.fire({
    title: "Loading",
    html: 'process add song to playlist',
    didOpen: () => {
        Swal.showLoading()
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  })
      await fetch("/api/songonplaylist",{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              playlistId:playlistId,
              songId:songId
          })
      }).then(res=>{
          console.log(res)
          Swal.fire({
            title:'Success!',
            icon:'success',
            timer: 100,
            showConfirmButton:false
          })
      }).catch(err=>{
          console.log(err)
      })
}

const addPlaylist=async(name:string,songId:number)=>{

  if(name){
    Swal.showLoading()
      await fetch("/api/playlist",{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              name:name
          })
      }).then(res=>{
          console.log(res)
          Swal.fire({
            title:'Success!',
            icon:'success',
            timer: 600,
            showConfirmButton:false
          })
          getDataPlaylist(songId)
      }).catch(err=>{
          console.log(err)
      })
  }
}

const likeHandler=async(songId:number)=>{
    if(session){
       toastLoading('Please wait a moment')
        await fetch("/api/likesong",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                songId:songId
            })
        }).then(res=>{
            toastSucces()
            // getDataPlaylist(songId)
            getData()
        }).catch(err=>{
            console.log(err)
        })
    }else{
        Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: 'Plase login first',
          })
    }
}

const unlikeHandler=async(songId:number)=>{

    toastLoading('Please wait a moment')
    await fetch("/api/likesong",{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            songId:songId
        })
    }).then(res=>{
        toastSucces()
        // getDataPlaylist(songId)
        getData()
    }).catch(err=>{
        console.log(err)
    })
}

const playOrPauseHandler=(item:any)=>{
    if(music?.id==item?.id&&isPlaying){
    
     return  <IoPauseSharp size='25px' onClick={pauseHandler}/>
    }else{
       return <IoPlayOutline size='25px' onClick={()=>{
            // if(music?.id==item?.id){
                playHandler()
                setDataQueueMusic(dataMusic)
              setMusic(item)
            // }
        }}/>
    }
}


const deleteFirebase=(title:string)=>{
  const filreRef=ref(storage,`music/${title}`)
  deleteObject(filreRef).then(()=>{
    toastSucces()
    console.log("del firebase success")
    getData()
  }).catch((err:any)=>{
    console.log(err)
    // showError()
  })
}


const deletHandle=(id:number,title:string)=>{
  Swal.fire({
    title: 'Do you want to delete?',
    showDenyButton: true,
    // showCancelButton: true,
    confirmButtonText: 'Delete',
    denyButtonText: `Don't Delete`,
  }).then( async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {

      toastLoading("Deleting Music")
      await fetch("api/songs?id="+id,{
        method:"DELETE"
      }).then(()=>{
        console.log("del prisma success")
        deleteFirebase(title)
      }).catch(err=>{
        console.log(err)
      })
    } else if (result.isDenied) {
      // Swal.fire('Changes are not saved', '', 'info')
    }
  })
}

  return (
    <div className='content'>
        {dataMusic?.songs?.map((item:{id:number,duration:string,index:number,url:string,title:string,liked:boolean},index:number)=>{
            item.index=index
            return <div  className='list-song' key={index}>
                        {/* <div className='song-number'>{index+1}</div> */}
                        <div className='cursor-pointer play-icon'>{playOrPauseHandler(item)}</div>
                       <p className='title-song' >
                            {item.title}
                        </p>
                        <div className='song-duration'>{item.duration}</div>
                        <div style={{width:delButton?"80px":"60px"}} className='song-action'>
                          <div className='cursor-pointer like-button'>{item.liked?<IoHeartSharp color="#45b98d" size='25px' onClick={()=>item.liked?unlikeHandler(item.id):likeHandler(item.id)}/>:<IoHeartOutline size='25px' onClick={()=>item.liked?unlikeHandler(item.id):likeHandler(item.id)}/>}</div>
                          <div className='cursor-pointer playlist-button'> <IoAddCircleOutline size="25px" onClick={()=>getDataPlaylist(item.id)}/> </div>
                         {delButton&& <div><AiOutlineDelete onClick={()=>deletHandle(item.id,item.title)}  size="25px"/></div>}
                        </div>
                  </div>
        })}

       
    </div>
  )
}
