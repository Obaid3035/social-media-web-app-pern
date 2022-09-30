import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Modal, Row } from 'react-bootstrap';
import Avatar from '../../../assets/img/avatar.jpg';
import { BsFillFileEarmarkMinusFill } from 'react-icons/bs';
import './QueriesModal.scss';
import { createAnswers, getAnswers } from '../../../services/api/queries';
import { IQueries } from '../Queries';
import Loader from '../../../component/Loader/Loader';
import { AiFillPlusSquare } from 'react-icons/ai';
import VerifiedBadge from "../../../component/VerifiedBadge/VerifiedBadge";
import { getCurrentUser, timeAgo } from "../../../utils/helper";
import SiteModal from "../../../component/SiteModal/SiteModal";
import { NavLink } from "react-router-dom";

interface IQueriesModal {
   show: boolean;
   onClose: () => void;
   query: IQueries;
   queries: IQueries[];
   setQuery: React.Dispatch<React.SetStateAction<any>>;
   setQueries: React.Dispatch<React.SetStateAction<any>>;
}

const QueriesModal: React.FC<IQueriesModal> = ({
   show,
   onClose,
   query,
   setQuery,
   setQueries,
   queries,
}) => {
   const [answer, setAnswer] = useState<IQueries[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [answerInput, setAnswerInput] = useState('');

   useEffect(() => {
      setIsLoading(true);
      getAnswers(query.id).then((res) => {
         setAnswer(res.data);
         setIsLoading(false);
      });
   }, []);

   const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      createAnswers(query.id, answerInput).then((res) => {
         const answerClone = answer.concat();
         answerClone.push({
            ...res.data,
         });
         setAnswer(answerClone);
         setQuery({
            ...query,
            answerCount: query.answerCount + 1,
         });
         const queriesClone = queries.concat();
         const foundIndex = queriesClone.findIndex(
            (queries) => queries.id === query.id
         );
         if (foundIndex) {
            queriesClone[foundIndex].answerCount =
               queriesClone[foundIndex].answerCount + 1;
         }
         setQueries(queriesClone);

         setIsLoading(false);
         setAnswerInput('');
      });
   };

   return (
      <SiteModal size={'lg'} show={show} onModalChange={onClose}>
         <Modal.Body className={'query_modal'}>
            <div className={'answer_modal'}>
               <img
                 width={50}
                 height={50}
                 alt={'avatar'}
                 src={query.user.image ? query.user.image.avatar : Avatar}
                 className={'ml-2'}
               />
               <p>
                  Posted By:    <NavLink to={`/${query.user.user_name}`} className={'ml-1'}>
                  {query.user.user_name}
               </NavLink>
               </p>
            </div>
            <div className={'modal_question mt-3'}>
               <p>{query.text}</p>
               <div className={'answer_count'}>
                  <BsFillFileEarmarkMinusFill />
                  <p>{query.answerCount}</p>
               </div>
            </div>
            {!isLoading ? (
              <React.Fragment>
                 <div>
                    <Form onSubmit={onFormSubmit}>
                       <Form.Group className={'form_answer'}>
                          <Form.Control
                            className="give_answer"
                            value={answerInput}
                            required
                            onChange={(e) => setAnswerInput(e.target.value)}
                            type="text"
                            placeholder="Write your Comment"
                          />
                          <button type={'submit'}>
                             <AiFillPlusSquare />
                          </button>
                       </Form.Group>
                    </Form>
                 </div>

                 <div className={'show_all_answers'}>
                    <Container fluid className={'show_all_answers_container'}>
                       <Row className={'align-items-center'}>
                          {answer.map((answer) => (
                            <React.Fragment key={answer.id}>
                               <Col md={1} className={'show_all_answers_img'}>
                                  <img
                                    src={
                                       answer.user.image
                                         ? answer.user.image.avatar
                                         : Avatar
                                    }
                                    alt={'i'}
                                  />
                               </Col>
                               <Col
                                 md={11}
                                 className={'show_all_answers_text'}
                               >
                                  <h5>
                                     {answer.user.user_name}
                                     {
                                        answer.user?.is_verified ?
                                          (
                                            <VerifiedBadge/>
                                          )
                                          : null
                                     }
                                     <span> {timeAgo(answer.created_at)}</span>
                                  </h5>
                                  <p>{answer.text}</p>
                               </Col>
                               <hr />
                            </React.Fragment>
                          ))}
                       </Row>
                    </Container>
                 </div>
              </React.Fragment>
            ) : (
              <div className={'text-center'}>
                 <Loader />
              </div>
            )}
         </Modal.Body>
      </SiteModal>
   );
};

export default QueriesModal;
