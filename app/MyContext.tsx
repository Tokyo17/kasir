"use client"
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';
import dynamic from 'next/dynamic'

// Definisikan tipe data untuk context
export type MyContextType = {
  music: any;
  dataMusic:any;
  setMusic: (message: any) => void;
  setDataMusic: (message: any) => void;
  isPlaying:boolean;
  setIsPlaying:(message:any)=>void;
  playlists: any;
  setPlaylists:(message:any)=>void;
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
  const [dataMusic,setDataMusic]=useState<any>(null)
  const [music, setMusic] =useState<any>('');
  const [isPlaying, setIsPlaying] =useState(false);
  const [playlists, setPlaylists] =useState<any>(null);

  const {data:session,status}=useSession()

  const audio = useRef(typeof Audio !== "undefined" ? new Audio("") : undefined);

  useEffect(()=>{

    console.log(music)
      audio.current?.pause()
      audio.current=new Audio(music?.url||'')
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
              if(music.index>=1){
                setMusic(dataMusic[music.index-1])
              }
            });
        
            navigator.mediaSession.setActionHandler("nexttrack", () => {
              if(music.index<=dataMusic.length-2){
                setMusic(dataMusic[music.index+1])
              }
            });
        }else{
          console.log("media session not work")
        }
        
        
      audio.current.play()
      setIsPlaying(true)
      if ('setPositionState' in navigator.mediaSession) {
        if(audio.current){
          audio.current.onloadedmetadata=()=>{
      
            // if(audio.current.duration){
            //   const interval = setInterval(() => {
                // console.log(audio.current.currentTime)
                navigator.mediaSession.setPositionState({
                  duration: 0,
                  position: 0,
                }); 
            //   }, 1000); // Interval of 1 second
            //   return () => {
            //     clearInterval(interval);
            //   };
            // }     
          }
        }
      }
      setIsPlaying(true)
      // console.log(navigator.mediaSession.metadata)
  },[music])









  useEffect(()=>{
    if(!session&&status == "unauthenticated"){
      if(audio.current){
        audio.current.srcObject=null
      }
    }
  },[status])

  const contextValue: MyContextType = {
    music,
    setMusic,
    dataMusic,
    setDataMusic,
    isPlaying,
    setIsPlaying,
    playlists,
    setPlaylists
  };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

export default MyContextProvider;
