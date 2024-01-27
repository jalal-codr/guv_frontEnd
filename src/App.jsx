import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import SignIn from './Views/SignIn'
import Home from './Views/Home'
import Profile from './Views/Profile'
import Chats from './Views/Chats'
import Notification from './Views/Notification'
import Ai from './Views/Ai'
import ChatPage from './Views/ChatPage'
import Comments from './Views/Comments'
function App() {
 


  return (
    
    <>
    <Routes>
      <Route path='/' element={<SignIn/>}/>
      <Route  path='/home' element={<Home/>} />
      <Route path='/profile' element={<Profile/>} />
      <Route path='/chat' element={<Chats/>}/>
      <Route path='/notifications' element={<Notification/>} />
      <Route path='/ai' element={<Ai/>} />
      <Route path='/chat-page' element={<ChatPage/>} />
      <Route path='/comments' element={<Comments/>} />
    </Routes>
    </>
  )
}

export default App
