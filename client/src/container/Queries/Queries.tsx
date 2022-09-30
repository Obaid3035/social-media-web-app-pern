import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { BiRadioCircle, BiRadioCircleMarked } from 'react-icons/bi';
import Button from '../../component/Button/Button';
import { FiClock } from 'react-icons/fi';
import Avatar from '../../assets/img/avatar.jpg';
import { AiFillPlusSquare } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import './Queries.scss';
import ReadMore from '../../component/ReadMore/ReadMore';
import QueriesModal from './QueriesModal/QueriesModal';
import {
   createQueries,
   deleteQueries,
   getQueries,
   getTopic,
} from '../../services/api/queries';
import { IUser } from '../../component/Header/Header';
import Loader from '../../component/Loader/Loader';
import { errorNotify } from '../../utils/toast';
import { getHelmet } from '../../utils/helmet';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { getCurrentUser, timeAgo } from "../../utils/helper";
import DeletePopUp from "../../component/DeletePopUp/DeletePopUp";

export interface ITopic {
   id: number;
   text: string;
   user: IUser;
}

export interface IQueries {
   id: number;
   text: string;
   user: IUser;
   answerCount: number;
   created_at: string
}

const Queries = () => {
   const [show, setShow] = useState(false);
   const onClose = () => setShow(!show);
   const [topic, setTopic] = useState<ITopic[]>([]);
   const [queries, setQueries] = useState<IQueries[]>([]);
   const [radioToggle, setRadioToggle] = React.useState("All");
   const [queryInput, setQueryInput] = React.useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isFetching, setIsFetching] = useState(false);
   const [deleteShow, setDeleteShow] = useState(false)
   const [queryId, setQueryId] = useState<number | null>(null)

   useEffect(() => {
      setIsLoading(true);
      getTopic().then((res) => {
         setTopic(res.data);
      });
   }, []);

   const onDeleteQueryHandler = async () => {
      setIsLoading(true);
      setIsFetching(false);
      await deleteQueries(queryId!);
      setDeleteShow(!deleteShow)
      setIsLoading(false);
      setIsFetching(true);
   };

   const onOpenDeleteModalHandler = (queryId: number) => {
      setQueryId(queryId)
      setDeleteShow(!deleteShow)
   }



   const onModalChangeHandler = (query: IQueries) => {
      setQuery(query);
      setShow(!show);
   };

   useEffect(() => {
      setIsLoading(true);
      getQueries(radioToggle).then((res) => {
         setIsLoading(false);
         setQueries(res.data.sort((a: any, b: any) => a.answerCount > b.answerCount ? -1 : 1));
      });
   }, [radioToggle, !isFetching]);

   const [query, setQuery] = useState<IQueries | null>(null);

   const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (radioToggle === "All") {
         errorNotify('Please select other topics')
      } else {
         setIsLoading(true);
         createQueries(radioToggle, queryInput)
           .then((res) => {
              const queriesClone = queries.concat();
              queriesClone.push(res.data);
              setQueries(queriesClone);
              setIsLoading(false);
              setQueryInput('');
           })
           .catch((err: any) => {
              setIsLoading(false);
              errorNotify(err.response.data.message);
           });
      }
   };

   return (
      <Container fluid>
         <DeletePopUp show={deleteShow}
                      onClose={() => setDeleteShow(!deleteShow)}
                      onDelete={onDeleteQueryHandler}/>
         {getHelmet('Q&A')}
         {query && show ? (
            <QueriesModal
               setQuery={setQuery}
               queries={queries}
               setQueries={setQueries}
               query={query}
               show={show}
               onClose={onClose}
            />
         ) : null}
         <Row className={'queries_main'}>
            <Col md={3} className={'queries_left'}>
               <ul className={'options'}>
                  <li>
                     {radioToggle === "All" ? (
                       <BiRadioCircleMarked />
                     ) : (
                       <BiRadioCircle
                         onClick={() => setRadioToggle("All")}
                       />
                     )}
                     All
                  </li>
                  {topic.map((topic, index) => (
                     <li key={index}>
                        {radioToggle === topic.text ? (
                           <BiRadioCircleMarked />
                        ) : (
                           <BiRadioCircle
                              onClick={() => setRadioToggle(topic.text)}
                           />
                        )}
                        {topic.text}
                     </li>
                  ))}
               </ul>
            </Col>
            <Col md={7}>
               <Form onSubmit={onFormSubmit}>
                  <Form.Group className="ask_question">
                     <Form.Control
                        value={queryInput}
                        required
                        onChange={(e) => setQueryInput(e.target.value)}
                        className="question_input"
                        type="text"
                        placeholder="Type Your Question Here..."
                     />
                     <button type={'submit'}>
                        <AiFillPlusSquare />
                     </button>
                  </Form.Group>
               </Form>
               {!isLoading ? (
                  queries.length > 0 ? (
                     queries.map((query) => (
                        <div className="question" key={query.id}>
                           <div className={'question_details'}>
                              <div className={'d-flex justify-content-start'}>
                                 <div className={'answer_counter'}>
                                    {query.answerCount}
                                 </div>
                                 <div className={'ml-3'}>
                                    <ReadMore stringLimit={150}>{query.text}</ReadMore>
                                 </div>
                              </div>
                              <div>
                                 {getCurrentUser().id === query.user.id ? (
                                    <RiDeleteBin6Line
                                       className={'delete'}
                                       onClick={() =>
                                         onOpenDeleteModalHandler(query.id)
                                       }
                                    />
                                 ) : null}
                              </div>
                           </div>
                           <div>
                              <Container>
                                 <hr className={'question_divider'} />
                                 <Row>
                                    <Col md={4}>
                                       <div className={'user_details'}>
                                          <img
                                             src={
                                                query.user.image
                                                   ? query.user.image.avatar
                                                   : Avatar
                                             }
                                             alt="Avatar"
                                          />
                                          <p>
                                             Posted By:
                                             <NavLink to={`/${query.user.user_name}`} className={'ml-1'}>
                                                {query.user.user_name}
                                             </NavLink>
                                          </p>
                                       </div>
                                    </Col>
                                    <Col md={2} className={'user_details'}>
                                       <FiClock />
                                       <p>  { timeAgo(query.created_at) }</p>
                                    </Col>
                                    <Col md={2} />

                                    <Col md={4} className={'user_details'}>
                                       <Button
                                          onClick={() =>
                                             onModalChangeHandler(query)
                                          }
                                          className="see_btn"
                                       >
                                          Answers
                                       </Button>
                                    </Col>
                                 </Row>
                              </Container>
                           </div>
                        </div>
                     ))
                  ) : (
                     <p className={'text-center mt-4'}>No Queries Found</p>
                  )
               ) : (
                  <div className={'text-center mt-4'}>
                     <Loader />
                  </div>
               )}
            </Col>
         </Row>
      </Container>
   );
};
export default Queries;
