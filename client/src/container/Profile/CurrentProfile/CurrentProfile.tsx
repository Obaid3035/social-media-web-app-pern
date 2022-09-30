import React, { useEffect, useState } from 'react';
import ProfilePost from '../ProfilePost/ProfilePost';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Button from '../../../component/Button/Button';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import { createPost, currentUserPost, currentUserStats } from "../../../services/api/post";
import Loader from '../../../component/Loader/Loader';
import { IPostInput } from "../../Home/Feed/Feed";
import { FiUpload } from "react-icons/fi";
import { getHelmet } from "../../../utils/helmet";

const CurrentProfile = () => {
   const [page, setPage] = useState(0);
   const [size, setSize] = useState(3);
   const [hasMore, setHasMore] = useState(true);
   const [posts, setPosts] = useState<any>([]);
   const [postCount, setPostCount] = useState(0);
   const [userStats, setUserStats] = useState<any>({
      currentUserFollowers: 0,
      currentUserFollowings: 0,
      currentUserPostCount: 0,
      user: null,
   });
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      setIsLoading(true);
      const getUserProfile = async () => {
         const userPromise = currentUserStats();
         const postPromise = currentUserPost(page, size);

         const [user, post] = await Promise.all([userPromise, postPromise]);
         setUserStats({
            currentUserPostCount: user.data.postCount,
            currentUserFollowings: user.data.followingCount,
            currentUserFollowers: user.data.followersCount,
            user: user.data.user,
         });
         setPosts(post.data.posts);
         setPostCount(post.data.count);
         setIsLoading(false);
      };

      getUserProfile().then(() => {});
   }, []);

   const fetchMoreData = () => {
      if (posts.length === postCount) {
         setHasMore(false);
         return;
      }

      currentUserPost(page + 1, size)
         .then((res) => {
            setPage(page + 1);
            setPosts([...posts, ...res.data.posts]);
            setPostCount(res.data.count);
         })
   };

   const [formInput, setFormInput] = useState<IPostInput>({
      text: "",
      image: null,
      imageUrl: null
   })

   const onPostCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true)
      try {
         const formData = new FormData();
         formData.append("text", formInput.text)
         formData.append("image", formInput.image!)
         const post = await createPost(formData);
         setPosts([
            post.data,
            ...posts
         ])
         setUserStats({
            ...userStats,
            currentUserPostCount: userStats.currentUserPostCount + 1,
         });
         setPostCount(postCount + 1)
         setFormInput({
            text: "",
            image: null,
            imageUrl: null
         })
         setIsLoading(false)
      } catch (e) {
         setIsLoading(false)
      }
   }

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormInput({
         ...formInput,
         text: e.target.value,
      })
   }
   return (
      <Container>
         { getHelmet('Profile') }
         {!isLoading && userStats.user ? (
            <Row
               className={'mx-4 my-3 justify-content-center align-items-center'}
            >
               <Col md={8} className={'profile_header text-center py-4'}>
                  <ProfileHeader userStats={userStats} />
               </Col>

               <React.Fragment>
                  <div className={'current_profile_form'}>
                     <Form className={'create_post_form text-center row'} onSubmit={onPostCreate}>
                        <div className="col-md-12">
                           <Form.Control
                             type="text"
                             onChange={onChangeHandler}
                             placeholder={'Write something in your mind……'}
                           />
                           <Button>Post</Button>
                        </div>

                        <div className={'input_file mt-4'}>
                           <input
                             type="file"
                             id="file-input"
                             className="file_input"
                             onChange={(e) => {
                                setFormInput({
                                   ...formInput,
                                   image: e.target.files![0],
                                   imageUrl: URL.createObjectURL(e.target.files![0])
                                })
                             }}
                           />
                           <label className="file_label" htmlFor="file-input">
                              <FiUpload />
                              <span className={"mx-2"}>Add Photo</span>
                           </label
                           >
                        </div>
                        {
                           formInput.imageUrl ?
                             (
                               <ul className={"image_preview"}>
                                  <li><img alt="post__img" src={formInput.imageUrl}/></li>
                               </ul>
                             ) : null
                        }
                     </Form>
                  </div>
                  {
                     posts ? (
                       <ProfilePost
                         setPost={setPosts}
                         posts={posts}
                         hasMore={hasMore}
                         fetchMoreData={fetchMoreData}
                       />
                     ) : null
                  }
               </React.Fragment>
            </Row>
         ) : <Loader />}
      </Container>
   );
};

export default CurrentProfile;
