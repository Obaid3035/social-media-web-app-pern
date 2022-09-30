import React from "react";
import './SideLoader.scss';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SideLoader = () => {
  return (
    <div className={'mx-3'}>
      <div>
        <Skeleton width={120}/>
        <Skeleton height={350}  className={'mt-3'}/>
        <div className={'d-flex justify-content-center mt-4'}>
          <Skeleton width={15} height={15} circle={true}/>
          <Skeleton width={15} height={15} circle={true} className={'mx-3'}/>
          <Skeleton width={15} height={15} circle={true}/>
        </div>
      </div>
      <div>
        <Skeleton width={120} className={'mt-5'}/>
        <Skeleton  className={'mt-3'}/>
        <Skeleton/>
        <Skeleton width={100} />
      </div>
      <div>
        <Skeleton width={120} className={'mt-5'}/>
        <Skeleton  className={'mt-3'}/>
        <Skeleton/>
        <Skeleton width={100} />
      </div>
      <div>
        <Skeleton width={120} className={'mt-5'}/>
        <Skeleton  className={'mt-3'}/>
        <Skeleton/>
        <Skeleton width={100} />
      </div>

      <div>
        <Skeleton width={120} className={'mt-5'}/>
        <div className={'d-flex justify-content-center mt-4'}>
          <div className={'text-center'}>
            <Skeleton width={60} height={60} circle={true}/>
            <Skeleton width={60} className={'mt-3'} />
          </div>
          <div className={'text-center mx-3'}>
            <Skeleton width={60} height={60} circle={true}/>
            <Skeleton width={60} className={'mt-3'} />
          </div>
          <div className={'text-center'}>
            <Skeleton width={60} height={60} circle={true}/>
            <Skeleton width={60} className={'mt-3'} />
          </div>
          <div className={'text-center ml-3'}>
            <Skeleton width={60} height={60} circle={true}/>
            <Skeleton width={60} className={'mt-3'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideLoader;
