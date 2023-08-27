'use client'
import { IoPlayCircleOutline,IoPauseCircleOutline,IoPlayBackCircleOutline,IoPlayForwardCircleOutline} from "react-icons/io5";
import { useMyContext } from "../MyContext";
export default function navButtom(){


    const {backHandler,nextHandler,music,isPlaying,playHandler,pauseHandler}=useMyContext()

    return <div className='nav-bottom'>
        <div className="nav-bottom-title">
            {music?.title?music?.title:'---'}
        </div>
        <div className="music-control">
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
    
    </div>
}