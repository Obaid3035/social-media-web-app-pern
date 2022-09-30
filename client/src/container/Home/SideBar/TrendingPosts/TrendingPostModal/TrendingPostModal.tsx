import React, { useEffect, useState } from "react";
import SiteModal, { ISiteModal } from "../../../../../component/SiteModal/SiteModal";
import Posts from "../../../../../component/Posts/Posts";
import { getTrendingPosts } from "../../../../../services/api/post";
import Loader from "../../../../../component/Loader/Loader";
import "./TrendingPostModal.scss"

const TrendingPostModal: React.FC<ISiteModal> = ({ show, onModalChange }) => {
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<any>([]);
  const [postCount, setPostCount] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    getTrendingPosts(page)
      .then((res) => {
        setIsLoading(false);
        setPosts(res.data.posts);
        setPostCount(res.data.count)
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchMoreData = () => {
    console.log("HAS MORE")
    if (posts.length === postCount) {
      setHasMore(false);
      return;
    }

    getTrendingPosts(page + 1)
      .then((res) => {
        setPage(page + 1)
        setIsLoading(false);
        setPosts([...posts, ...res.data.posts]);
        setPostCount(res.data.count)
      })
      .catch(() => {
        setIsLoading(false);
      });
  };


  let renderPost;
  if (isLoading) {
    renderPost = <Loader />;
  }

  if (!isLoading) {
    if (posts && posts.length > 0) {
      renderPost = (
        <Posts
          scrollableId={'scrollableDiv-trending'}
          setPost={setPosts}
          hasMore={hasMore}
          mockData={posts}
          fetchMoreData={fetchMoreData}
        />
      );
    } else {
      renderPost = <h4 className={"text-center"}>No Post Found</h4>;
    }
  }

  return (
    <div>
      <SiteModal size={"lg"} show={show} onModalChange={onModalChange}>
        <div className={"activity_feed trending_modal"} id={'scrollableDiv-trending'}>
          { renderPost }
        </div>
      </SiteModal>
    </div>
  );
};

export default TrendingPostModal;
