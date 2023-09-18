import Image from "next/image"
import loading from "../loading.gif"


export default function Loading(){
    return   <div className='loading'>
    <Image src={loading} alt="loading" />
  </div>
}