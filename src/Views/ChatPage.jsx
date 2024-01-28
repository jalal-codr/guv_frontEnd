import axios from 'axios'
import {useCookies} from 'react-cookie'
import React, { useEffect, useState } from 'react'
import Messages from '../Components/Messages';
import {socket} from '../sockets'
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "../FirebaseConfig"

function ChatPage() {
    const [messages,setMessages]= useState([])
    const [chatCookies,removeCookie] = useCookies(['chat']);
    const [user,setUser] = useState();
    const [text,setText] = useState('')


    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
      });
  
  
      // Clean up subscription on unmount
      return () => unsubscribe();
  }, []);

    const getMessages  = async()=>{
      try{
        if(user){
          const options = {
            method: "GET",
            url:"https://guv-n5s8.onrender.com/get-messages",
            headers: {
                accept: "application/json",
                authorization: `Bearer ${user.accessToken}`
            },
          };
          axios.request(options)
          .then((data)=>{
            setMessages(data.data)
          })
          .catch((err)=>{
            console.log(err)
          })
        }
        
      }
      catch(err){
        console.log(err)
      }
    }

    useEffect(()=>{
      socket.on('getMessages',(data)=>{
        getMessages();
      })

    },[socket])

    useEffect(()=>{
      if(user){
        socket.emit('joinRoom', chatCookies.chat.room)
        getMessages();
      }
     
    },[user])



    const backBtn = async()=>{
      try{
        removeCookie('chat')
        window.location.href='/chat'
      }
      catch(err){
        console.log(err)
      }
    }

    const changeTxt =(e)=>{
      setText(e.target.value)
    }
    const sendTxt =()=>{ 
        const newMsg = {
          from:user.email,
          to:chatCookies.chat.to,
          body:text
        }
        const options = {
          method: "POST",
          url:"https://guv-n5s8.onrender.com/new-message",
          headers: {
              accept: "application/json",
              authorization: `Bearer ${user.accessToken}`
          },
          data:newMsg,
        };
        axios.request(options)
        .then((data)=>{
          socket.emit("newMessage", chatCookies.chat.room )
        })
        .catch((err)=>{
          console.log(err)
        })
    }

  return (
    <>
    <div className='backChat'>
    <button onClick={backBtn} className="btn">chats</button>
    </div>
    <div className='message_box'>
    {
      messages.map((element,index)=>(<Messages const data = {element} key={index}/>))
    }
    </div>
    <textarea onChange={changeTxt} className="textarea chatin textarea-bordered" placeholder="Type here"></textarea>
    <div className='btn_send'>
    <button onClick={sendTxt} className="btn ">send</button>
    </div>
    </>
  )
}

export default ChatPage
