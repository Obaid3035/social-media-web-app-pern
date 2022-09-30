import React from 'react';
import Slider from 'react-slick';
import TrendingPost from './TrendingPost/TrendingPost';
import TrendingPostModal from './TrendingPostModal/TrendingPostModal';
import './TrendingPosts.scss';
import { likePost } from '../../../../services/api/post';
import { errorNotify } from '../../../../utils/toast';
import { IPost } from '../../../../component/Posts/Posts';
import { useAppSelector } from '../../../../services/hook';

interface ITrendingPost {
   posts: IPost[];
   setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

const TrendingPosts: React.FC<ITrendingPost> = ({ posts, setPosts }) => {
   const socket = useAppSelector((state) => state.notification.socket);
   const [show, setShow] = React.useState(false);
   const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
   };

   const onLikeHandler = async (postId: number) => {
      try {
         const post = posts.concat();
         const likedPost = post.findIndex((post) => post.id === postId);
         post[likedPost].liked = !post[likedPost].liked;
         post[likedPost].liked
            ? (post[likedPost].like_count += 1)
            : (post[likedPost].like_count -= 1);
         setPosts(post);
         const liked = await likePost(postId);
         socket.emit('send notification', liked.data.notification);
      } catch (e) {
         errorNotify('Something went wrong');
      }
   };

   return (
      <div className={'most_liked_post'}>
         {show ? (
            <TrendingPostModal
               show={show}
               onModalChange={() => setShow(!show)}
            />
         ) : null}
         <h4>Trending</h4>
         {posts.length > 0 ? (
           // @ts-ignore
            <Slider {...settings} className={'mt-4'}>
               {posts.map((post) => (
                  <TrendingPost
                     key={post.id}
                     onLikeHandler={onLikeHandler}
                     post={post}
                     onModalChange={() => setShow(!show)}
                  />
               ))}
            </Slider>
         ) : (
            <div className="text-center">
               <p>No Post Found</p>
            </div>
         )}
      </div>
   );
};

export default TrendingPosts;
