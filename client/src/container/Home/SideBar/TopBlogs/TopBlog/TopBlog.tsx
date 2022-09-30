import React from 'react';
import './TopBlog.scss';
import Button from '../../../../../component/Button/Button';

interface ITopBlog {
  slug: string,
  title: string,
  text: string
}
const TopBlog: React.FC<ITopBlog> = ({ slug, title, text}) => {
   return (
       <div className={"mt-4"}>
         <h5>{title}</h5>
       <Button onClick={() => window.location.href = `/blog/${slug}`}>Read More</Button>
      </div>
   );
};

export default TopBlog;
