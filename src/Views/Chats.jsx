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
  const [cookies] = useCookies(['user']);
  const [person,setPerson] = useState();
  const mobileScreen =430
  const screenWidth = window.innerWidth;


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
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
        email:person.email}
      const url='https://guv-n5s8.onrender.com/get-friends'
      axios.put(url,email)
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
      const url = 'https://guv-n5s8.onrender.com/get-blogs'
      axios.get(url)
      .then((data)=>{
        setBlogs(data.data.reverse())
        // console.log(blogs)
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
    getChats()
  },[])

  useEffect(()=>{
    socket.on("getChats",()=>{
      getChats();
    })
  },[socket])


  useEffect(()=>{
    getBlogs()
  },[])

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
