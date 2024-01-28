import axios from 'axios';
import React, { useState,useEffect } from 'react'
import {useCookies} from 'react-cookie'
import { Image } from 'cloudinary-react';
import {socket} from '../sockets'
import  {onAuthStateChanged} from 'firebase/auth'
import {auth} from "../FirebaseConfig"

function Blog({data}) {
    const [cookies] = useCookies(['user']);
    const [commentCookies,setCookie,] = useCookies(['comment']);
    const [img,setImg]= useState()
    const [user,setUser] = useState();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });
  
  
      // Clean up subscription on unmount
      return () => unsubscribe();
  }, []);

    const like = async()=>{
      try{
        const blog = {
          blogId:data._id,
          email:user.email
        }
        const options = {
          method: "PUT",
          url:"https://guv-n5s8.onrender.com/like_blog",
          headers: {
              accept: "application/json",
              authorization: `Bearer ${user.accessToken}`
          },
          data:blog,
        };
        const  response = await axios.request(options)
        socket.emit("likes")
      }
      catch(err){
        console.log(err)
      }

    }
    const comment = async()=>{
      setCookie('comment',{
        blogId:data._id,

      })
      window.location.href = '/comments'
      

    }

    const ownBlog = ()=>{
        if(user){
          if(data.email==user.email){
            return(<>
              <button onClick={deleteBlog} className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </>)
        }
  
        }
 
    }

    const  deleteBlog = async()=>{
      try{
        const blogId ={
          blogId:data._id,
        }
        const options = {
          method: "PUT",
          url:"https://guv-n5s8.onrender.com/delet-blog",
          headers: {
              accept: "application/json",
              authorization: `Bearer ${user.accessToken}`
          },
          data:blogId,
        };
        await axios.request(options)
        .then(()=>{
          socket.emit('blogDeleted')
        })
      }
      catch(err){
        console.log(err);
      }
    }

    const render = ()=>{
      if(data.imgRef){
         return(<>
          <div className="card card_div w-96 bg-base-100 shadow-xl">
         <figure><Image cloudName="jalals" width="300" crop="scale" publicId={data.imgRef}/></figure>

         <div className="card-body">
         <div>
         <h2 className="card-title">{data.name}</h2>
         </div>
           <div className='delete_blog_btn'>
            {
              ownBlog()
            }
           </div>
           <div className='blog_txt'>
           <p>{data.body}</p>
           </div>
           
           <div className="card-actions justify-end">
           <div className='comennts'>
                  <button  onClick={comment}>comments</button>
                  <p>{data.comments}</p>
                </div>
            <div className='likes'>
              <p>{data.likes} likes</p>
            </div>
             <button onClick={like} className="btn btn-primary">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
          </div>
         </div>
       </div>
         </>)
        
      
      }

      else{
        return(<>
      <div className="card w-96 card_div blog bg-primary text-primary-content">
          <div className="card-body">
              <div>
              <h2 className="card-title">{data.name}</h2>
              </div>
             
              <div className='delete_blog_btn'>
            {
              ownBlog()
            }
           </div>
           <div className='blog_txt'>
           <p>{data.body}</p>
           </div>
              
              <div className="card-actions justify-end">
                <div className='comennts'>
                  <button  onClick={comment}>comments</button>
                  <p>{data.comments}</p>
                </div>
              <div className='likes'>
              <p>{data.likes} likes</p>
            </div>
              <button onClick={like}  className="btn"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button>
              </div>
          </div>
          </div>
        </>)
      }
      
    }
  return (
    <>
    {render()}
    </>
  )
}

export default Blog
