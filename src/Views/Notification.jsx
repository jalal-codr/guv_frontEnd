import React, { useEffect, useState } from 'react'
import Nav from '../Components/Nav'
import axios from 'axios'
import Request from '../Components/Request'
import { socket } from '../sockets'
import {onAuthStateChanged}  from "firebase/auth"
import {auth} from "../FirebaseConfig"

function Notification() {
    const [user,setUser] = useState();
    const [notifications,setNotifications]= useState([])

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });
  
  
      // Clean up subscription on unmount
      return () => unsubscribe();
  }, []);

    useEffect(()=>{
      if(user){
        getNotifications()
      }

    },[user])

    useEffect(()=>{
      socket.on("GetNotifications",()=>{
        getNotifications()
      })
    },[socket])

    const getNotifications = async()=>{
      const data = {
        email:user.email
      }
      const options = {
        method: "PUT",
        url:"https://guv-n5s8.onrender.com/get-requests",
        headers: {
            accept: "application/json",
            authorization: `Bearer ${user.accessToken}`
        },
        data:data,
      }; 
      axios.request(options)
      .then((data)=>{
        setNotifications(data.data.reverse())
      })
      .catch((err)=>{
          console.log(err)
      })
    }

    const checkNots = ()=>{
      if(notifications.length<=0){
        return(<p className='no_nots' >No New Notifications</p>)
      }
    }
  return (
    <>
    <Nav/>
    {
      checkNots()
    }
    <div className='nots_div'>
    {
      notifications.map((element,index)=>(<Request key={index} data={element}/>))
    }
    </div>


      
    </>
  )
}

export default Notification
