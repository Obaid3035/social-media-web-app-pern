import React from 'react';
import { IPost } from './Posts';
import Avatar from '../../assets/img/avatar.jpg';
import VerifiedBadge from '../VerifiedBadge/VerifiedBadge';
import { getCurrentUser } from '../../utils/helper';
import { RiDeleteBin6Line } from 'react-icons/ri';
import ReadMore from '../ReadMore/ReadMore';
import * as AiIcon from 'react-icons/ai';
import * as MdIcon from 'react-icons/md';
import { Form } from 'react-bootstrap';
import Button from '../Button/Button';
import Comment from '../Comment/Comment';
import { useNavigate } from 'react-router-dom';


const Post: React.FC<{
   data: IPost;
   onPostClickHandler: (user_id: number, user_name: string) => void;
   onDeleteModalOpen: (postId: number) => void;
   onLikeHandler: (postId: number) => void;
   onCommentCreate: (e: React.FormEvent, postId: number) => void;
   onCommentDeleteHandler: (commentId: number, postId: number) => void;
   text: string;
   setText: any;
}> = ({
   data,
   onPostClickHandler,
   onDeleteModalOpen,
   onLikeHandler,
   onCommentCreate,
   onCommentDeleteHandler,
   text,
   setText,
}) => {
   const navigation = useNavigate();
   return (
      <div className={'activity_feed_post rounded_white_box mb-4'}>
         <div className={'activity_feed_user'}>
            <div
               className={'d-flex align-items-center'}
               onClick={() =>
                  onPostClickHandler(data.user.id, data.user.user_name)
               }
            >
               <img
                  alt={'avatar'}
                  loading="lazy"
                  width={50}
                  height={50}
                  src={data.user.image ? data.user.image.avatar : Avatar}
               />
               <div className={'activity_feed_user_info'}>
                  <h5>
                     {data.user.user_name}
                     {data.user.is_verified ? <VerifiedBadge /> : null}
                  </h5>
               </div>
            </div>
            {getCurrentUser().id == data.user.id ? (
               <RiDeleteBin6Line
                  onClick={() => onDeleteModalOpen(data.id)}
                  className={'delete'}
               />
            ) : null}
         </div>

         <div className={'activity_feed_description my-3'}>
            <ReadMore stringLimit={150}>{data.text}</ReadMore>
         </div>

         {data.image ? (
            <div className={'text-center post_img'}>
               <img width={1000} alt={'post'} src={data.image.avatar} />
            </div>
         ) : null}

         <div className={'d-flex mt-4 align-items-center post_stats'}>
            <AiIcon.AiFillHeart
               className={data.liked ? 'like_post_stats' : ''}
               onClick={() => onLikeHandler(data.id)}
            />
            <p className={'mx-2 p-0 m-0 text-muted'}>{data.like_count}</p>
            <MdIcon.MdModeComment className={'ml-4'} />
            <p className={'mx-2 p-0 m-0 text-muted'}>{data.comment_count}</p>
         </div>
         <div className={'post_comment'}>
            <div className={'comment_form'}>
               <img
                  width={50}
                  height={50}
                  loading="lazy"
                  alt={'avatar'}
                  className={'rounded_image'}
                  src={
                     getCurrentUser().image
                        ? getCurrentUser().image.avatar
                        : Avatar
                  }
               />
               <Form
                  className={'create_post_form'}
                  onSubmit={(e) => onCommentCreate(e, data.id)}
               >
                  <Form.Control
                     type="text"
                     name={`text${data.id}`}
                     required
                     value={text}
                     onChange={(e) => {
                        setText(e.target.value);
                     }}
                     placeholder={'Write your comment……'}
                  />
                  <Button type={'submit'}>Post</Button>
               </Form>
            </div>
            {data.comment.length > 0 ? (
               data.comment.map((comment) => (
                  <Comment
                     onCommentDeleteHandler={onCommentDeleteHandler}
                     postId={data.id}
                     id={comment.id!}
                     created_at={comment.created_at}
                     text={comment.text}
                     user={comment.user}
                  />
               ))
            ) : (
               <h4 className={'text-center'}>No Comment Found</h4>
            )}
            <div className="text-center">
               <Button
                  className={'view_all_btn'}
                  onClick={() => navigation(`/post-detail/${data.id}`)}
               >
                  View All <AiIcon.AiOutlineArrowDown />
               </Button>
            </div>
         </div>
      </div>
   );
};

export default React.memo(Post);
