import React, { useEffect, useState } from "react";
import './Auth.scss';
import { Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as MdIcon from 'react-icons/md';
import * as RiIcon from 'react-icons/ri';
import * as AiIcon from 'react-icons/ai';
import Divider from '../../assets/img/auth-divider.png';
import Logo from '../../assets/img/Combined_Logo.png';
import { AuthValidation } from './AuthValidation';
import { useNavigate } from 'react-router-dom';
import Button from '../../component/Button/Button';
import Loader from '../../component/Loader/Loader';
import { login, register } from "../../services/api/auth";
import { getToken, setToken } from "../../utils/helper";
import { USER_ROLE } from "../../App";
import { getHelmet } from "../../utils/helmet";

export interface IAuthInput {
   user_name?: string;
   email: string;
   password: string;
}

enum AUTH_TOGGLE {
   LOGIN = 'login',
   REGISTER = 'register',
}

const Auth = () => {
   const navigation = useNavigate();

   const [isLoading, setIsLoading] = useState(false);
   const [isError, setIsError] = useState(false);
   const [error, setError] = useState("");

   useEffect(() => {
      if (getToken()){
         navigation("/home")
      }
   }, []);


   const {
      register: signUpRegister,
      handleSubmit: signUpSubmit,
      reset: signUpReset,
      formState: { errors: signUpErrors },
   } = useForm<IAuthInput>();

   const {
      register: loginRegister,
      handleSubmit: loginSubmit,
      reset: loginReset,
      formState: { errors: loginErrors },
   } = useForm<IAuthInput>();


   const [authToggle, setAuthToggle] = useState(AUTH_TOGGLE.LOGIN);

   const onSignUpSubmit =  signUpSubmit(async (data) => {
      try {
         setIsLoading(true)
         const auth = await register(data);
         setToken(auth.data.token)
         if (auth.data.role === USER_ROLE.USER) {
            navigation("/home");
         } else if (auth.data.role === USER_ROLE.ADMIN) {
            navigation("/admin/blogs")
         }
         setIsLoading(false)
      } catch (e: any) {
         setIsLoading(false)
         setIsError(true)
         setError(e.response.data.message)
      }
   });

   const onLoginSubmit = loginSubmit(async (data) => {
      try {
         setIsLoading(true)
         const auth = await login(data);
         setToken(auth.data.token)
         if (auth.data.role === USER_ROLE.USER) {
            navigation("/home");
         } else if (auth.data.role === USER_ROLE.ADMIN) {
            navigation("/admin/blogs")
         }
         setIsLoading(false)
      } catch (e: any) {
         setIsLoading(false)
         setIsError(true)
         setError(e.response.data.message)
      }
   });

   const getErrorInputClass = (field: string) => {
      if (
         signUpErrors.hasOwnProperty(field) ||
         loginErrors.hasOwnProperty(field)
      ) {
         return 'error_input';
      }
   };

   const authToggleHandler = () => {
      if (authToggle === AUTH_TOGGLE.LOGIN) {
         loginReset();
         setAuthToggle(AUTH_TOGGLE.REGISTER);
      } else if (authToggle === AUTH_TOGGLE.REGISTER) {
         signUpReset();
         setAuthToggle(AUTH_TOGGLE.LOGIN);
      }
   };

   const registerForm = (
      <React.Fragment>
         <h2>Create Account</h2>
         <Form className='auth_form' onSubmit={onSignUpSubmit}>
            <Form.Group className={'input_container'}>
               <MdIcon.MdPersonOutline className={getErrorInputClass('name')} />
               <Form.Control
                  type='text'
                  placeholder={'Enter Username'}
                  className={getErrorInputClass('name')}
                  {...signUpRegister('user_name', AuthValidation.user_name)}
               />
               <p className={'error_input_message'}>{signUpErrors.user_name?.message}</p>
            </Form.Group>
            <Form.Group className={'input_container'}>
               <RiIcon.RiMailSendLine className={getErrorInputClass('email')} />
               <Form.Control
                  type='email'
                  placeholder={'Enter email address'}
                  className={getErrorInputClass('email')}
                  {...signUpRegister('email', AuthValidation.email)}
               />
               <p className={'error_input_message'}>{signUpErrors.email?.message}</p>
            </Form.Group>
            <Form.Group className={'input_container'}>
               <AiIcon.AiOutlineLock className={getErrorInputClass('password')} />
               <Form.Control
                  type='password'
                  placeholder={'Enter Password'}
                  className={getErrorInputClass('password')}
                  {...signUpRegister('password', AuthValidation.password)}
               />
               <p className={'error_input_message'}>
                  {signUpErrors.password?.message}
               </p>
            </Form.Group>
            <div className={'text-center'}>
               <img alt={'divider'} src={Divider} />
            </div>
            {isLoading ? (
               <Loader />
            ) : (
               <Button className={'mt-3'}>CREATE AN ACCOUNT</Button>
            )}
            <div className='text-center w-100 mt-3'>
               <p className={'auth_switch'}>
                  Already have an account ?{' '}
                  <span onClick={authToggleHandler}>Sign In</span>
               </p>
            </div>
         </Form>
      </React.Fragment>
   );

   const loginForm = (
      <React.Fragment>
         <h2>Log In Account</h2>
         <Form className={'auth_form'} onSubmit={onLoginSubmit}>
            <Form.Group className={'input_container'}>
               <RiIcon.RiMailSendLine className={getErrorInputClass('email')} />
               <Form.Control
                  type='email'
                  placeholder={'Enter email address'}
                  className={getErrorInputClass('email')}
                  {...loginRegister('email', AuthValidation.email)}
               />
               <p className={'error_input_message'}>{loginErrors.email?.message}</p>
            </Form.Group>
            <Form.Group className={'input_container'}>
               <AiIcon.AiOutlineLock className={getErrorInputClass('password')} />
               <Form.Control
                  type='password'
                  placeholder={'Enter Password'}
                  className={getErrorInputClass('password')}
                  {...loginRegister('password', AuthValidation.password)}
               />
               <p className={'error_input_message'}>
                  {loginErrors.password?.message}
               </p>
            </Form.Group>
            <div className={'text-center'}>
               <img alt={'divider'} src={Divider} />
            </div>
            {isLoading ? (
               <Loader />
            ) : (
               <Button className={'mt-3'}>Sign In</Button>
            )}
            <div className='text-center w-100 mt-3'>
               <p className={'auth_switch'}>
                  Not a member ? <span onClick={authToggleHandler}>Sign Up</span>
               </p>
            </div>
         </Form>
      </React.Fragment>
   );

   const authForm = () => {
      if (authToggle === AUTH_TOGGLE.REGISTER) return registerForm
      else if (authToggle === AUTH_TOGGLE.LOGIN) return loginForm
   };


   return (
      <div className={'bg_img'}>
         { getHelmet(authToggle === AUTH_TOGGLE.LOGIN ? 'Login In' : 'Sign Up') }
         <div className={'card_view'}>
            <Row className={'h-100'}>
               <Col md={6} className={'left_section'}>
                  <div className={'welcome_carelery text-center'}>
                     <img alt={'Logo'} src={Logo} />
                     <p>
                        Carerely is an all in one social media platform that provides
                        you with everything you’ll need for your health & fitness.
                     </p>
                  </div>
               </Col>
               <Col md={6} className={'right_section'}>
                  {isError ? (
                     <p className={'network_error text-center'}>{error}</p>
                  ) : null}
                  {authForm()}
               </Col>
            </Row>
         </div>
      </div>
   );
};

export default Auth;
