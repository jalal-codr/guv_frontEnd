import axios from 'axios';
import React, { useState,useEffect } from 'react'
import {useCookies} from 'react-cookie'
import Nav from './Nav';
import { socket } from '../sockets';
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from "../FirebaseConfig"

function CreateChat() {
    const [cookies] = useCookies(['user']);
    const [user,setUser] = useState();
    const [person,setPerson] = useState('')

    const getChat = (e)=>{
        setPerson(e.target.value)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    
    
        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);


    const click = ()=>{
        if(user){
            const data={
                from:user.email,
                fromImg:user.photoURL,
                to:person
            }
            const options = {
                method: "POST",
                url:"https://guv-n5s8.onrender.com/create-request",
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${user.accessToken}`
                },
                data:data,
              };
            axios.request(options)
            .then((res)=>{
                socket.emit("Request")
            })
            .catch((err)=>{
                console.log(err)
            })
        }
 
    }
  return (
    <>
    <Nav/>
    <div className='creatChat_'>
    <input type="text" onChange={getChat} placeholder="Friends Email" className="input create_1 input-bordered w-full max-w-xs" />
    <div className='createChatBtn'>
    <button onClick={click} className="btn">Send invite</button>
    </div>
    </div>
      
    </>
  )
}

export default CreateChat
