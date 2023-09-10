'use client'
import { IoPlayCircleOutline,IoPauseCircleOutline,IoPlayBackCircleOutline,IoPlayForwardCircleOutline} from "react-icons/io5";
import { ImLoop,ImNext2,ImPrevious2,ImVolumeMute2,ImVolumeMedium } from "react-icons/im";

import { useMyContext } from "../MyContext";
export default function NavButtom(){


    const {mute,setMute,loop,setLoop,backHandler,nextHandler,music,isPlaying,playHandler,pauseHandler}=useMyContext()


    const loopHandler=()=>{
        if(loop=='loop'){
            setLoop('loop-one')
        }if(loop=='loop-one'){
            setLoop('no-loop')
        }else if(loop=='no-loop'){
            setLoop('loop')
        }
    }

    return <div className='nav-bottom'>
        <div className="nav-bottom-title">
            {music?.title?music.title.replace(/.mp3/gi,''):'---'}
        </div>
        <div className="music-control">

            <div className="volume-control">
                {mute?<ImVolumeMute2 onClick={()=>setMute(!mute)} size="20px"/>:
                 <ImVolumeMedium onClick={()=>setMute(!mute)}  size="20px"/>
                }
            </div>

            <div className="main-control">
                <div className="music-control-back">
                    <IoPlayBackCircleOutline  onClick={backHandler} size="40px"/>
                </div>
                <div className="music-control-play">
                {isPlaying&&music?.title?<IoPauseCircleOutline onClick={pauseHandler} size="50px"/>: <IoPlayCircleOutline onClick={playHandler} size="50px"/>}
                </div>
                <div className="music-control-next">
                    <IoPlayForwardCircleOutline onClick={nextHandler} size="40px"/>
                </div>
            </div>

            <div className="loop-control">
                {loop=='loop-one'&&<span>1</span>}
                <ImLoop onClick={loopHandler} color={loop=='no-loop'?'':"#45b98d"}  size="20px"/>
            </div>

        </div>
    
    </div>
}