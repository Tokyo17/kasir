"use client"
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';
import { json } from 'stream/consumers';

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

  const audio = useRef(new Audio(''));

  useEffect(()=>{
    // location.reload()
      audio.current.pause()
      audio.current=new Audio(music?.url||'')

      audio.current.play()
      setIsPlaying(true)
      // console.log(navigator.mediaSession.metadata)
  },[music])

  navigator.mediaSession.metadata = new MediaMetadata({
    title: music?.name,
    artist:String( music?.index)+music?.name,
    album: "The Ultimate Collection (Remastered)",
  });

  if ("mediaSession" in navigator) {
    try{

      navigator.mediaSession.metadata.title="sadhsadb"
    }catch(err){
      console.log(err)
    }


    navigator.mediaSession.setActionHandler("previoustrack", () => {
      // alert(JSON.stringify(dataMusic))
      // console.log(music.index,dataMusic.length-1)
      if(music.index>=1){
        setMusic(dataMusic[music.index-1])
      }
      // setMusic()
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      if(music.index<=dataMusic.length-2){
        // console.log(music.index,dataMusic.length-1)
        setMusic(dataMusic[music.index+1])
      }
    });
}else{
  console.log("media session not work")
}

if ('setPositionState' in navigator.mediaSession) {
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




  useEffect(()=>{
    if(!session&&status == "unauthenticated"){
      audio.current.srcObject=null
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
