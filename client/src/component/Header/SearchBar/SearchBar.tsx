import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import * as BiIcon from 'react-icons/bi';
import Avatar from '../../../assets/img/avatar.jpg';
import './SearchBar.scss';
import Button from '../../Button/Button';
import Loader from '../../Loader/Loader';
import axios from 'axios';
import { IUser } from "../Header";

const SearchBar = () => {
   const [query, setQuery] = React.useState('');
   const [hideSearchBar, setHideSearchBar] = React.useState(
      'search_results hide_search_results'
   );
   const onSearchChangeHandler = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      setQuery(event.target.value);
      setHideSearchBar('search_results');
   };
   const [user, setUser] = useState<IUser[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const ref = React.useRef(null);

   useEffect(() => {
      function handleClickOutside(event: any) {
         // @ts-ignore
         if (ref.current && !ref.current.contains(event.target)) {
            setHideSearchBar('search_results hide_search_results');
         }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [ref]);
   const searchRecords = () => {
      setIsLoading(true);
      axios.get(`/auth/users?search=${query}`).then((response) => {
         setIsLoading(false);
         setUser(response.data);
      });
   };

   let data: any = (
      <div className={'text-center'}>
         <Loader />
      </div>
   );

   if (!isLoading) {
      if (user.length > 0) {
         data = user.map((filteredUsers) => (
            <div className={'search_users'} key={filteredUsers.id} onClick={() => window.location.href = `/${filteredUsers.user_name}`}>
               <img
                 width={50}
                 height={50}
                 alt={'avatar'}
                 src={filteredUsers.image ? filteredUsers.image.avatar : Avatar}
                 className={'ml-2'}
               />
               <p>{filteredUsers.user_name} </p>
            </div>
         ));
      } else {
         data = <p className={'text-center my-0'}>No Result Found</p>;
      }
   }
   return (
      <div ref={ref} className={'search'}>
         <Form className={'search_form'}>
            <Form.Control
               type="text"
               onKeyUp={searchRecords}
               placeholder={'Search For Contact'}
               onChange={onSearchChangeHandler}
            />
            <Button>
               <BiIcon.BiSearchAlt2 />
            </Button>
         </Form>
         <div className={hideSearchBar + ' animate__animated animate__zoomIn'}>
            {data}
         </div>
      </div>
   );
};

export default SearchBar;
