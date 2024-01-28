import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {useCookies} from 'react-cookie'
import Comment from '../Components/Comment';
import {socket} from '../sockets'
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "../FirebaseConfig"

function Comments() {
    const [comment, setComment] = useState('')
    const [coments,setComments] =useState([])
    const [commentCookies,setCookie,] = useCookies(['comment']);
    const blogId = commentCookies.comment.blogId
    const [user,setUser] = useState();



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    
    
        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);
      
    const getComment = (e)=>{
        setComment(e.target.value);
    }
    const  btnClick = async()=>{
        if(user){
            const newComment = {
                blogId:blogId,
                from:user.email,
                comment:comment,
                userImg:user.photoURL
            }
            const options = {
                method: "POST",
                url:"https://guv-n5s8.onrender.com/new-comment",
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${user.accessToken}`
                },
                data:newComment,
              };
            const  response = await axios.request(options)
            if(response){
                socket.emit('newComment')
            }
        }
    }

    const getBlogComments = async()=>{
        try{
                const data = {
                    blogId:blogId
                }
                const options = {
                    method: "PUT",
                    url:"https://guv-n5s8.onrender.com/get-comments",
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${user.accessToken}`
                    },
                    data:data,
                  };
                if(data){
                    await axios.request(options)
                    .then((datta)=>{
                        setComments(datta.data);
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            }
        }
        catch(err){
            console.log(err)
        }
    }


    useEffect(()=>{
        if(user){
            getBlogComments()
        }
      
    },[user])

    useEffect(()=>{
        socket.on("GetComments",()=>{
            getBlogComments()
        })
    },[])

    const backBtn = ()=>{
        window.location.href = '/home'
    }


  return (
    <>
    <div className='comment_entery'>
    <textarea onChange={getComment} className="textarea textarea_comment textarea-bordered" placeholder="Comment"></textarea>
    <div className='btn_comment' >
    <button onClick={btnClick} className="btn btn-xs  sm:btn-sm md:btn-md lg:btn-lg">Post</button>
    </div>
    <div className='btn_back_comment'>
    <button onClick={backBtn} className="btn btn-xs  sm:btn-sm md:btn-md lg:btn-lg">Back</button>
    </div>
    
    </div>
    <div className='comments_div'>
        {
            coments.map((element,index)=>(<Comment const data={element} key={index} />))
        }
    </div>
    </>
  )
}

export default Comments
