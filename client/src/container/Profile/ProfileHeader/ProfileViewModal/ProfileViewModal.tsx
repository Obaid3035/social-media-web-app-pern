import React, { useEffect } from "react";
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { AiFillHeart } from 'react-icons/ai';
import { BsFillFileEarmarkMinusFill } from 'react-icons/bs';
import Avatar from '../../../../assets/img/avatar.jpg';
import './ProfileViewModal.scss';

interface IProfileViewModal {
   show: boolean,
   onClose: () => void
}

const ProfileViewModal: React.FC<IProfileViewModal> = ({ show, onClose }) => {

   return (
      <Modal show={show} size={'lg'} className={'view_profile_image_modal'}>
         <Modal.Body>
            <Container fluid>
               <Row>
                  <Col md={5} className={'profile_col_left'}>
                     <img src={Avatar} alt='profile-img' />
                  </Col>
                  <Col md={7} className={'profile_col_right'}>
                     <p onClick={onClose} title='Close'>X</p>
                     <h2>Jen Smith</h2>

                     <div className={'user_profile_detail'}>
                        <p>02/02/2022</p>

                        <div className={'d-flex'}>
                           <div className={'profile_comment_count'}>
                              <AiFillHeart />
                              <p>120</p>
                           </div>

                           <div className={'profile_comment_count'}>
                              <BsFillFileEarmarkMinusFill />
                              <p>120</p>
                           </div>
                        </div>
                     </div>
                     <hr />

                     <div className={'show_all_answers'}>
                        <Container fluid className={'show_all_answers_container'}>
                           <Row className={'align-items-center'}>
                              <Col md={2} className={'show_all_answers_img'}>
                                 <img src={Avatar} alt={'avatar'} />
                              </Col>
                              <Col md={10} className={'show_all_answers_text'}>
                                 <h5>John Mayers <span> 5 Days ago</span></h5>
                                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet vestibulum
                                    ex,
                                    eget ultrices ex. Vestibulum ac velit in metus laoreet
                                    volutpat at id risus.</p>
                              </Col>
                              <hr />

                              <Col md={2} className={'show_all_answers_img'}>
                                 <img src={Avatar} alt={'i'} />
                              </Col>
                              <Col md={10} className={'show_all_answers_text'}>
                                 <h5>John Mayers <span> 5 Days ago</span></h5>
                                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Nunc sit amet vestibulum ex, eget ultrices ex. Vestibulum ac velit in metus laoreet
                                    volutpat at id risus.</p>
                              </Col>
                              <hr />
                           </Row>
                        </Container>
                     </div>

                     <div className={'user_profile_comment'}>
                        <img src={Avatar} alt={'avatar'} />
                        <Form className={'w-100'}>
                           <Form.Group className={'form_answer'}>
                              <Form.Control className='give_answer' type='text' placeholder='Write your Comment' />
                           </Form.Group>
                        </Form>
                     </div>
                  </Col>
               </Row>
            </Container>
         </Modal.Body>
      </Modal>
   );
};

export default ProfileViewModal;
