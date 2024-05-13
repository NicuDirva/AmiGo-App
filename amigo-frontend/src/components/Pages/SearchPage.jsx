import React from 'react'
import SearchBar from '../SearchResult'
import SearchResult from '../SearchResult'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import { useGlobalState } from '../state'

const SearchPage = () => {
  const { searchText } = useParams();
  const [defaultLoggin] = useGlobalState("loggin");
  return (
    <div>
        {defaultLoggin?
          <div>
          <Navbar/>
          <SearchResult searchText={searchText}/>
          </div>
        :
        <div>Nu esti conectat la cont</div>
        }
    </div>
  )
}

export default SearchPage
