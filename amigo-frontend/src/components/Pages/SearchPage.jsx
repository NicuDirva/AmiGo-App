import React from 'react'
import SearchBar from '../SearchResult'
import SearchResult from '../SearchResult'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import { useGlobalState } from '../state'
import styles from './css/SearchPage.module.css'

const SearchPage = () => {
  const { searchText } = useParams();
  const [defaultLoggin] = useGlobalState("loggin");
  return (
    <div>
        {defaultLoggin?
          <div>
          <Navbar/>
          <div className={styles.container}>
            <SearchResult searchText={searchText}/>
          </div>
          </div>
        :
        <div>
          <Navbar/>
          <p>You are not connected!</p>
        </div>
        }
    </div>
  )
}

export default SearchPage
