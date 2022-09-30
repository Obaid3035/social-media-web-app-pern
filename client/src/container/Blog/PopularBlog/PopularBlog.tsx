import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { IBlog } from "../Blog";
import { timeAgo } from "../../../utils/helper";

export interface BlogItem {
   blog: IBlog[]
}

const PopularBlog: React.FC<BlogItem> = ({blog}) => {
   const navigation = useNavigate();

   function checkBlogLength() {
     if (blog.length === 1) return 1
     if (blog.length === 2) return 2
     if (blog.length === 3) return 3
     return  4
   }

   const settings = {
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: checkBlogLength(),
      slidesToScroll: 1,
     responsive: [
       {
         breakpoint: 1024,
         settings: {
           slidesToShow: 2,
           slidesToScroll: 2,
           infinite: true,
           dots: true
         }
       },
       {
         breakpoint: 600,
         settings: {
           slidesToShow: 2,
           slidesToScroll: 2,
           initialSlide: 2
         }
       },
       {
         breakpoint: 540,
         settings: {
           slidesToShow: 1,
           slidesToScroll: 1,
         }
       },
       {
         breakpoint: 480,
         settings: {
           slidesToShow: 1,
           slidesToScroll: 2,
         }
       },
     ]
   };

   return (
      <React.Fragment>
         <div className={'blogs_heading'}>
            <h5>Popular Blogs</h5>
         </div>
        {
          blog.length > 0 ?
            (
              // @ts-ignore
              <Slider {...settings} className={'mt-4 blog_slider'}>
                {
                  blog.map((blog) => (
                    <div className={'blog_detail text-center'} key={blog.id} onClick={() => navigation(`/blog/${blog.slug}`)} >
                      <img src={blog.feature_image.avatar} alt={'blog-img'} onClick={() => navigation(`/blog/${blog.slug}`)} />
                      <hr className={'w-50 mt-3 mb-3 hr_tag'} />
                      <h5>{ blog.title }</h5>
                    </div>
                  ))
                }
              </Slider>
            ) : (
              <div className={"text-center"}>
                <p className={"text-muted"}>No Blog Found</p>
              </div>
            )
        }
      </React.Fragment>
   );
};

export default PopularBlog;
