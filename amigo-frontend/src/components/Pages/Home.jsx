import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import './Home.css'
import PostForm from '../PostForm'
import PostCardHome from '../card/PostCardHome'
import { useGlobalState } from '../state'
import Recommandation from '../Recommandation'
import Auth from '../auth/Auth'

const Home = () => {
  const [defaultLoggin] = useGlobalState("loggin");
  const [defaultEmail] = useGlobalState("email");

  useEffect(() => {
  }, [])

  return (
    <div className='home-page'>
      {defaultLoggin ?
        <div>
          <Navbar />
          <h1>Home Page</h1>
          <Recommandation.Recommandation/>
          <PostForm />
          <PostCardHome />
        </div>
        :
        <div>
          <Navbar />
          Nu esti conectat la cont
        </div>
      }
    </div>
  )
}

export default Home
