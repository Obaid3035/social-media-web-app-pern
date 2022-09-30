import React, { useEffect, useState } from 'react';
import * as MdIcon from 'react-icons/md';
import * as AiIcon from 'react-icons/ai';
import { Button, Container, Form } from 'react-bootstrap';
import Avatar from '../../../assets/img/avatar.jpg';
import { useParams } from 'react-router-dom';
import './PostDetail.scss';
import {
   createComment, deleteComment,
   getPostById,
   likePost
} from "../../../services/api/post";
import Loader from '../../Loader/Loader';
import Comment from '../../Comment/Comment';
import { IPost } from "../Posts";
import { errorNotify } from '../../../utils/toast';
import { getCurrentUser } from "../../../utils/helper";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAppSelector } from "../../../services/hook";

const PostDetail = () => {

   const { id } = useParams();
   const socket = useAppSelector((state) => state.notification.socket)
   const [isLoading, setIsLoading] = useState(false);
   const [post, setPost] = useState<IPost | null>(null);
   const [text, setText] = useState('');

   useEffect(() => {
      setIsLoading(false);
      getPostById(id!).then((res) => {
         setIsLoading(true);
         setPost(res.data);
      });
   }, []);

   const onLikeHandler = async (postId: number) => {
      if (post) {
         try {
            const postClone = {
               ...post,
            };
            postClone.liked = !postClone.liked;

            if (postClone.liked) {
               postClone.like_count += 1;
            } else {
               postClone.like_count -= 1;
            }
            setPost(postClone);
            const liked = await likePost(postId);
            socket.emit("send notification", liked.data.notification)
         } catch (e) {
            errorNotify('Something went wrong');
         }
      }
   };

   const onCommentCreate = async (e: React.FormEvent, postId: number) => {
      e.preventDefault();
      if (post) {
         try {
            const postClone: any = {
               ...post,
            };
            const comment = await createComment({ text }, postId);

            postClone.comment.push(comment.data.comment);
            postClone.comment_count+=1

            setPost(postClone);
            setText('');
            socket.emit("send notification", comment.data.notification)
         } catch (e) {
            errorNotify('Something went wrong');
         }
      }
   };

   const onCommentDeleteHandler = async (commentId: number) => {
      if (post) {
         const postClone = {
            ...post
         }
         await deleteComment(commentId)
         const comment = postClone.comment.findIndex(
           (comment) => comment.id === commentId
         );
         post.comment.splice(comment, 1);
         setPost(post)
         // await deleteComment(commentId)
      }
   };

   return (
      <Container>
         {isLoading && post ? (
            <div className={'activity_feed'}>
               <div className={'activity_feed_post rounded_white_box'}>
                  <div className={'activity_feed_user'}>
                     <div className="d-flex align-items-center">
                        <img
                          alt={'avatar'}
                          width={50}
                          height={50}
                          src={post.user.image ? post.user.image.avatar : Avatar}
                        />
                        <div className={'activity_feed_user_info'}>
                           <h5>{post.user.user_name}</h5>
                        </div>
                     </div>
                     {
                        getCurrentUser().id == post.user.id ? (
                          <RiDeleteBin6Line
                            className={'delete'}
                          />
                        ) : null
                     }
                  </div>

                  <div className={'activity_feed_description'}>
                     <p>{post.text}</p>
                  </div>

                  {post.image ? (
                     <div className={'post_detail_img'}>
                        <img alt={'post'} src={post.image.avatar} />
                     </div>
                  ) : null}

                  <div className={'d-flex mt-4 align-items-center post_stats'}>
                     <AiIcon.AiFillHeart
                        className={post.liked ? 'like_post_stats' : ''}
                        onClick={() => onLikeHandler(post?.id)}
                     />
                     <p className={'mx-2 p-0 m-0 text-muted'}>
                        {post.like_count}
                     </p>
                     <MdIcon.MdModeComment className={'ml-4'} />
                     <p className={'mx-2 p-0 m-0 text-muted'}>
                        {post.comment_count}
                     </p>
                  </div>
                  <div className={'post_comment'}>
                     <div className={'comment_form'}>
                        <Form
                           className={'create_post_form'}
                           onSubmit={(e) => onCommentCreate(e, post?.id)}
                        >
                           <Form.Control
                              type="text"
                              value={text}
                              required
                              onChange={(e) => setText(e.target.value)}
                              placeholder={'Write your comment……'}
                           />
                           <Button type={'submit'}>Post</Button>
                        </Form>
                     </div>
                     {post.comment.length > 0 ? (
                        post.comment.map((comment) => (
                           <Comment
                             id={comment.id}
                             onCommentDeleteHandler={onCommentDeleteHandler}
                             postId={parseInt(id!)}
                             created_at={comment.created_at}
                             text={comment.text}
                             user={comment.user} />
                        ))
                     ) : (
                        <h4 className={'text-center'}>No Comment Found</h4>
                     )}
                  </div>
               </div>
            </div>
         ) : (
            <Loader />
         )}
      </Container>
   );
};

export default PostDetail;
