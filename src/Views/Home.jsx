import React, { useEffect, useState } from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios';
import Nav from '../Components/Nav';
import Blog from '../Components/Blog';
import TesxtArea from '../Components/TesxtArea';
import {socket} from '../sockets'
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from "../FirebaseConfig"

function Home() {
    const [cookies, setCookie] = useCookies(['user']);
    const [blogs,setBlogs] = useState([])
    const [user,setUser] = useState()


    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });
  
  
      // Clean up subscription on unmount
      return () => unsubscribe();
  }, []);





    const getblogs = async()=>{
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
      getblogs();
    },[])

    useEffect(()=>{
      socket.on("GetBlogs",()=>{
        getblogs()
      })
    },[socket])

  return (
    <>
    <Nav/> 
    <TesxtArea/>
    <div  className='blog_div'>
    {
      blogs.map((element,index)=>(<Blog key={index} const data={element}/>))
    }
    </div>


     
    </>
  )
}

export default Home
