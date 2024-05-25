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
          <h1>Home Page</h1>
          <Recommandation.Recommandation/>
          <PostForm userAvatar={userAvatar}/>
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
