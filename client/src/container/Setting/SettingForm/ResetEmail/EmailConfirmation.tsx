import React, { FormEvent, useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import Button from '../../../../component/Button/Button';
import './EmailConfirmation.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { errorNotify, successNotify } from '../../../../utils/toast';
import Loader from '../../../../component/Loader/Loader';
import { authorizeUser, changeEmail } from '../../../../services/api/auth';
import { getCurrentUser, removeToken } from '../../../../utils/helper';
import { useAppSelector } from '../../../../services/hook';

const EmailConfirmation = () => {
   const navigation = useNavigate();
   const [email, setEmail] = React.useState('');
   const [confirmEmail, setConfirmEmail] = React.useState('');
   const [isLoading, setIsLoading] = React.useState(false);
   const socket = useAppSelector((state) => state.notification.socket);
   const { id } = useParams();

   useEffect(() => {
      authorizeUser(id!)
         .then(() => {})
         .catch((e) => {
            errorNotify('Not Authorize');
            navigation('/setting');
         });
   }, []);

   const onFormSubmit = (e: FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      if (email !== confirmEmail) {
         errorNotify('Email does not match');
         setIsLoading(false);
      } else {
         changeEmail(email, id!)
            .then(() => {
               successNotify('An Email changed successfully');
               socket.emit('delete', getCurrentUser());
               removeToken();
               navigation('/');
               setIsLoading(false);
            })
            .catch(() => {
               errorNotify('Something went wrong');
               setIsLoading(false);
            });
      }
   };

   return (
      <Form className={'setting_form'} onSubmit={onFormSubmit}>
         <Container>
            <Row className={'justify-content-center'}>
               <Col md={5} className={'email_card'}>
                  <h4>Change Email</h4>
                  <Form.Group>
                     <Form.Label>New Email</Form.Label>
                     <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </Form.Group>
                  <Form.Group className={'mt-3'}>
                     <Form.Label>Confirm New Email</Form.Label>
                     <Form.Control
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                     />
                  </Form.Group>
                  {!isLoading ? (
                     <Button className={'mt-3'} type={'submit'}>
                        Save
                     </Button>
                  ) : (
                     <Loader />
                  )}
               </Col>
            </Row>
         </Container>
      </Form>
   );
};

export default EmailConfirmation;
