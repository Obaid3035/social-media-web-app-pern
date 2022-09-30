import React, { useState } from 'react';
import SiteModal, { ISiteModal } from '../../../component/SiteModal/SiteModal';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import './CalorieFormModal.scss';
import { errorNotify, successNotify } from "../../../utils/toast";
import moment from 'moment';
import Loader from '../../../component/Loader/Loader';
import { createProfile } from "../../../services/api/auth";
import { setToken } from "../../../utils/helper";

enum GENDER {
   MALE = 'male',
   FEMALE = 'female',
   OTHER = 'other',
}

export interface ICalorieFormModal extends ISiteModal {
   mealType: string;
}

export interface IProfileInput {
   height_feet: number;
   height_inches: number;
   weight: number;
   weight_unit: string;
   gender: string;
}

const CalorieFormModal: React.FC<ICalorieFormModal> = ({
   show,
   onModalChange,
   mealType,
}) => {
   const navigation = useNavigate();
   const [isLoading, setIsLoading] = useState(false);
   const weightOptions = [
      { value: 'lb', label: 'Lbs' },
      { value: 'kg', label: 'Kg' },
   ];

   const [formInput, setFormInput] = useState({
      height_feet: 0,
      height_inches: 0,
      weight: 0,
      weight_unit: weightOptions[0].value,
      gender: GENDER.MALE,
   });

   const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
   ];

   const [selectedDate, setSelectedDate] = useState({
      month: {
         value: 1,
         label: months[1],
      },
      year: {
         value: 1997,
         label: '1997',
      },
   });

   const [day, setDay] = useState(
      daysInMonth(selectedDate.month.value, selectedDate.year.value)[0]
   );

   function generateArrayOfYears() {
      const max = new Date().getFullYear();
      const min = max - 92;
      const years = [];

      for (let i = max; i >= min; i--) {
         years.push({
            label: i.toString(),
            value: i,
         });
      }
      return years;
   }

   function convertMonth() {
      return months.map((month, index) => {
         return {
            value: index,
            label: month,
         };
      });
   }

   function daysInMonth(month: number, year: number) {
      const arrSelect = [];
      const noOfDays = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= noOfDays; i++) {
         arrSelect.push({
            value: i,
            label: i.toString(),
         });
      }
      return arrSelect;
   }

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === 'height_inches') {
         if (parseInt(value) < 12) {
            setFormInput({
               ...formInput,
               height_inches: parseInt(value),
            });
         }
      } else {
         setFormInput({
            ...formInput,
            [name]: value,
         });
      }
   };

   const onFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         if (
            formInput.height_feet <= 0 ||
            formInput.height_inches <= 0 ||
            formInput.weight <= 0
         ) {
            setIsLoading(false);
            errorNotify('Height and weight must be greater than zero');
         } else {
            const formData = {
               ...formInput,
               dob: moment(
                  `${selectedDate.month.value + 1}/${day.value}/${
                     selectedDate.year.value
                  }`
               ).toDate(),
            };


            const calorie = await createProfile(formData);
            if (calorie.data.saved) {
               setIsLoading(false)
               successNotify("Profile saved successfully")
               setToken(calorie.data.token)
               navigation(`/food-detail/${mealType}`)
            }

         }
      } catch (e) {
         setIsLoading(false);
      }
   };

   return (
      <SiteModal show={show} onModalChange={onModalChange}>
         <Form className={'tracker__modal'} onSubmit={onFormSubmit}>
            <Container fluid>
               <Row>
                  <Col md={12}>
                     <Form.Label>Birthday</Form.Label>
                     <div className={'d-flex justify-content-between'}>
                        <Select
                           options={convertMonth()}
                           onChange={(option) =>
                              setSelectedDate({
                                 ...selectedDate,
                                 month: option!,
                              })
                           }
                           value={selectedDate.month}
                           placeholder={'Month'}
                           className={'w-75'}
                        />
                        <Select
                           options={daysInMonth(
                              selectedDate.month.value,
                              selectedDate.year.value
                           )}
                           value={day}
                           onChange={(value) => setDay(value!)}
                           placeholder={'Date'}
                           className={'w-75 mx-3'}
                        />
                        <Select
                           options={generateArrayOfYears()}
                           onChange={(option) =>
                              setSelectedDate({
                                 ...selectedDate,
                                 year: option!,
                              })
                           }
                           value={selectedDate.year}
                           placeholder={'Year'}
                           className={'w-75'}
                        />
                     </div>
                  </Col>
                  <Col md={6} className={'modal_col'}>
                     <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                     >
                        <Form.Label>Feet</Form.Label>
                        <Form.Control
                           value={formInput.height_feet}
                           name={'height_feet'}
                           onChange={onChangeHandler}
                           type="number"
                           placeholder="5"
                        />
                     </Form.Group>
                  </Col>

                  <Col md={6} className={'modal_col'}>
                     <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                     >
                        <Form.Label>Inches</Form.Label>
                        <Form.Control
                           value={formInput.height_inches}
                           name={'height_inches'}
                           onChange={onChangeHandler}
                           type="number"
                           placeholder="5"
                        />
                     </Form.Group>
                  </Col>
                  <Col md={8} className={'modal_col'}>
                     <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                     >
                        <Form.Label>Enter Your Weight</Form.Label>
                        <Form.Control
                           name={'weight'}
                           value={formInput.weight}
                           onChange={onChangeHandler}
                           type="text"
                           placeholder="65"
                        />
                     </Form.Group>
                  </Col>
                  <Col md={4} className={'unit'}>
                     <Select
                        name={'weight_unit'}
                        defaultValue={weightOptions[0]}
                        options={weightOptions}
                        onChange={(option) =>
                           setFormInput({
                              ...formInput,
                              weight_unit: option!.value,
                           })
                        }
                     />
                  </Col>
                  <Col md={12} className={'modal_col'}>
                     <p>Gender</p>
                     <Form.Check
                        type={'radio'}
                        value={GENDER.MALE}
                        checked={formInput.gender === GENDER.MALE}
                        onChange={() =>
                           setFormInput({
                              ...formInput,
                              gender: GENDER.MALE,
                           })
                        }
                        label={`Male`}
                     />
                     <Form.Check
                        type={'radio'}
                        value={GENDER.FEMALE}
                        checked={formInput.gender === GENDER.FEMALE}
                        onChange={() =>
                           setFormInput({
                              ...formInput,
                              gender: GENDER.FEMALE,
                           })
                        }
                        label={`Female`}
                     />
                     <Form.Check
                        type={'radio'}
                        checked={formInput.gender === GENDER.OTHER}
                        onChange={() =>
                           setFormInput({
                              ...formInput,
                              gender: GENDER.OTHER,
                           })
                        }
                        value={GENDER.OTHER}
                        label={`Others`}
                     />
                  </Col>
                  <Col md={12} className={'tracker__btn'}>
                     {!isLoading ? (
                        <Button type={'submit'}>Submit</Button>
                     ) : (
                        <div className={'text-center'}>
                           <Loader />
                        </div>
                     )}
                  </Col>
               </Row>
            </Container>
         </Form>
      </SiteModal>
   );
};

export default CalorieFormModal;
