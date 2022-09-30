import React from 'react';
import avatar from '../../../../assets/img/avatar.jpg';
import { getCurrentUser, timeAgo } from '../../../../utils/helper';
import './ConversationCard.scss';
import { IConversation } from '../../Chat';
import { useAppDispatch, useAppSelector } from '../../../../services/hook';
import { setSelectedChat } from '../../../../services/slices/notification';
import Avatar from "../../../../assets/img/avatar.jpg"

export interface IConversationCard {
   info: IConversation;
}

const ConversationCard: React.FC<IConversationCard> = ({ info }) => {
   const selectedChat = useAppSelector(
      (state) => state.notification.selectedChat
   );
   const dispatch = useAppDispatch();

   const getSelectedChatClass = () => {
      if (selectedChat) {
         if (selectedChat.id === info.id) {
            return '-selected';
         }
      }
      return '';
   };

   return (
      <div
         className={`card-container ${getSelectedChatClass()}`}
         onClick={() => {
            dispatch(setSelectedChat(info));
         }}
      >
         <img
            className="profile-pic"
            src={
               info.sender_id === getCurrentUser().id
                  ? info.receiver.image ? info.receiver.image.avatar : Avatar
                  : info.sender.image ? info.sender.image.avatar : Avatar
            }
            alt={'avatar'}
         />
         <div className="convo">
            <div className="convo-desc">
               <h6 className="convo-desc-name">
                  {info.sender_id === getCurrentUser().id
                     ? info.receiver.user_name
                     : info.sender.user_name}
               </h6>
            </div>
            <span className="convo-time">{timeAgo(info.updated_at)}</span>
         </div>
      </div>
   );
};

export default ConversationCard;
