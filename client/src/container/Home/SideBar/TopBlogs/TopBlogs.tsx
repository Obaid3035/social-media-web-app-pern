import React from 'react';
import TopBlog from './TopBlog/TopBlog';
import { IBlog } from "../../../Blog/Blog";



const TopBlogs: React.FC<{
  blogs: IBlog[]
}> = ({ blogs }) => {
   return (
      <div className='top_blog'>
         <h4>Top Blogs</h4>
        {
          blogs.length > 0 ? (
              blogs.map((blog) => (
                <TopBlog key={blog.id} slug={blog.slug} title={blog.title} text={blog.text} />
              ))
          ) : (
            <div className="text-center">
              <p>No Blogs Found</p>
            </div>
          )
        }
      </div>
   );
};

export default TopBlogs;
