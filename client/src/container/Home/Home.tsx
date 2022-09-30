import React from 'react';
import { Container, Row } from 'react-bootstrap';
import './Home.scss';
import SideBar from './SideBar/SideBar';
import Feed from './Feed/Feed';
import { getHelmet } from "../../utils/helmet";

const Home = () => {
   return (
      <Container fluid>
        { getHelmet('Home') }
         <Row className={'justify-content-center mx-0'}>
            <SideBar />
            <Feed />
         </Row>
      </Container>
   );
};

export default Home;
