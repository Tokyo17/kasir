"use client"



export default function Update({params}:{params:{id:string}}){
    const id=params.id


    return(
        <div >
            name : {id}
        </div>
    )
}