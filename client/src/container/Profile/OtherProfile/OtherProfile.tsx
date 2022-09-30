import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Button from '../../../component/Button/Button';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfilePost from '../ProfilePost/ProfilePost';
import { useParams, useNavigate } from 'react-router-dom';
import { BsFillChatFill } from 'react-icons/bs';
import './OtherProfile.scss';
import NotFriend from '../NotFriend/NotFriend';
import { otherProfile, otherProfilePost } from '../../../services/api/post';
import {
   sendFollowRequest,
   unFollowRequest,
} from '../../../services/api/friendShip';
import { getCurrentUser } from "../../../utils/helper";
import { createConversation } from "../../../services/api/conversation";
import { errorNotify, successNotify } from "../../../utils/toast";
import { useAppSelector } from "../../../services/hook";
import Loader from "../../../component/Loader/Loader";
import { getHelmet } from "../../../utils/helmet";

enum FriendShipStatus {
   view = 'VIEW',
   accept = 'ACCEPT',
   send = 'SEND',
}

const OtherProfile = () => {
   const { id } = useParams();
   const socket = useAppSelector((state) => state.notification.socket)
   const navigation = useNavigate();
   useEffect(() => {
      if (id == getCurrentUser().id) {
         navigation("/profile");
      }
   }, [])

   const [userStats, setUserStats] = useState<any>({
      currentUserFollowers: 0,
      currentUserFollowings: 0,
      currentUserPostCount: 0,
      user: null,
   });
   const [page, setPage] = useState(0);
   const [size, setSize] = useState(3);
   const [hasMore, setHasMore] = useState(true);
   const [posts, setPosts] = useState<any>([]);
   const [postCount, setPostCount] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
   const [friendShip, setFriendShip] = useState(false);

   useEffect(() => {
      if (getCurrentUser().user_name == id) window.location.href = '/profile'
   }, [])

   useEffect(() => {
      setIsLoading(true);
      otherProfile(id!).then((res) => {
         setIsLoading(false);
         setUserStats({
            currentUserPostCount: res.data.postCount,
            currentUserFollowings: res.data.followingCount,
            currentUserFollowers: res.data.followersCount,
            user: res.data.user,
         });
      });
   }, []);

   useEffect(() => {
      otherProfilePost(id!, page, size).then((res) => {
         setFriendShip(res.data.friendship);
         if (res.data.friendship) {
            setPosts(res.data.posts);
            setPostCount(res.data.count);
         }
      });
   }, [friendShip]);

   const unfollowHandler = () => {
      unFollowRequest(id!).then((res) => {
         setFriendShip(res.data.friendship);
         setUserStats({
            ...userStats,
            currentUserFollowers: userStats.currentUserFollowers - 1,
         });
      });
   };
   const followHandler = () => {
      sendFollowRequest(id!).then((res) => {
         setFriendShip(res.data.friendShip);
         setUserStats({
            ...userStats,
            currentUserFollowers: userStats.currentUserFollowers + 1,
         });
         socket.emit("send notification", res.data.notification)
      });
   };

   const fetchMoreData = () => {
      if (posts.length === postCount) {
         setHasMore(false);
         return;
      }

      otherProfilePost(id!, page + 1, size).then((res) => {
         setPage(page + 1);
         setPosts([...posts, ...res.data.posts]);
         setPostCount(res.data.count);
      })
   };

   let data;
   let unFollowBtn: any;

   if (!friendShip) {
      data = <NotFriend onClick={followHandler} />;
      unFollowBtn = null;
   }

   const onCreateConversation = async () => {
      try {
         const res = await createConversation(id!)
         successNotify(res.data.message)
         navigation("/chat")
      } catch (e: any) {
         errorNotify(e.response.data.message);
      }

   }

   if (friendShip && posts) {
      unFollowBtn = (
         <div className={'mt-3 unfollow_btn'}>
            <Button className={'mr-2'} onClick={() => onCreateConversation()}>
               <BsFillChatFill />
               <span>Message</span>
            </Button>
            <Button onClick={unfollowHandler} className={'ml-2'}>
               <span>UnFollow</span>
            </Button>
         </div>
      );

      data = (
        <ProfilePost
          posts={posts}
          fetchMoreData={fetchMoreData}
          setPost={setPosts}
          hasMore={hasMore}
        />
      );
   }

   return (
      <Container>
         { getHelmet(id!) }
         {!isLoading && userStats.user ? (
            <Row
               className={
                  'mx-4 my-3 other_profile justify-content-center align-items-center'
               }
            >
               <Col md={8} className={'profile_header text-center py-4 mb-5'}>
                  <ProfileHeader userStats={userStats} otherProfileId={id} />
                  {unFollowBtn}
               </Col>
               {data}
            </Row>
         ) : <Loader/>}
      </Container>
   );
};

export default OtherProfile;
