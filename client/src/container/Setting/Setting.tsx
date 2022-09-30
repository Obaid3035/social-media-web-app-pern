import React from 'react';
import { Container, Row } from 'react-bootstrap';
import SettingTab from './SettingTab/SettingTab';
import SettingForm from './SettingForm/SettingForm';
import EditProfile from './SettingForm/EditProfile/EditProfile';
import ResetPassword from './SettingForm/ResetPassword/ResetPassword';
import ResetEmail from './SettingForm/ResetEmail/ResetEmail';
import { getHelmet } from "../../utils/helmet";

export enum SETTING_OPTIONS {
   EDIT_PROFILE = 'edit-profile',
   RESET_PASSWORD = 'reset-password',
   RESET_EMAIL = 'reset-email',
}

const Setting = () => {
   const [currentTab, setCurrentTab] = React.useState(<EditProfile />);
   const [selectedTab, setSelectedTab] = React.useState<string>(SETTING_OPTIONS.EDIT_PROFILE);

   const onTabClickHandler = (value: string) => {
      setSelectedTab(value);
      switch (value) {
         case SETTING_OPTIONS.EDIT_PROFILE:
            setCurrentTab(<EditProfile />);
            break;
         case SETTING_OPTIONS.RESET_PASSWORD:
            setCurrentTab(<ResetPassword />);
            break;
         case SETTING_OPTIONS.RESET_EMAIL:
            setCurrentTab(<ResetEmail />);
            break;
      }
   };


   return (
      <Container fluid>
        { getHelmet('Setting') }
         <Row className={'setting justify-content-center'}>
            <SettingTab onClick={onTabClickHandler} selectedTab={selectedTab} />
            <SettingForm form={currentTab} />
         </Row>
      </Container>
   );
};

export default Setting;
