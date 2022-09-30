import React, { useEffect, useState } from 'react';
import Calorie from '../../assets/img/calorie.png';
import { Button, Col, Container, Row } from 'react-bootstrap';
import './CalorieTracker.scss';
import CalorieFormModal from './CalorieFormModal/CalorieFormModal';
import { getCurrentUser } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { getHelmet } from "../../utils/helmet";

const CalorieTracker = () => {
   const navigation = useNavigate();
   const [show, setShow] = useState(false);
   const [profileSetup, setProfileSetup] = useState(false);
   const [mealType, setMealType] = useState("");
   const onModalChangeHandler = (mealType: string) => {
      if (!profileSetup) {
         setShow(!show);
         setMealType(mealType)
      } else {
        navigation(`/food-detail/${mealType}`)
      }
   };
   useEffect(() => {
      setProfileSetup(getCurrentUser().profile_setup);
   }, []);

   return (
      <Container>
         { getHelmet('Calorie Tracker') }
         {show ? (
            <CalorieFormModal
               show={show}
               mealType={mealType}
               onModalChange={() => setShow(!show)}
            />
         ) : null}
         <Row className="calorie_tracker">
            <Col md={6} className="calorie_tracker_heading">
               <h1>Calorie tracker</h1>
               <p>
                  Track progress toward your nutrition, water, fitness, and weight loss goals.
                  This all-in-one calorie tracker. When you enter your last meal,
                  you’ll be able to see your total calories, fats, carbs & sugars for the day.
                  We also have a graph called “My Graph” where you’ll be able to see your calories,
                  carbs, fats, & sugars, dating back to weeks, months & eventually by year.
               </p>
            </Col>
            <Col md={6}>
               <div className="calorie_tracker_image">
                  <img src={Calorie} alt={'calorie'} />
               </div>
            </Col>
         </Row>
         <div className="calorie_tracker_button">
            <Button onClick={() => onModalChangeHandler("breakfast")}>Breakfast</Button>
            <Button onClick={() => onModalChangeHandler("lunch")}>Lunch</Button>
            <Button onClick={() => onModalChangeHandler("dinner")}> Dinner</Button>
         </div>
         <div className={'d-flex justify-content-center'}>
            <Button className={'my_graph_btn mt-4'} onClick={() => navigation("/graph")}>My Graph</Button>
         </div>
      </Container>
   );
};
export default CalorieTracker;
