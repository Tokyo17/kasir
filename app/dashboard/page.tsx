
"use client"
import { url } from "inspector"
import { signIn,signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { DOMAttributes, FormEvent, FormEventHandler, useEffect, useRef, useState } from "react"
import { useMyContext } from "../MyContext"
import Link from "next/link"
import Swal from "sweetalert2"
import { AiOutlineDelete,AiOutlineEdit } from "react-icons/ai";


export default function Dashboard(){

    // const [dataPlaylists,setDataPlaylists]=useState<any>(null)
    // const [music,setMusic]=useState<any>(null)
    const route=useRouter()
    const {data:session,status}=useSession()
    const{playlists,setPlaylists}=useMyContext()
    const[name,setName]=useState('')


    useEffect(()=>{
        if(!session&&status == "unauthenticated"){
          route.push('/')
        }
    },[status])


    const  updateHandler=(id:number)=>{
        route.push(`/dashboard/${id}`)
      }

    const getData=async()=>{
       const data= await fetch("/api/playlist")
       const json=await data.json()
    //     const newJson = json?.data?.map((item: { index:number,img_name: string, url: string },index:number) => ({
    //     index:index,
    //     name: item.img_name,
    //     url: item.url
    //   }));
      console.log(json)
      setPlaylists(json)
    }

    
    const addPlaylist=async()=>{

        if(name){
            await fetch("/api/playlist",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name:name
                })
            }).then(res=>{
                getData()
                setName('')
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        }
    }

 


    const deletePlaylist=async(id:number)=>{
        Swal.showLoading()
            await fetch(`/api/playlist?id=${id}`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(res=>{
                if(res.ok){
                    getData()
                    Swal.fire({
                        title:'Success!',
                        icon:'success',
                        timer: 1000,
                        showConfirmButton:false
                      })
                }else{
                    Swal.fire({
                        title:'Error!',
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

    const renamePlaylistApi=async(id:number,name:string)=>{
       
            await fetch(`/api/playlist`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    id:id,
                    name:name
                })
            }).then(res=>{
                if(res.ok){
                    getData()
                    Swal.fire({
                        title:'Success!',
                        icon:'success',
                        timer: 1000,
                        showConfirmButton:false
                      })
                }else{
                    Swal.fire({
                        title:'Error!',
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

    const renamePlaylist=async(id:number,name:string)=>{
        let inputValue=name

        const { value: newName } = await  Swal.fire({
          title: 'Enter your new name playlist',
          input: 'text',
          inputValue: inputValue,
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!'
            }else{

            }
          }
        })
        if (newName) {
                            Swal.fire({
                    title: "Updateing name playlist",
                    html: 'please waiting for a seconds.',
                    didOpen:()=>{
                        Swal.showLoading()
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false  
                })
                
                renamePlaylistApi(id,newName)
            
          }
    }

 
    useEffect(()=>{
        getData()
    },[])
 


    return(
        <div>
            {/* Dashboard
           
            <Link href="/">landing2</Link>

        <div onClick={()=>{route.push('/login')}}>Login</div>
        <div onClick={()=>{signOut({redirect:false})}}>Logout</div> */}
        <div onClick={()=>{route.push('/like')}}>List song like</div>
        <p>ADD Playlist</p>
        <input onChange={(e)=>setName(e.target.value) } value={name}/>
        <button onClick={addPlaylist}>ADD</button>
        {playlists?.playlists?.map((item:{id:number,name:string},index:number)=>{
             return <div key={index} className='list-playlist'>
                    <div className='playlist-number'>{index+1}</div>
                    <div className="playlist-title">
                       <p   onClick={()=>{updateHandler(item.id)}}>{item.name}</p>
                    </div>
                     <div className='playlist-action'>
                        <AiOutlineDelete size="20px" onClick={()=>{deletePlaylist(item.id)}}/>
                        <AiOutlineEdit size="20px" onClick={()=>{renamePlaylist(item.id,item.name)}}/>
                    </div>
             </div>

        })}
        
        </div>
        
    )
}