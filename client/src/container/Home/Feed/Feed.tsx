import React, { useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Posts, { IPost } from "../../../component/Posts/Posts";
import Button from '../../../component/Button/Button';
import './Feed.scss';
import { createPost, getFeedPost } from '../../../services/api/post';
import Avatar from '../../../assets/img/avatar.jpg';
import { FiUpload } from 'react-icons/fi';
import { getCurrentUser } from '../../../utils/helper';
import FeedLoader from './FeedLoader/FeedLoader';

export interface IPostInput {
   text: string;
   image: File | null;
   imageUrl: string | null;
}

const Feed = () => {
   const [page, setPage] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
   const [hasMore, setHasMore] = useState(true);
   const [posts, setPosts] = useState<IPost[]>([]);
   const [postCount, setPostCount] = useState<number>(0);

   const [formInput, setFormInput] = useState<IPostInput>({
      text: '',
      image: null,
      imageUrl: null,
   });

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormInput({
         ...formInput,
         text: e.target.value,
      });
   };

   useEffect(() => {
      setIsLoading(true);
      getFeedPost(page)
         .then((res) => {
            setIsLoading(false);
            setPosts(res.data.posts);
            setPostCount(res.data.count);
         })
         .catch(() => {
            setIsLoading(false);
         });
   }, []);

   const fetchMoreData = () => {
      if (posts.length === postCount) {
         setHasMore(false);
         return;
      }

      getFeedPost(page + 1)
         .then((res) => {
            setPage(page + 1);
            setIsLoading(false);
            setPosts([...posts, ...res.data.posts]);
            setPostCount(res.data.count);
         })
         .catch(() => {
            setIsLoading(false);
         });
   };

   let renderPost;
   if (isLoading) {
      renderPost = <FeedLoader />;
   }

   if (!isLoading) {
      if (posts && posts.length > 0) {

         renderPost = (
            <Posts
              scrollableId={"scrollableDiv"}
               setPost={setPosts}
               hasMore={hasMore}
               mockData={posts}
               fetchMoreData={fetchMoreData}
            />
         );
      } else {
         renderPost = <h4 className={'text-center'}>No Post Found</h4>;
      }
   }

   const onPostCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const formData = new FormData();
         formData.append('text', formInput.text);
         formData.append('image', formInput.image!);
         const post = await createPost(formData);

         setPostCount(postCount + 1);

         if (postCount === 0) {
            setPosts([
               {
                  ...post.data,
               },
            ]);
         } else {
            setPosts([
               {
                  ...post.data,
               },
               ...posts,
            ]);
         }
         setFormInput({
            text: '',
            image: null,
            imageUrl: null,
         });
         setIsLoading(false);
      } catch (e) {
         setIsLoading(false);
      }
   };

   return (
      <Col md={7} className={'pl-5 feed_post'} id={'scrollableDiv'}>
         <div className={'create_post rounded_white_box mb-5'}>
            <img
               alt="avatar"
               height={50}
               width={50}
               src={
                  getCurrentUser().image
                     ? getCurrentUser().image.avatar
                     : Avatar
               }
            />
            <Form className={'create_post_form'} onSubmit={onPostCreate}>
               <Form.Control
                  type="text"
                  value={formInput.text}
                  required
                  onChange={onChangeHandler}
                  placeholder={'Write something in your mind……'}
               />
               <Button>Post</Button>
               <div className={'input_file mt-4'}>
                  <input
                     type="file"
                     id="file-input"
                     className="file_input"
                     onChange={(e) => {
                        setFormInput({
                           ...formInput,
                           image: e.target.files![0],
                           imageUrl: URL.createObjectURL(e.target.files![0]),
                        });
                     }}
                  />
                  <label className="file_label" htmlFor="file-input">
                     <FiUpload />
                     <span className={'mx-2'}>Add Photo</span>
                  </label>
               </div>
               {formInput.imageUrl ? (
                  <ul className={'image_preview'}>
                     <li>
                        <img
                           alt="post__img"
                           width={50}
                           height={50}
                           src={formInput.imageUrl}
                        />
                     </li>
                  </ul>
               ) : null}
            </Form>
         </div>
         <div className={'activity_feed'}>
            <h4 className={'mb-4'}>Activity Feed</h4>
            {renderPost}
         </div>
      </Col>
   );
};

export default Feed;
