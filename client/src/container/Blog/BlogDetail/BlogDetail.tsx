import React, { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { AiFillClockCircle } from 'react-icons/ai';
import { BsArrowRightShort } from 'react-icons/bs';
import { useParams } from "react-router-dom";
import './BlogDetail.scss';
import { getBlogById } from "../../../services/api/blog";
import Loader from "../../../component/Loader/Loader";
import { timeAgo } from "../../../utils/helper";

export interface IBlog {
  id: number
  title: string,
  text: string,
  slug: string,
  feature_image: {
    avatar: string
  },
  created_at: string
}

const BlogDetail = () => {
   const { id } = useParams();
   const [blog, setBlog] = useState<IBlog | null>(null);
   const [recentBlogs, setRecentBlogs] = useState<IBlog[]>([])
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      setIsLoading(true)
      getBlogById(id!)
        .then((res) => {
           setBlog(res.data.blog);
          setRecentBlogs(res.data.recentBlogs);
           setIsLoading(false)
        })
   }, [])

   return (
      <Container fluid>
         <Row className={'justify-content-around'}>

            {
               !isLoading && blog ?
                 (
                   <React.Fragment>
                      <Col md={7} className={'blog_detail_left'}>
                         <img src={blog.feature_image.avatar} alt='blog-detail' />

                         <Row className='blog_detail_heading'>
                            <Col md={10}>
                              <h5>{ blog.title }</h5>
                            </Col>
                            <Col md={2}>
                              <p><AiFillClockCircle /> { timeAgo(blog.created_at) } </p>
                            </Col>
                         </Row>

                         <p dangerouslySetInnerHTML={{
                           __html: blog.text
                         }} />
                      </Col>

                      <Col md={4} className={'blog_detail_right'}>
                        {
                          recentBlogs.length > 0 ?
                            recentBlogs.map((blog) => (
                              <Row className={'blog_detail_right_details'} key={blog.id} onClick={() => window.location.href = `/blog/${blog.slug}`}>
                                <Col md={5} className={"p-0"} style={{
                                  backgroundImage: `url(${blog.feature_image.avatar})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center"
                                }}>
                                </Col>
                                <Col md={7}>
                                  <div className={'blog_detail_description'}>
                                    <h5> { blog.title.slice(0, 40) }... </h5>
                                    <div className={'blog_detail_right_time'}>
                                      <div className={"d-flex w-100 align-content-end justify-content-between"}>
                                        <p><AiFillClockCircle /> { timeAgo(blog.created_at)} </p>
                                        <BsArrowRightShort />
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            )) : (
                              <div className={"text-center"}>
                                <p className={"text-muted"}>No Blog Found</p>
                              </div>
                            )
                        }
                      </Col>
                   </React.Fragment>
                 ) : (
                   <div className="text-center">
                      <Loader />
                   </div>
                 )
            }
         </Row>
      </Container>
   );
};

export default BlogDetail;
