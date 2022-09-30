import React, { useEffect, useState } from 'react';
import { Container, Form, Nav, Navbar } from 'react-bootstrap';
import * as MdIcon from 'react-icons/md';
import * as AiIcon from 'react-icons/ai';
import * as BsIcon from 'react-icons/bs';
import * as RiIcon from 'react-icons/ri';
import * as IoIcon from 'react-icons/io5';
import BrandLogo from '../../assets/img/logo.png';
import MessageBox from './MessageBox/MessageBox';
import NavProfileBox from './NavProfileBox/NavProfileBox';
import SearchBar from './SearchBar/SearchBar';
import { NavLink, useLocation } from 'react-router-dom';
import NotificationBox from './NotificationBox/NotificationBox';
import Avatar from '../../assets/img/avatar.jpg';
import './Header.scss';
import { getCurrentUser } from '../../utils/helper';
import { useAppDispatch, useAppSelector } from '../../services/hook';
import {
   setChatNotification,
   setNotification,
} from '../../services/slices/notification';
import { getAllUnseenConversations } from '../../services/api/conversation';
import { getFewNotification } from '../../services/api/notification';
import SiteModal from '../SiteModal/SiteModal';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import { sendReport } from '../../services/api/auth';
import { errorNotify, successNotify } from '../../utils/toast';
import VerifiedBadge from '../VerifiedBadge/VerifiedBadge';

interface INavItem {
   path: string;
   title: string;
   icon: JSX.Element;
}

export interface IUser {
   id: number;
   user_name: string;
   image: {
      avatar: string;
      cloudinary_id: string;
   };
   is_verified: boolean;
}

enum MessageBoxClasses {
   MESSAGE_SHOW = 'message_show',
   MESSAGE_HIDE = 'message_hide',
}

enum NotificationBoxClasses {
   NOTIFICATION_SHOW = 'notification_show',
   NOTIFICATION_HIDE = 'notification_hide',
}

enum ProfileDropDownToggle {
   DROPDOWN_HIDE = 'profile_dropdown_hide',
   DROPDOWN_SHOW = 'profile_dropdown_show',
}

export enum NotificationStatus {
   Like = 'like',
   Comment = 'comment',
   Follow = 'follow',
}

export interface INotification {
   id: number;
   sender: IUser;
   receiver: IUser;
   seen: boolean;
   status: NotificationStatus;
   created_at: string;
   post_id: number;
}

const Header = () => {
   const [currentUser, setCurrentUser] = useState<IUser | null>(null);
   const dispatch = useAppDispatch();
   const notification = useAppSelector(
      (state) => state.notification.notification
   );
   const notificationCount = useAppSelector(
      (state) => state.notification.notificationCount
   );
   const [show, setShow] = useState(false);
   const [report, setReport] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      setCurrentUser(getCurrentUser());

      async function fetchMyAPI() {
         const chatNotificationPromise = getAllUnseenConversations();
         const notificationPromise = getFewNotification();

         const [chatNotification, notification] = await Promise.all([
            chatNotificationPromise,
            notificationPromise,
         ]);
         dispatch(setChatNotification(chatNotification.data));
         dispatch(setNotification(notification.data));
      }

      fetchMyAPI();

      getAllUnseenConversations().then((res) => {
         dispatch(setChatNotification(res.data));
      });
   }, []);

   const chatNotification = useAppSelector(
      (state) => state.notification.chatNotification
   );

   const navItems: INavItem[] = [
      {
         path: '/home',
         title: 'Home',
         icon: <AiIcon.AiOutlineHome />,
      },
      {
         path: '/calorie-tracker',
         title: 'Calorie Tracker',
         icon: <MdIcon.MdOutlineFastfood />,
      },
      {
         path: '/blog',
         title: 'Blogs',
         icon: <BsIcon.BsBook />,
      },
      {
         path: '/queries',
         title: 'Q&A',
         icon: <IoIcon.IoRocketOutline />,
      },
   ];

   const [notificationClasses, setNotificationClasses] = useState(
      NotificationBoxClasses.NOTIFICATION_HIDE
   );
   const [messageClasses, setMessageClasses] = useState(
      MessageBoxClasses.MESSAGE_HIDE
   );

   const [profileDropdownClasses, setProfileDropdownClasses] = useState(
      ProfileDropDownToggle.DROPDOWN_HIDE
   );

   const location = useLocation();

   const onMessageClickHandler = () => {
      if (messageClasses === MessageBoxClasses.MESSAGE_SHOW) {
         setMessageClasses(MessageBoxClasses.MESSAGE_HIDE);
      } else {
         setMessageClasses(MessageBoxClasses.MESSAGE_SHOW);
         setNotificationClasses(NotificationBoxClasses.NOTIFICATION_HIDE);
         setProfileDropdownClasses(ProfileDropDownToggle.DROPDOWN_HIDE);
      }
   };

   const onNotificationClickHandler = () => {
      if (notificationClasses === NotificationBoxClasses.NOTIFICATION_SHOW) {
         setNotificationClasses(NotificationBoxClasses.NOTIFICATION_HIDE);
      } else {
         setNotificationClasses(NotificationBoxClasses.NOTIFICATION_SHOW);
         setMessageClasses(MessageBoxClasses.MESSAGE_HIDE);
         setProfileDropdownClasses(ProfileDropDownToggle.DROPDOWN_HIDE);
      }
   };

   const onDropdownClickHandler = () => {
      if (profileDropdownClasses === ProfileDropDownToggle.DROPDOWN_SHOW) {
         setProfileDropdownClasses(ProfileDropDownToggle.DROPDOWN_HIDE);
      } else {
         setProfileDropdownClasses(ProfileDropDownToggle.DROPDOWN_SHOW);
         setMessageClasses(MessageBoxClasses.MESSAGE_HIDE);
         setNotificationClasses(NotificationBoxClasses.NOTIFICATION_HIDE);
      }
   };

   const getActiveClass = (path: string) => {
      if (path === location.pathname) {
         return 'nav_active';
      }
      return '';
   };

   const ref = React.useRef(null);

   useEffect(() => {
      function handleClickOutside(event: any) {
         // @ts-ignore
         if (ref.current && !ref.current.contains(event.target)) {
            setNotificationClasses(NotificationBoxClasses.NOTIFICATION_HIDE);
            setProfileDropdownClasses(ProfileDropDownToggle.DROPDOWN_HIDE);
            setMessageClasses(MessageBoxClasses.MESSAGE_HIDE);
         }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [ref]);

   const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      sendReport(report)
         .then((res) => {
            setIsLoading(false);
            setShow(!show);
            successNotify(res.data.message);
         })
         .catch(() => {
            setIsLoading(false);
            errorNotify('Something went wrong');
         });
   };

   const modal = (
      <SiteModal show={show} onModalChange={() => setShow(!show)}>
         <Form onSubmit={onFormSubmit}>
            <Form.Group>
               <Form.Control
                  as="textarea"
                  required
                  placeholder={'Have feedback? We’d love to hear it.'}
                  value={report}
                  onChange={(e) => setReport(e.target.value)}
               />
               {!isLoading ? (
                  <Button className={'mt-3'}>Send</Button>
               ) : (
                  <Loader />
               )}
            </Form.Group>
         </Form>
      </SiteModal>
   );

   return (
      <Navbar bg="light" expand="md" className={'mb-5'}>
         {modal}
         <Navbar.Brand href="#home" className={'p-0 m-0 ml-3'}>
            <NavLink to={'/home'}>
               <img
                  className={'img-fluid'}
                  width={40}
                  alt="brand"
                  src={BrandLogo}
               />
            </NavLink>
         </Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse>
            <Nav className="w-100">
               <Container
                  ref={ref}
                  fluid
                  className={
                     'w-100 d-flex justify-content-around align-items-center'
                  }
               >
                  {navItems.map((navItem, index) => (
                     <NavLink
                        key={index}
                        to={navItem.path}
                        className={`${getActiveClass(navItem.path)} nav_link`}
                     >
                        <div className={'nav_icon'}>{navItem.icon}</div>
                        <p className={'nav_item'}>{navItem.title}</p>
                     </NavLink>
                  ))}

                  <SearchBar />

                  <Nav.Link className={'notify_item'}>
                     <div
                        className={'notification_icon'}
                        onClick={onMessageClickHandler}
                     >
                        <BsIcon.BsChat />
                        <span className={'badge'}>
                           {chatNotification.allUnseenMessages}
                        </span>
                     </div>
                     <MessageBox
                        chatNotification={chatNotification}
                        extraClasses={messageClasses}
                     />
                  </Nav.Link>

                  <Nav.Link className={'notify_item'}>
                     <div
                        className="notification_icon"
                        onClick={onNotificationClickHandler}
                     >
                        <RiIcon.RiNotification3Line />
                        <span className={'badge'}>{notificationCount}</span>
                     </div>
                     <NotificationBox
                        notification={notification}
                        extraClasses={notificationClasses}
                     />
                  </Nav.Link>
                  <div className={'nav_link'} onClick={onDropdownClickHandler}>
                     <div className={'nav_profile'}>
                        <p>{currentUser?.user_name}</p>
                        {currentUser?.is_verified ? <VerifiedBadge /> : null}
                        <RiIcon.RiArrowDropDownLine />
                        <img
                           width={50}
                           height={50}
                           alt={'avatar'}
                           src={
                              getCurrentUser().image
                                 ? getCurrentUser().image.avatar
                                 : Avatar
                           }
                           className={'ml-2'}
                        />
                     </div>
                     <NavProfileBox
                        show={show}
                        setShow={setShow}
                        extraClasses={profileDropdownClasses}
                     />
                  </div>
               </Container>
            </Nav>
         </Navbar.Collapse>
      </Navbar>
   );
};

export default Header;
