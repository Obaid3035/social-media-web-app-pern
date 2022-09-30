import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Button from '../../../../component/Button/Button';
import { errorNotify, successNotify } from "../../../../utils/toast";
import Loader from "../../../../component/Loader/Loader";
import { verifyEmail } from "../../../../services/api/auth";

const ResetEmail = () => {
   const [email, setEmail] = React.useState('');
   const [isLoading, setIsLoading] = React.useState(false)
   const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true)
      verifyEmail(email)
        .then(() => {
           successNotify('An Email has been sent to you with instructions')
           setIsLoading(false)
        })
        .catch(() => {
           errorNotify('Something went wrong')
           setIsLoading(false)
        })

   }
   return (
      <Form className={'setting_form'} onSubmit={onFormSubmit}>
         <Row>
            <Col md={7}>
               <Form.Group>
                  <Form.Label>Current Email</Form.Label>
                  <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
               </Form.Group>
            </Col>
            <Col md={12} className={'mt-4 text-left setting_btn'}>
               {
                  !isLoading ?  <Button type={'submit'}>Verify</Button>
                    : <Loader/>
               }
            </Col>
         </Row>
      </Form>
   );
};

export default ResetEmail;
