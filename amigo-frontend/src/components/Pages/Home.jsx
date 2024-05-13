import React from 'react'
import Navbar from '../Navbar'
import './Home.css'
import PostForm from '../PostForm'
import PostCardHome from '../card/PostCardHome'
import { useGlobalState } from '../state'

const Home = () => {
  const [defaultLoggin] = useGlobalState("loggin");

  return (
    <div className='home-page'>
      {defaultLoggin?
        <div>
          <Navbar/>
          <h1>Home Page</h1>
          <PostForm/>
          <PostCardHome/>
        </div>
        :
        <div>Nu esti conectat la cont</div>
      }
    </div>
  )
}

export default Home
