"use client"
import Image from 'next/image'

import { signIn,signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function Home() {

  const route=useRouter()
  const {data:session}=useSession()
  const [dataMusic,setDataMusic]=useState<any>(null)
  const [dataPlaylist,setDataPlaylist]=useState<any>(null)
  const [dataPlaylistOpen,setDataPlaylistOpen]=useState(false)
  const [dataPlaylistLoad,setDataPlaylistLoad]=useState(false)
  const[showIndex,setShowIndex]=useState<number|null>(null)
  const dotRef = useRef<HTMLDivElement>(null);

  interface LikedEntry {
    userId: number;
    songId: number;
  }

  const getData=async()=>{

    const data= await fetch("/api")
    const json=await data.json()

    // console.log(outputJSON)
    console.log(json)
    setDataMusic(json)
 }


  useEffect(()=>{
    getData()
  },[])

  const removeNavSong=(event: React.MouseEvent<HTMLDivElement>)=>{
    const target = event.target as HTMLElement;
    // console.log(target)

  }

const navSongHandler=(index:number)=>{
  setShowIndex(index==showIndex?null:index)
}

const getDataPlaylist=async(songId:number)=>{
  Swal.showLoading()
  // setDataPlaylistLoad(true)
  // setDataPlaylistOpen(true)
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
    setDataPlaylist(j)
    showNavPlaylist(j,songId)
  }catch(err){
    console.log(err)
  }finally{
    // setDataPlaylistLoad(false)
    // setDataPlaylistOpen(false)

  }

}
const showNavPlaylist=async(value:any,songId:number)=>{

  Swal.fire({
    title: 'Select your playlist',
    input: 'select',
    inputOptions: value,
    showDenyButton:true,
    inputPlaceholder: 'Select a playlist',
    showCancelButton: true,
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
          title: 'Enter your IP address',
          input: 'text',
          inputLabel: 'Your IP address',
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

    Swal.showLoading()
      await fetch("/api/likesong",{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              songId:songId
          })
      }).then(res=>{
          Swal.fire({
            title:'Success!',
            icon:'success',
            timer: 600,
            showConfirmButton:false
          })
          // getDataPlaylist(songId)
          getData()
      }).catch(err=>{
          console.log(err)
      })
}

const unlikeHandler=async(songId:number)=>{

  Swal.showLoading()
    await fetch("/api/likesong",{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            songId:songId
        })
    }).then(res=>{
        Swal.fire({
          title:'Success!',
          icon:'success',
          timer: 600,
          showConfirmButton:false
        })
        // getDataPlaylist(songId)
        getData()
    }).catch(err=>{
        console.log(err)
    })
}
// useEffect(()=>{
//   dataPlaylist&&

// },[dataPlaylist])


  return (
    <div >
        LANDING PAGE
        <p>{JSON.stringify(session)}</p>
        <Link href="/dashboard">dashboard</Link>
        <div onClick={()=>{route.push('/login')}}>Login</div>
        <div onClick={()=>{signOut({redirect:false})}}>Logout</div>

        {dataMusic?.songs?.map((item:{id:number,title:string,liked:boolean},index:number)=>{
            return <div  onClick={removeNavSong} className='flex justify-between border border-indigo-600 h-9' key={index}>
                       <p >
                            {item.title}
                        </p>
                        <div className='song-action'>
                          <button onClick={()=>item.liked?unlikeHandler(item.id):likeHandler(item.id)}>{item.liked?'Liked':'Like'}</button>
                          <button onClick={()=>getDataPlaylist(item.id)}>Add Playlist</button>
                        </div>
                        {/* <div ref={dotRef} onClick={()=>navSongHandler(index)} className='cursor-pointer'>...</div> */}
                        {/* {showIndex==index&&<div className='nav-song'>
                          <p>opsi 1</p>
                          <p>opsi 2</p>
                        </div>} */}

                  </div>
        })}
    </div>
  )
}
