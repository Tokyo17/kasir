import Swal from "sweetalert2"


export const toastLoading=(title:string)=>{
    Swal.fire({
        title: title,
        didOpen:()=>{
            Swal.showLoading()
        },
        
        toast:true,
        width:"300px",
        heightAuto:false,
        position: 'top-end',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false          
    })
}