import React from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const FeedLoader = () => {
  return (
    <div className={'rounded_white_box'}>
      <div className={'mx-3'} >
        <div className={'d-flex align-items-center'}>
          <Skeleton circle={true} width={60} height={60}/>
          <Skeleton width={80} className={'mx-3'} />
        </div>
        <div>
          <Skeleton className={'mt-3'} />
          <Skeleton className={'mt-3'} />
          <Skeleton width={80} className={'mt-3'} />
        </div>

        <Skeleton height={450} className={'mt-3'} />
      </div>
      <div className={'mx-3 mt-5'} >
        <div className={'d-flex align-items-center'}>
          <Skeleton circle={true} width={60} height={60}/>
          <Skeleton width={80} className={'mx-3'} />
        </div>
        <div>
          <Skeleton className={'mt-3'} />
          <Skeleton className={'mt-3'} />
          <Skeleton width={80} className={'mt-3'} />
        </div>
        <Skeleton height={450} className={'mt-3'} />
      </div>
    </div>
  );
};

export default FeedLoader;
