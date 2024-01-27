import axios from 'axios'
import {useCookies} from 'react-cookie'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import {onAuthStateChanged} from 'firebase/auth'
import{auth} from "../FirebaseConfig"

function Messages({data}) {
    const [cookies] = useCookies(['user']);
    const [user,setUser] = useState()
    const [chatCookies] = useCookies(['chat']);
    const data1 = {
        to:chatCookies.chat.to
      }

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    
    
        // Clean up subscription on unmount
        return () => unsubscribe();
    }, []);


    const renderMessages=()=>{
        if(data.to==data1.to||data.from==data1.to){
            if(data.from==user.email){
                return(<>
                    <div className="chat chat-end">
                    <div className="chat-bubble">{data.body}</div>
                    <div className="chat-footer opacity-50">
                    <time className="text-xs opacity-50">{moment(data.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</time>
                    </div>
                    </div>
                </>)
            }
            else if(data.to==user.email){
                return(<>
                        <div className="chat chat-start">
                        <div className="chat-image avatar">
                        </div>
                        <div className="chat-header">
                        </div>
                        <div className="chat-bubble">{data.body}</div>
                        <div className="chat-footer opacity-50">
                        <time className="text-xs opacity-50">{moment(data.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</time>
                        </div>
                        </div>

                </>)
            }
        }
      }
  return (
    <>
    {
        renderMessages()
    }
    </>
  )
}

export default Messages
