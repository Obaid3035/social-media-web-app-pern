import React from 'react'
import { FiSearch } from 'react-icons/fi'
import './Search.scss'

interface ISearch {
  search: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Search: React.FC<ISearch> = ({ search, onChange}) => {
  return (
    <div className='conversation_search'>
      <FiSearch/>
      <input name='chat' value={search} onChange={onChange} placeholder='Search...' className='search-inp'/>
    </div>
  )
}

export default Search
