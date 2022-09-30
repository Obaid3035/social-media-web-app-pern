import React, { useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import Button from '../../../../component/Button/Button';
import * as FaIcon from 'react-icons/fa';
import { getCurrentUser } from '../../../../utils/helper';
import { getProfile, updateProfile } from '../../../../services/api/auth';
import Loader from '../../../../component/Loader/Loader';

const EditProfile = () => {
   const [isProfileSetup, setIsProfileSetup] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(false);
   const [profile, setProfile] = React.useState<any>(null);
   useEffect(() => {
      setIsProfileSetup(getCurrentUser().profile_setup);
      if (getCurrentUser().profile_setup) {
         setIsLoading(true);
         getProfile().then((res) => {
            setIsLoading(false);
            setProfile(res.data);
         });
      }
   }, []);
   const weightOptions = [
      { value: 'lb', label: 'Lbs' },
      { value: 'kg', label: 'Kg' },
   ];

   const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === 'height_inches') {
         if (parseInt(value) < 12) {
            setProfile({
               ...profile,
               height_inches: value,
            });
         }
      } else {
         setProfile({
            ...profile,
            [name]: value,
         });
      }
   };

   const onFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      updateProfile(profile)
         .then(() => {
            setIsLoading(false);
         })
         .catch(() => {
            setIsLoading(false);
         });
   };

   return (
      <React.Fragment>
         <h4>Personal Information</h4>
         <hr />
         {isProfileSetup ? (
            profile && !isLoading ? (
               <Form className={'setting_form'} onSubmit={onFormSubmit}>
                  <Row>
                     <Col md={8} className={'mt-4'}>
                        <Form.Label>Weight</Form.Label>
                        <Form.Control
                           onChange={onChangeHandler}
                           name={'weight'}
                           type={'number'}
                           value={profile.weight}
                           placeholder={'Enter your weight'}
                        />
                     </Col>
                     <Col md={2} className={'mt-4'}>
                        <Form.Label>Unit</Form.Label>
                        <Select
                           isSearchable={false}
                           defaultValue={weightOptions.find((option) => profile.weight_unit == option.value)}
                           onChange={(option) =>
                              setProfile({
                                 ...profile,
                                 weight_unit: option!.value,
                              })
                           }
                           options={weightOptions}
                        />
                     </Col>
                     <Col md={4} className={'mt-4'}>
                        <Form.Label>Feet</Form.Label>
                        <Form.Control
                           name={'height_feet'}
                           onChange={onChangeHandler}
                           type={'number'}
                           value={profile.height_feet}
                           placeholder={'Enter your weight'}
                        />
                     </Col>
                     <Col md={4} className={'mt-4'}>
                        <Form.Label>Inches</Form.Label>
                        <Form.Control
                           name={'height_inches'}
                           onChange={onChangeHandler}
                           type={'number'}
                           value={profile.height_inches}
                           placeholder={'Enter your weight'}
                        />
                     </Col>
                     <Col md={12} className={'mt-4 text-right setting_btn'}>
                        <Button type={'submit'}>
                           <FaIcon.FaSave className={'mr-2'} />
                           Save Changes
                        </Button>
                     </Col>
                  </Row>
               </Form>
            ) : (
               <div className={'text-center'}>
                  <Loader />
               </div>
            )
         ) : (
            <p className={'alert alert-danger'}>Profile is not setup</p>
         )}
      </React.Fragment>
   );
};

export default EditProfile;
