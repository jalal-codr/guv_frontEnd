import axios from 'axios'
import {useCookies} from 'react-cookie'
import React, { useEffect, useState } from 'react'
import Messages from '../Components/Messages';
import {socket} from '../sockets'
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "../FirebaseConfig"

function ChatPage() {
    const [messages,setMessages]= useState([])
    const [cookies] = useCookies(['user']);
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
        const url = "https://guv-n5s8.onrender.com/get-messages"
        axios.get(url)
        .then((data)=>{
          setMessages(data.data)
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
      socket.on('getMessages',(data)=>{
        getMessages();
      })

    },[socket])

    useEffect(()=>{
      socket.emit('joinRoom', chatCookies.chat.room)
      getMessages();
     
    },[])



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
        const url ='https://guv-n5s8.onrender.com/new-message'
        axios.post(url,newMsg)
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
