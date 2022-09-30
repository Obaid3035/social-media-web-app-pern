import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import './Posts.scss';
import { IUser } from '../Header/Header';
import Loader from '../Loader/Loader';
import {
   createComment,
   deleteComment,
   deletePost,
   likePost,
} from '../../services/api/post';
import { errorNotify, successNotify } from '../../utils/toast';
import { IComment } from '../Comment/Comment';
import { getCurrentUser } from '../../utils/helper';
import { useAppSelector } from '../../services/hook';
import DeletePopUp from '../DeletePopUp/DeletePopUp';
import Post from './Post';

interface IPostPropsInterface {
   hasMore: boolean;
   mockData: IPost[];
   fetchMoreData: () => void;
   setPost: React.Dispatch<React.SetStateAction<IPost[]>>;
   scrollableId?: string
}

export interface IPost {
   id: number;
   user: IUser;
   image: {
      avatar: string;
   };
   text: string;
   like_count: number;
   comment_count: number;
   liked: boolean;
   comment: IComment[] | [];
}

const Posts = (props: IPostPropsInterface) => {

   const navigation = useNavigate();
   const socket = useAppSelector((state) => state.notification.socket);
   const [text, setText] = useState('');
   const [show, setShow] = useState(false);
   const [postId, setPostId] = useState<number | null>(null);

   const onPostClickHandler = (user_id: number, user_name: string) => {
      const currUser: IUser = getCurrentUser();
      if (currUser.id === user_id) {
         navigation(`/profile`);
      } else {
         navigation(`/${user_name}`);
      }
   };

   const onLikeHandler = async (postId: number) => {
      try {
         const post = props.mockData.concat();
         const likedPost = post.findIndex((post) => post.id === postId);
         post[likedPost].liked = !post[likedPost].liked;
         if (post[likedPost].liked) {
            post[likedPost].like_count += 1;
         } else {
            post[likedPost].like_count -= 1;
         }
         props.setPost(post);
         const liked = await likePost(postId);
         socket.emit('send notification', liked.data.notification);
      } catch (e) {
         errorNotify('Something went wrong');
      }
   };

   const onCommentDeleteHandler = async (commentId: number, postId: number) => {
      const post = props.mockData.concat();
      await deleteComment(commentId);
      const commentedPost = post.findIndex((post) => post.id === postId);
      const comment = post[commentedPost].comment.findIndex(
         (comment) => comment.id === commentId
      );
      post[commentedPost].comment.splice(comment, 1);
      props.setPost(post);
   };

   const onCommentCreate = async (e: React.FormEvent, postId: number) => {
      e.preventDefault();
      try {
         const post: any = props.mockData.concat();
         const comment = await createComment({ text }, postId);
         const commentedPost: any = post.findIndex(
            (post: any) => post.id === postId
         );
         if (post[commentedPost].comment.length >= 2) {
            post[commentedPost].comment.pop();
         }
         post[commentedPost].comment.unshift(comment.data.comment);
         post[commentedPost].comment_count += 1;

         props.setPost(post);
         setText('');
         socket.emit('send notification', comment.data.notification);
      } catch (e) {
         errorNotify('Something went wrong');
      }
   };

   const onPostDeleteHandler = async () => {
      const post: any = props.mockData.concat();
      await deletePost(postId!);
      const foundIndex = post.findIndex((post: any) => post.id === postId);
      post.splice(foundIndex, 1);
      props.setPost(post);
      setShow(!show);
      successNotify('Post deleted successfully!');
   };

   const onDeleteModalOpen = (postId: number) => {
      setPostId(postId);
      setShow(!show);
   };

   return (
      <InfiniteScroll
         next={props.fetchMoreData}
         hasMore={props.hasMore}
         endMessage={
            <h4 className={'text-center my-3'}>Yay! You have seen it all</h4>
         }
         loader={
            <div className="text-center">
               <Loader />
            </div>
         }
         dataLength={props.mockData.length}
         scrollThreshold={'800px'}
         scrollableTarget={props.scrollableId}
      >
         <DeletePopUp
            show={show}
            onClose={() => setShow(!show)}
            onDelete={onPostDeleteHandler}
         />
         {props.mockData.map((data: IPost) => (
            <Post
               text={text}
               setText={setText}
               onPostClickHandler={onPostClickHandler}
               onCommentCreate={onCommentCreate}
               onCommentDeleteHandler={onCommentDeleteHandler}
               onDeleteModalOpen={onDeleteModalOpen}
               onLikeHandler={onLikeHandler}
               key={data.id}
               data={data}
            />
         ))}
      </InfiniteScroll>
   );
};
export default React.memo(Posts);
