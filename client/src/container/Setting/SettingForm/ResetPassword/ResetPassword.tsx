import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Button from '../../../../component/Button/Button';
import { errorNotify, successNotify } from "../../../../utils/toast";
import Loader from '../../../../component/Loader/Loader';
import { changePassword } from '../../../../services/api/auth';
import { getCurrentUser, removeToken } from '../../../../utils/helper';
import { useAppSelector } from '../../../../services/hook';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
   const navigation = useNavigate();
   const [oldPassword, setOldPassword] = React.useState('');
   const [newPassword, setNewPassword] = React.useState('');
   const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
   const [isLoading, setIsLoading] = React.useState(false);
   const socket = useAppSelector((state) => state.notification.socket);

   const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      if (newPassword !== confirmNewPassword) {
         errorNotify('confirm password does not match');
         setIsLoading(false);
      } else {
         changePassword(oldPassword, newPassword)
            .then((res) => {
               successNotify('Password changed successfully')
               socket.emit('delete', getCurrentUser());
               removeToken();
               navigation('/');
               setIsLoading(false);
            })
            .catch((err) => {
               errorNotify(err.response.data.message)
               setIsLoading(false);
            });
      }
   };

   return (
      <Form className={'setting_form'} onSubmit={onFormSubmit}>
         <Row>
            <Col md={7}>
               <Form.Group>
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder={'Enter your password'}
                     value={oldPassword}
                     onChange={(e) => setOldPassword(e.target.value)}
                  />
               </Form.Group>
            </Col>
            <Col md={7}>
               <Form.Group className={'mt-3'}>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder={'Enter your new Password'}
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                  />
               </Form.Group>
            </Col>
            <Col md={7}>
               <Form.Group className={'mt-3'}>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder={'Enter confirm Password'}
                     value={confirmNewPassword}
                     onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
               </Form.Group>
            </Col>
            <Col md={12} className={'mt-4 text-left setting_btn'}>
               {!isLoading ? <Button>Submit</Button> : <Loader />}
            </Col>
         </Row>
      </Form>
   );
};

export default ResetPassword;
