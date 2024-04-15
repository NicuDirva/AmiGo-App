import React from 'react'
import Navbar from '../Navbar'
import './Home.css'
import PostForm from '../PostForm'

const Home = () => {
  return (
    <div className='home-page'>
      <Navbar/>
      <h1>Home Page</h1>
      <PostForm/>
    </div>
  )
}

export default Home
