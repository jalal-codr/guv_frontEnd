import axios from 'axios';
import React, { useState,useEffect } from 'react'
import {socket} from '../sockets'
import {onAuthStateChanged}  from 'firebase/auth'
import {auth} from '../FirebaseConfig'

function Request({data}) {
    const [user,setUser] = useState()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    
    
        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);


    const accept = ()=>{
        if(user){
            const requestId = {
                id:data._id,
                toImg:user.photoURL
            }
            const options = {
                method: "POST",
                url:"https://guv-n5s8.onrender.com/accept-request",
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${user.accessToken}`
                },
                data:requestId,
              };
            axios.request(options)
            .then((data)=>{
                socket.emit("Request")
            })
            .catch((err)=>{
                console.log(err)
            })
        }

    }
    const decline =()=>{
        if(user){
            const requestId ={
                id:data._id
            }
            const options = {
                method: "POST",
                url:"https://guv-n5s8.onrender.com/decline-request",
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${user.accessToken}`
                },
                data:requestId,
              };
            axios.request(options)
            socket.emit("Request")
        }

    }

    const render =()=>{
        if(user){
            if(data.to == user.email){
                return(<>
                    <div className="card w-96 bg-neutral req_div text-neutral-content">
            <div className="card-body items-center text-center">
                <h2 className="card-title">Friend Request</h2>
                <p>{data.from}</p>
                <div className="card-actions justify-end">
                <button onClick={accept} className="btn btn-primary">Accept</button>
                <button onClick={decline} className="btn btn-ghost">Deny</button>
                </div>
            </div>
            </div>
        </>)
    }
        }
       
    }
  return (
    <>
    {
        render()
    }
    </>
  )
}

export default Request
