import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './Notification.scss';

import Avatar from '../../assets/img/avatar.jpg';
import { INotification } from '../../component/Header/Header';
import { timeAgo } from '../../utils/helper';
import { getNotificationText, onNavigateNotification } from "../../component/Header/NotificationBox/NotificationBox";
import Loader from '../../component/Loader/Loader';
import { getNotification } from "../../services/api/notification";
import { errorNotify } from "../../utils/toast";
import { getHelmet } from "../../utils/helmet";


const Notification = () => {
   const [notification, setNotification] = React.useState<INotification[]>([]);

   const [isLoading, setIsLoading] = React.useState(false);


   useEffect(() => {
      setIsLoading(true);
      getNotification()
         .then((res) => {
            setIsLoading(false);
            setNotification(res.data);
         })
         .catch(() => {
            setIsLoading(false);
            errorNotify('Something went wrong');
         });
   }, []);


   return (
      <Container fluid>
         { getHelmet('Notification') }
         <div className="notification_wrapper">
            <div className="recent_notifications_container">
               <h5>RECENT NOTIFICATIONS</h5>
               {/*{notification.length > 0 && <button onClick={onMarkAllRead}>Mark All As Read</button>}*/}
            </div>
            <hr />
            {!isLoading ? (
               notification.length > 0 ? (
                  notification.map((data) => {
                     const { id, sender, created_at, status, post_id } = data;
                     return (
                        <Row key={id}>
                           <Col md={12}>
                              <div className="notifications_list" onClick={() => onNavigateNotification(status, sender.user_name, post_id, id)}>
                                 <div className="user_profile_container">
                                    <div className="round_img">
                                       <img
                                          alt={sender.user_name}
                                          src={
                                             sender.image
                                                ? sender.image.avatar
                                                : Avatar
                                          }
                                       />
                                    </div>
                                    <div className="notification_text">
                                       <div className="d-flex">
                                          <h3>{sender.user_name}</h3>
                                          <p>{timeAgo(created_at)}</p>
                                       </div>
                                       <p>{getNotificationText(status)}</p>
                                    </div>
                                 </div>
                              </div>
                           </Col>
                        </Row>
                     );
                  })
               ) : (
                  <p className={'text-center'}>No Notification Found</p>
               )
            ) : (
               <Loader />
            )}
         </div>
      </Container>
   );
};
export default Notification;
