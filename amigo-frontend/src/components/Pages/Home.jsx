import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import './css/Home.css'
import PostForm from '../forms/PostForm'
import PostCardHome from '../card/PostCardHome'
import { useGlobalState } from '../state'
import Recommandation from '../Recommandation'
import Auth from '../auth/Auth'
import PostCard from '../card/PostCard'

const Home = () => {
  const [defaultLoggin] = useGlobalState("loggin");
  const [ userAvatar, setUserAvatar] = useState(null);
  const [defaultEmail] = useGlobalState("email");

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    const currentId = await Auth.getIdByEmail(defaultEmail);
    const avatar = await PostCard.getAvatarProfileById(currentId);
    setUserAvatar(avatar);
  }

  return (
    <div className='home-page'>
      {defaultLoggin ?
        <div>
          <Navbar />
          <Recommandation.Recommandation/>
          <div className='homeContainer'>
            <PostForm userAvatar={userAvatar}/>
            <PostCardHome />
          </div>
        </div>
        :
        <div>
          <Navbar />
          <p>You are not connected!</p>
        </div>
      }
    </div>
  )
}

export default Home
