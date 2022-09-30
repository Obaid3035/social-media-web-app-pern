import React, {useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai"
import { BsFillBookmarkFill } from "react-icons/bs"
import Logo from "../../../assets/img/logo.png"
import './SideBar.scss'

const SideBar = () => {

  const location = useLocation();
  const [sideBar, setSideBar] = useState(false)
  const showSideBar = () => setSideBar(!sideBar);

  const onLogOutHandler = () => {
    localStorage.clear();
    window.location.reload();
  }

  const classes = (path: string) => {
    if (path === location.pathname) {
      return 'nav_active'
    }
    return ''
  }

  return (
    <div className={sideBar ? 'sidebar sidebar_active' : 'sidebar'}>
      <div className={'logo_content'}>
        <div className={'profile'}>
          <img alt={'profile'} src={Logo}/>
          <p className={'mb-0'}>Carerely</p>
        </div>
        <FaIcons.FaBars className={'fa-bars'} onClick={showSideBar} />
      </div>
      <ul className="nav_list p-0">
        <li className={`${classes("/admin/blogs")}`}>
          <div>
            <Link to={"/admin/blogs"}>
              <BsFillBookmarkFill />
              <span>Blog</span>
            </Link>
          </div>
        </li>

        <li className={`${classes("/admin/users")}`}>
          <div>
            <Link to={"/admin/users"}>
              <AiOutlineUser />
              <span>Users</span>
            </Link>
          </div>
        </li>

        <li className="logout_btn" onClick={onLogOutHandler}>
          <Link to={'#'}>
            <FiIcons.FiLogOut />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
