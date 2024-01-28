import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CreateChat from '../Components/CreateChat'
import Chat from '../Components/Chat'
import ChatPage from './ChatPage'
import Blog from '../Components/Blog';
import {socket} from '../sockets'
import {useCookies} from 'react-cookie'
import {onAuthStateChanged} from "firebase/auth"
import {auth} from '../FirebaseConfig'

function Chats() {
  const [friends,setFriends] = useState([])
  const [blogs,setBlogs] = useState([])
  const [screen,setScreen] = useState('')
  const [person,setPerson] = useState();
  const mobileScreen =430
  const screenWidth = window.innerWidth;


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setPerson(currentUser);
    });


    // Clean up subscription on unmount
    return () => unsubscribe();
}, []);

  useEffect(()=>{
    if(screenWidth  > mobileScreen){
      setScreen('PC')
    }
    else{
      setScreen('MOBLIE')
    }
  },[])

  const renderBlogs = ()=>{
    if(screen=="PC"){
      return(<>
        <div  className='blogs_chat'>
        {
          blogs.map((element,index)=>(<Blog key={index} const data={element}/>))
        }
        </div>
      </>)
    }
  }


  const getChats = async()=>{
    try{
      const email = {
        email:person.email
      }

      const options = {
        method: "PUT",
        url:"https://guv-n5s8.onrender.com/get-friends",
        headers: {
            accept: "application/json",
            authorization: `Bearer ${person.accessToken}`
        },
        data:{email:person.email},
      };
      axios.request(options)
      .then((data)=>{
        setFriends(data.data.reverse())
      })
      .catch((err)=>{
        console.log(err)
      })
    }
    catch(err){
      console.log(err)
    }
  }

  const  getBlogs = async()=>{
    try{
      const options = {
        method: "GET",
        url:"https://guv-n5s8.onrender.com/get-blogs",
        headers: {
            accept: "application/json",
            authorization: `Bearer ${person.accessToken}`
        },
      };
      axios.request(options)
      .then((data)=>{
        setBlogs(data.data.reverse())
      })
      .catch((err)=>{
        console.log(err)
      })
    }
    catch(err){
      console.log(err)
    }
  }  

  useEffect(()=>{
    if(person){
      getChats()
    }
  },[person])

  useEffect(()=>{
    socket.on("getChats",()=>{
      getChats();
    })
  },[socket])


  useEffect(()=>{
    if(person){
      getBlogs()
    }
  },[person])

  useEffect(()=>{
    socket.on("GetBlogs",()=>{
      getBlogs();
    })
  },[socket])

  return (
    <>
    <CreateChat/>
    <div className='friends-cont'>
    {
      friends.map((element,index)=>(<Chat key={index} data={element}/>))
    }   
    </div>
    {
      renderBlogs()
    }
    
   
    </>
  )
}

export default Chats
