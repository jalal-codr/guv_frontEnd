import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useCookies} from 'react-cookie'
import {socket} from '../sockets'
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from "../FirebaseConfig"

function TesxtArea() {
    const [message,setMessage]=useState("")
    const [cookies] = useCookies(['user']);
    const [img,setImg] =useState('')
    const [base64Image, setBase64Image] = useState('');
    const [user,setUser] = useState();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    
    
        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);

    const getMsg=(e)=>{
        setMessage(e.target.value)
    }
    const getImg = (e)=>{
        setImg(e.target.files[0])
    }

    const submit = async()=>{

        if(img){

            const formData = new FormData();
            formData.append('image', img);

            const url1 ='https://guv-n5s8.onrender.com/upload-image'
            axios.post(url1,formData)
            .then((response)=>{
                console.log(response.data)
                const data ={
                    email:user.email,
                    name:user.name,
                    photo:user.photo,
                    body:message,
                    imgRef:response.data
                }
                const url ='https://guv-n5s8.onrender.com/create-blog' 
                axios.post(url,data)
                .then((data)=>{
                    console.log(data)
        
                })
                .catch((err)=>{
                    console.log(err)
                })
            })
            .catch((err)=>{
                console.log(err)
            })
            
            
        }
        else{    
            const data ={
                email:user.email,
                name:user.name,
                photo:user.photo,
                body:message,
            }
            console.log(data)
            const url ='https://guv-n5s8.onrender.com/create-blog' 
            axios.post(url,data)
            .then((data)=>{
                console.log(data)
    
            })
            .catch((err)=>{
                console.log(err)
            })
        
        }
        socket.emit("newBlog")
    }

  return (
    <>
    <div className='txtA_div'>
    <textarea className="textarea txtA textarea-bordered" onChange={getMsg} placeholder="Whats on your mind?"></textarea>
    <div className='file_inpDiv'>
    <input onChange={getImg} type="file" className="file-input  file-input-bordered w-full max-w-xs" />
    </div>
    <div className='btn1_div'>
    <button onClick={submit} className="btn btn-xs  sm:btn-sm md:btn-md lg:btn-lg">Blog</button>
    </div>

    </div>

    </>
  )
}

export default TesxtArea
