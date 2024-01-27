import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {useCookies} from 'react-cookie'
import ChatPage from '../Views/ChatPage';
import {socket} from '../sockets'
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from '../FirebaseConfig'


function Chat({data}) {
    const [cookies] = useCookies(['user']);
    const [Chatcookies,setCookie,] = useCookies(['chat']);
    const [user,setUser] = useState();
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    
    
        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);


    const btnClick=()=>{
        if(data.from==user.email){
            setCookie('chat',{
                to:data.to,
                room:data.room
            })
            window.location.href = '/chat-page'
        }else{
            setCookie('chat',{
                to:data.from,
                room:data.room
            })
            socket.emit('joinRoom', data.room)
            window.location.href = '/chat-page'
        }
    }

    const render = ()=>{
        if(data.from==user.email){
            return(<>
            <div className='chat_div1'>
            <div className="chat  chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={data.toImg} />
                    </div>
                </div>
                <button className='chat_name' onClick={btnClick}>
                <div className="chat-bubble">{data.to}</div>
                </button>
                </div>
            </div>

            </>)
        }
        else if(data.to == user.email){
            return(<>
            <div className='chat_div1' >
            <div className="chat chat_div chat-start">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" src={data.fromImg} />
                </div>
            </div>
                <button className='chat_name' onClick={btnClick}> 
                    <div className="chat-bubble">{data.from}</div>
                </button>
            </div>
            </div>

            </>)
        }
    }
  return (
    <>
    <div className='friens_cont'>
    {render()} 
    </div>
    </>
  )
}

export default Chat
