import React, { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import './SideBar.scss';
import TrendingPosts from './TrendingPosts/TrendingPosts';
import TopBlogs from './TopBlogs/TopBlogs';
import TopAccounts from './TopAccounts/TopAccounts';
import { IPost } from '../../../component/Posts/Posts';
import { getFewTrendingPosts } from '../../../services/api/post';
import { getFewBlogs } from '../../../services/api/blog';
import { IBlog } from '../../Blog/Blog';
import { mostFollowedUser } from '../../../services/api/auth';
import SideLoader from "./SideLoader/SideLoader";

const SideBar = () => {
   const [isLoading, setIsLoading] = React.useState(false);
   const [trendingPost, setTrendingPost] = React.useState<IPost[]>([]);
   const [topAccounts, setTopAccounts] = React.useState([]);
   const [blogs, setBlogs] = React.useState<IBlog[]>([]);

   useEffect(() => {
      setIsLoading(true);

      async function fetchMyAPI() {
         const trendingPostPromise = getFewTrendingPosts();
         const fewBlogsPromise = getFewBlogs();
         const topFollowersPromise = mostFollowedUser();

         const [trendingPost, fewBlogs, topFollowers] = await Promise.all([
            trendingPostPromise,
            fewBlogsPromise,
            topFollowersPromise,
         ]);
         setTrendingPost(trendingPost.data);
         setTopAccounts(topFollowers.data);
         setBlogs(fewBlogs.data);
         setIsLoading(false);
      }

      fetchMyAPI();
   }, []);

   return (
      <Col md={3} className={'left_home_section rounded_white_box'}>
         {!isLoading ? (
            <React.Fragment>
               <TrendingPosts posts={trendingPost} setPosts={setTrendingPost} />
               <TopBlogs blogs={blogs} />
               <TopAccounts topAccounts={topAccounts} />
            </React.Fragment>
         ) : (
           <SideLoader/>
         )}
      </Col>
   );
};

export default SideBar;
