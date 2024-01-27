import React, { useState } from 'react'
import {auth, provider } from "../FirebaseConfig"
import { signInWithPopup } from 'firebase/auth'
import {useCookies} from 'react-cookie'

function GoogleAuth() {
    const [cookies, setCookie,] = useCookies(['user']);


    const click =  async(e)=>{
        e.preventDefault();
        signInWithPopup(auth,provider)
        .then((res)=>{
             setCookie('user',{
                name : res.user.displayName,
                email:res.user.email,
                photo:res.user.photoURL
            })
            window.location.href = '/home'
            console.log(res.user.photoURL)
        })
    }

  return (
    <>
     <button  onClick={click} className="btn">SignIn with Google</button>
    </>
  )
}

export default GoogleAuth
