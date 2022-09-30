import React from 'react';
import PostImg from '../../../../../assets/img/trending_post.png';
import * as AiIcon from 'react-icons/ai';
import * as MdIcon from 'react-icons/md';
import { IPost } from "../../../../../component/Posts/Posts";
import ReadMore from "../../../../../component/ReadMore/ReadMore";

interface ITrendingPost {
   onModalChange: () => void;
   post: IPost,
   onLikeHandler: (postId: number) => void
}

const TrendingPost: React.FC<ITrendingPost> = ({ onModalChange, post, onLikeHandler }) => {
   return (
      <div className={'carousel_item px-3'}>
         <span className={'carousel_image_wrapper'}>
            <img alt={'img'} src={post.image && post.image.avatar ? post.image.avatar : PostImg} />
         </span>
         <div className={'carousel_content'} onClick={onModalChange}>
            <AiIcon.AiTwotoneCrown />
            <h4 className={'mt-1'}>{ post.user.user_name }</h4>
            <p onClick={onModalChange}>
               <ReadMore stringLimit={50}>
                  { post.text }
               </ReadMore>
            </p>
            <div className={'most_liked_post_comment'}>
               <div className={'d-flex align-items-center'}>
                  <AiIcon.AiFillHeart   className={post.liked ? 'like_post_stats' : ''}
                                        onClick={() => onLikeHandler(post.id)} />
                  <p className={'m-0 ml-2'}>{ post.like_count }</p>
               </div>
               <div className={'d-flex ml-4 align-items-center'} onClick={onModalChange}>
                  <MdIcon.MdModeComment />
                  <p className={'m-0 ml-2'}>{ post.comment_count }</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TrendingPost;
