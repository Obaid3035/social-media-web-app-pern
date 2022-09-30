import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BlogItem } from "../PopularBlog/PopularBlog";
import { useNavigate } from "react-router-dom";


const FeaturedBlog: React.FC<BlogItem> = ({ blog }) => {
  const navigation = useNavigate();
   return (
      <React.Fragment>
         <h5>Recent Blogs</h5>
         {
            blog.length > 0 ?
              (
                blog.map((blog) => (
                  <div className={"popular_blog_wrapper"} key={blog.id} onClick={() => navigation(`/blog/${blog.slug}`)} >
                    <Container fluid>
                      <Row className={'popular_blogs_row'}>
                        <Col md={4} className={"text-center"}>
                          <img src={blog.feature_image.avatar} height={100} alt={'popular_blog'} />
                        </Col>
                        <Col md={8} className={'popular_blogs_text'}>
                          <p>{ blog.title }</p>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                ))
              ) : (
                <div className={"text-center"}>
                  <p className={"text-muted"}>No Blog Found</p>
                </div>
              )
         }
      </React.Fragment>
   );
};

export default FeaturedBlog;
