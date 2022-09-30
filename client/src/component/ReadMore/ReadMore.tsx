import React, { useState } from "react";
import "./ReadMore.scss";

const ReadMore: React.FC<{ children: string, stringLimit: number}> = ({ children, stringLimit }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="text m-0">
      {children.length >= stringLimit && isReadMore ? text.slice(0, stringLimit) : text}
      <span onClick={toggleReadMore} className="read_or_hide">
        {children.length >= stringLimit ?
          isReadMore ? " read more" : " show less"
          : null}
      </span>
    </p>
  );
};

export default ReadMore;
