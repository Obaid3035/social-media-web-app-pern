import React, { useEffect, useState } from 'react';
import Avatar from '../../../assets/img/avatar.jpg';
import Button from '../../../component/Button/Button';
import './FollowerModal.scss';
import SiteModal from '../../../component/SiteModal/SiteModal';
import axios from 'axios';
import { getTokenFormat } from '../../../utils/helper';
import Loader from '../../../component/Loader/Loader';
import { IUser } from "../../../component/Header/Header";
import { deleteFriendship } from '../../../services/api/friendShip';
import { useNavigate } from "react-router-dom";
import { ENDPOINT } from "../ProfileHeader/ProfileHeader";

export interface IFollowerModal {
   show: boolean;
   onChange: () => void;
   endPoint: string;
   otherProfileId?: string
}

export interface IFriendShip {
   id: number;
   sender_id: number;
   receiver_id: number;
   sender: IUser;
   receiver: IUser;
   status: string;
}

const FollowerModal: React.FC<IFollowerModal> = ({
   show,
   onChange,
   endPoint,
  otherProfileId
}) => {
   const [isLoading, setIsLoading] = useState(false);
   const [data, setData] = useState<IFriendShip[]>([]);
   const navigation = useNavigate();
   useEffect(() => {
      setIsLoading(true);
      if (otherProfileId) {
         axios.get(`/friendship/${endPoint}/${otherProfileId}`, getTokenFormat()).then((res) => {
            setIsLoading(false);
            setData(res.data);
         });
      } else {
         axios.get(`/friendship/${endPoint}`, getTokenFormat()).then((res) => {
            setIsLoading(false);
            setData(res.data);
         });
      }
   }, []);

   const onUnFollowHandler = (friendshipId: number) => {
      setIsLoading(true);
      deleteFriendship(friendshipId).then((res) => {
         const dataClone = data.concat();
         const foundIndex = dataClone.findIndex(
            (friendship) => friendship.id === friendshipId
         );
         dataClone.splice(foundIndex, 1);
         setData(dataClone);
         setIsLoading(false);
      });
   };

   return (
      <SiteModal show={show} onModalChange={onChange}>
         {!isLoading ? (
            data.length > 0 ? (
               data.map((friendship) => {
                  console.log(friendship)
                  return (
                     <React.Fragment key={friendship.id}>
                        <div className="following_modal">
                           <div className={'following_details'}>
                              <img
                                 src={
                                    friendship.receiver &&
                                    friendship.receiver.image
                                       ?  friendship.receiver.image.avatar
                                       : friendship.sender && friendship.sender.image ?
                                      friendship.sender.image.avatar : Avatar
                                 }
                                 alt="Avatar"
                              />

                              {
                                 endPoint === ENDPOINT.FOLLOWING ?
                                   <p onClick={() => window.location.href =`/${friendship.receiver.user_name}` }>
                                      { friendship.receiver.user_name}
                                   </p>
                                   : <p onClick={() =>  window.location.href =`/${friendship.sender.user_name}`} >
                                      { friendship.sender.user_name }
                                   </p>
                              }
                           </div>
                           {/*<Button*/}
                           {/*   className={'w-25 py-1'}*/}
                           {/*   onClick={() => onUnFollowHandler(friendship.id)}*/}
                           {/*>*/}
                           {/*   unfollow*/}
                           {/*</Button>*/}
                        </div>
                        <hr />
                     </React.Fragment>
                  );
               })
            ) : (
               <div className={'text-center'}>
                  <p>No User Found</p>
               </div>
            )
         ) : (
            <div className={'text-center'}>
               <Loader />
            </div>
         )}
      </SiteModal>
   );
};

export default FollowerModal;
