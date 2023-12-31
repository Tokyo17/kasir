"use client"
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';
import dynamic from 'next/dynamic'
import Swal from 'sweetalert2';

// Definisikan tipe data untuk context
export type MyContextType = {
  dataQueueMusic:any;
  setDataQueueMusic: (message: any) => void;
  dataMusicLiked:any;
  setDataMusicLiked: (message: any) => void;
  music: any;
  dataMusic:any;
  setMusic: (message: any) => void;
  setDataMusic: (message: any) => void;
  isPlaying:boolean;
  setIsPlaying:(message:any)=>void;
  playlists: any;
  setPlaylists:(message:any)=>void;
  playHandler:()=>void;
  pauseHandler:(message:any)=>void;
  backHandler:(message:any)=>void;
  nextHandler:(message:any)=>void;
  toastSucces:()=>void;
  loop:string;
  setLoop:(message:any)=>void;
  mute:boolean;
  setMute:(message:boolean)=>void;
};

// Buat instance context dengan tipe data yang telah ditentukan
const MyContext = createContext<MyContextType | undefined>(undefined);

// Buat custom hook untuk mengakses context
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};

type MyContextProviderProps = {
  children: React.ReactNode;
};

const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const[    dataQueueMusic,setDataQueueMusic]=useState<any>(null)
  const [dataMusic,setDataMusic]=useState<any>(null)
  const [dataMusicLiked,setDataMusicLiked]=useState<any>(null)
  const [music, setMusic] =useState<any>('');
  const [isPlaying, setIsPlaying] =useState(false);
  const [playlists, setPlaylists] =useState<any>(null);
  const [loop, setLoop] =useState<string>('loop');
  const [mute, setMute] =useState<boolean>(false);
  const [ended, setEnded] =useState<boolean>(false);

  const {data:session,status}=useSession()

  const audio = useRef(typeof Audio !== "undefined" ? new Audio("") : undefined);

useEffect(()=>{
if(ended){
     // setIsPlaying(false)
     console.log(music?.index,dataQueueMusic?.songs.length-1)
     console.log("loop : ",loop==='loop',loop)
     console.log("no loop : ",loop==='no-loop',loop)
     if(loop==='loop'){
       if(music?.index==dataQueueMusic?.songs.length-1){
         console.log("ulang")
         setMusic(dataQueueMusic?.songs[0])
       }else{
         nextHandler()
       }
     }else if(loop==='loop-one'){
       playHandler()
     }else if(loop==='no-loop'){
       if(music?.index==dataQueueMusic?.songs.length-1){
         setIsPlaying(false)
       }else{
         nextHandler()
       }
     }
     setEnded(false)
     console.log("ended : ",ended)
}
},[ended])

  audio.current?.addEventListener("ended", function(){
    setEnded(true)
  });

  const playHandler=()=>{
    if(music){
    audio?.current?.play()
    setIsPlaying(true)}
  }

  const stopHandler=()=>{
    if(audio.current){
      audio.current.srcObject=null
      setMusic(null)
      setIsPlaying(false)
    }
  }
  const pauseHandler=()=>{
    if(music){
    audio?.current?.pause()
    setIsPlaying(false)}
  }

  const backHandler=()=>{
    if(music.index>=1){
      setMusic(dataQueueMusic?.songs[music.index-1])
    }
  }

  const nextHandler=()=>{
    if(music.index<=dataQueueMusic?.songs.length-2){
      setMusic(dataQueueMusic?.songs[music.index+1])
    }
  }
  const [oldMusic,setOldMusic]=useState<any>(null)


  useEffect(()=>{
    if(audio.current){
      audio.current.muted=mute;
    }
  },[mute])

  useEffect(()=>{
    console.log(music?.index,dataQueueMusic?.songs.length)
    console.log(music?.id,music?.index,oldMusic?.id,oldMusic?.index)
    if(music?.id!=oldMusic?.id){
      audio.current?.pause()
      audio.current=new Audio(music?.url||'')
      audio.current.play()
      setIsPlaying(true)
      if ('setPositionState' in navigator.mediaSession) {
        if(audio.current){
          audio.current.onloadedmetadata=()=>{
                navigator.mediaSession.setPositionState({
                  duration: 0,
                  position: 0,
                }); 
          }
        }
      }
      setIsPlaying(true)
      setOldMusic(music)

      }
      if ("mediaSession" in navigator) {
        try{
          navigator.mediaSession.metadata = new MediaMetadata({
            title: music?.title,
            artist:String( music?.index)+music?.name,
            album: "The Ultimate Collection (Remastered)",
          });
          navigator.mediaSession.metadata.title=music?.title
        }catch(err){
          console.log(err)
        }
    
        navigator.mediaSession.setActionHandler("pause", () => {
         setIsPlaying(false)
         audio?.current?.pause()
        });

        navigator.mediaSession.setActionHandler("play", () => {
          setIsPlaying(true)
          audio?.current?.play()
        });
    
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          console.log(dataQueueMusic)
          if(music.index>=1){
            setMusic(dataQueueMusic?.songs[music.index-1])
          }
        });
    
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          if(music.index<=dataQueueMusic?.songs.length-2){
            setMusic(dataQueueMusic[music.index+1])
          }
        });
    }else{
      console.log("media session not work")
    }
    
  },[music])



  // ======= FUNCTION HANDLER ===========
  const toastSucces=()=>{
    Swal.fire({
      title:'Success!',
      icon:'success',
      timer: 1000,
      toast:true,
      heightAuto:false,
      position: 'top-end',
      showConfirmButton:false
    })
  }






  useEffect(()=>{
    if(!session&&status == "unauthenticated"){
        stopHandler()
    }
  },[status])

  const contextValue: MyContextType = {
    dataQueueMusic,
    setDataQueueMusic,
    dataMusicLiked,
    setDataMusicLiked,
    music,
    setMusic,
    dataMusic,
    setDataMusic,
    isPlaying,
    setIsPlaying,
    playlists,
    setPlaylists,
    playHandler,
    pauseHandler,
    nextHandler,
    backHandler,
    toastSucces,
    loop,
    setLoop,
    setMute,
    mute

  };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

export default MyContextProvider;
