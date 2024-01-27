import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Nav from '../Components/Nav'
import {useCookies} from 'react-cookie'
import Blog from '../Components/Blog'
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from "../FirebaseConfig"

function Profile() {
  const [cookies,removeCookie] = useCookies(['user']);
  const [friends,setFriends] =  useState([])
  const [blogs, setBlog] = useState ([])
  const [person,setPerson] = useState();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setPerson(currentUser);
    });


    // Clean up subscription on unmount
    return () => unsubscribe();
}, []);

  const logout  = async()=>{
    try{
      removeCookie('user')
      window.location.href='/'
    }
    catch(err){
      console.log(err)
    }
  }
  const  getFriends = async ()=>{
    try{
      const email = {
        email:person.email
      }
      const url='https://guv-n5s8.onrender.com/get-friends'
      await axios.put(url,email)
      .then((data)=>{
        setFriends(data.data)
        
      })
      .catch((err)=>{
        console.log(err)
      })
    }
    catch(err){
      console.log(err)
    }
  }

  const getBlogs = async ()=>{
    try{
      const email = {
        email:person.email
      }
      const url='https://guv-n5s8.onrender.com/get-my-blogs'
      await axios.post(url,email)
      .then((data)=>{
        setBlog(data.data.reverse())
        
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
    getFriends()
    getBlogs()
  },[])

  return (
    <>
    <Nav/>

    <div className='user_profile' >
    <a>
    <img className='img_' src={person.photo} />
    </a>
    <div className='email_div_pr'>
    <p className="btn btn-ghost normal-case text-xl"> {person.email}</p>
    </div>
    <div className='name_div_p'>
    <p className="btn btn-ghost normal-case text-xl">{person.name}</p>
    </div>
    <div className='num_blogs'>
      <p className='p_num' >{blogs.length}</p>
      <p>Blogs</p>
    </div>
    <div className='num_freinds'>
      <p className='p_num'>{friends.length}</p>
      <p>Friends</p>
    </div>
    <div className='logout_btn'>
    <button onClick={logout} className="btn btn-wide">Log out</button>
    </div>
    </div>

    <div className='blogs_profile'>
      {
        blogs.map((element,index)=>(<Blog key={index} const data={element}/>))
      }
    </div>
      
    </>
  )
}

export default Profile
