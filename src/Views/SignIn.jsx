import React from 'react'
import GoogleAuth from '../Components/GoogleAuth'

function SignIn() {

  return (
    <>
        <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">Welcome to Guv  a minimalist google chat application,please SignIn to continue</p>
          <div className='btn1-signin'>
            <GoogleAuth/>
            </div>
        </div>
      </div>
    </div>

    </>
  )
}

export default SignIn
