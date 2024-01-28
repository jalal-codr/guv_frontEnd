import React, { useState,useEffect } from 'react'
import {useCookies} from 'react-cookie'
import {onAuthStateChanged} from "firebase/auth"
import{auth} from '../FirebaseConfig'

function Nav() {
    const [cookies] = useCookies(['user']);
    const [person,setPerson] = useState();

    const click = ()=>{
      window.location.href="/notifications"
    }

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setPerson(currentUser);
      });
  
  
      // Clean up subscription on unmount
      return () => unsubscribe();
  }, []);


    const render =  ()=>{
      if(person){
        return(
          <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a href='home'>Home</a></li>
                <li><a href='/chat' >Chat</a></li>
                <li><a>AI</a></li>
              </ul>
            </div>
            <a className="btn btn-ghost normal-case text-xl">Hi {person.displayName}</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><a href='home'>Home</a></li>
              <li><a href='/chat'>Chat</a></li>
              <li><a>AI</a></li>
            </ul>
          </div>
          <div className="navbar-end">
          <button onClick={click} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div>
          <div className="w-10 rounded-full">
            <a href='/profile' >
            <img className='img_' src={person.photoURL} />
            </a>
                </div>
        </div>
        )
      }
    }
  return (
    <>
    {
      render()
    }
    </>
  )
}

export default Nav
