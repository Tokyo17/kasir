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

  const {data:session,status}=useSession()

  const audio = useRef(typeof Audio !== "undefined" ? new Audio("") : undefined);

  useEffect(()=>{
    // location.reload()
      audio.current?.pause()
      audio.current=new Audio(music?.url||'')

      audio.current.play()
      setIsPlaying(true)
      // console.log(navigator.mediaSession.metadata)
  },[music])



  if ("mediaSession" in navigator) {
    try{
      navigator.mediaSession.metadata = new MediaMetadata({
        title: music?.name,
        artist:String( music?.index)+music?.name,
        album: "The Ultimate Collection (Remastered)",
      });
    }catch(err){
      console.log(err)
    }



}else{
  console.log("media session not work")
}






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
    setDataMusic
  };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

export default MyContextProvider;
