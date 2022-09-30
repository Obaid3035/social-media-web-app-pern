import React from 'react';
import Avatar from '../../../assets/img/avatar.jpg';
import './NotificationBox.scss';
import { INotification, NotificationStatus } from '../Header';
import { timeAgo } from '../../../utils/helper';
import { updateNotification } from '../../../services/api/notification';
import { useNavigate } from 'react-router-dom';

export const getNotificationText = (status: string) => {
   switch (status) {
      case NotificationStatus.Like:
         return 'liked your post';
      case NotificationStatus.Comment:
         return 'comment on your post';
      case NotificationStatus.Follow:
         return 'has followed you';
   }
};

export const onNavigateNotification = (
  status: string,
  senderUserName: string,
  navigationId: number,
  notificationId: number
) => {
   updateNotification(notificationId).then(() => {
      if (
        status == NotificationStatus.Like ||
        status == NotificationStatus.Comment
      ) {
         window.location.href = `/post-detail/${navigationId}`;
      } else {
         window.location.href = `/${senderUserName}`;
      }
   });
};

const NotificationBox = (props: {
   notification: INotification[];
   extraClasses: string;
}) => {
   const navigation = useNavigate();

   return (
      <div className={`notification_box ${props.extraClasses}`}>
         <h4>Notification</h4>
         {props.notification.length > 0 ? (
            <React.Fragment>
               {props.notification.map((notification) => (
                  <div
                     className={'notification_box_item'}
                     key={notification.id}
                     onClick={() =>
                        onNavigateNotification(
                           notification.status,
                           notification.sender.user_name,
                           notification.post_id,
                           notification.id
                        )
                     }
                  >
                     <img
                        width={50}
                        height={50}
                        alt={'avatar'}
                        src={
                           notification.sender.image
                              ? notification.sender.image.avatar
                              : Avatar
                        }
                     />
                     <div className={'notification_box_message'}>
                        <span>
                           <h3 className={'mr-1'}>
                              {notification.sender.user_name}
                           </h3>{' '}
                           {getNotificationText(notification.status)}
                        </span>
                        <p className={'mt-1'}>
                           {timeAgo(notification.created_at)}
                        </p>
                     </div>
                  </div>
               ))}
               <p
                  onClick={() => window.location.href = '/notification'}
                  className={'text-center mt-3 view_all'}
               >
                  View All
               </p>
            </React.Fragment>
         ) : (
            <div className="text-center">
               <p className={'m-0 no_notification'}>No Notification Found</p>
               <p
                 onClick={() => window.location.href = '/notification'}
                 className={'text-center mt-3 view_all'}
               >
                  View All
               </p>
            </div>
         )}
      </div>
   );
};

export default NotificationBox;
