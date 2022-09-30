import React from 'react';
import './MessageBox.scss';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../../assets/img/avatar.jpg';
import { useAppDispatch } from '../../../services/hook';
import { setSelectedChat } from '../../../services/slices/notification';
import { getCurrentUser, timeAgo } from '../../../utils/helper';
import { IConversation } from '../../../container/Chat/Chat';

export interface IChatNotification {
   conversation: IConversation[];
   allUnseenMessages: number;
}

const MessageBox = (props: {
   extraClasses: string;
   chatNotification: IChatNotification;
}) => {
   const dispatch = useAppDispatch();

   const navigation = useNavigate();
   const onConversationClickHandler = (conversation: IConversation) => {
      dispatch(setSelectedChat(conversation));
      navigation('/chat');
   };
   return (
      <div className={`message_box ${props.extraClasses}`}>
         <div className={'message_box_top'}>
            <h4>Messages</h4>
            <div>
               <h4>Chat</h4>
            </div>
         </div>
         {props.chatNotification.conversation.length > 0 ? (
            <React.Fragment>
               {props.chatNotification.conversation.map((conversation: any) => (
                  <div
                     className={'message_box_item'}
                     key={conversation.id}
                     onClick={() => onConversationClickHandler(conversation)}
                  >
                     {conversation.sender_id == getCurrentUser().id ? (
                        <React.Fragment>
                           <img
                              width={50}
                              height={50}
                              alt={'avatar'}
                              src={
                                 conversation.receiver.image
                                    ? conversation.receiver.image.avatar
                                    : Avatar
                              }
                           />
                           <div className={'message_box_message'}>
                              <h5>{conversation.receiver.user_name}</h5>
                              <div>
                                 <p>{conversation.latest_message}</p>
                              </div>
                           </div>
                        </React.Fragment>
                     ) : (
                        <React.Fragment>
                           <img
                              width={50}
                              height={50}
                              alt={'avatar'}
                              src={
                                 conversation.sender.image
                                    ? conversation.sender.image.avatar
                                    : Avatar
                              }
                              className={'img-fluid'}
                           />
                           <div className={'message_box_message'}>
                              <h5>{conversation.sender.user_name}</h5>
                              <p>{conversation.latest_message}</p>
                           </div>
                        </React.Fragment>
                     )}
                    {/*<p className="badge" id={'unseen_badge'}>*/}
                    {/*  {conversation.unseen_count}*/}
                    {/*</p>*/}
                     <p>{timeAgo(conversation.updated_at)}</p>
                  </div>
               ))}
            </React.Fragment>
         ) : (
            <div className="text-center no_message">
               <p className={'m-0'}>No Conversation Found</p>
            </div>
         )}
         <p
            className={'text-center mt-3 view_all'}
            onClick={() => navigation('/chat')}
         >
            View All
         </p>
      </div>
   );
};

export default MessageBox;
