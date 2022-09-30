import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import Avatar from '../../../assets/img/avatar.jpg';
import '../Setting.scss';
import { SETTING_OPTIONS } from '../Setting';
import { uploadProfilePicture } from '../../../services/api/auth';
import Loader from '../../../component/Loader/Loader';
import { getCurrentUser, removeToken, setToken } from '../../../utils/helper';
import Button from '../../../component/Button/Button';
import * as FaIcon from 'react-icons/fa';
import { errorNotify, successNotify } from '../../../utils/toast';

interface ISettingTabProps {
   onClick: (value: string) => void;
   selectedTab: string;
}

const SettingTab: React.FC<ISettingTabProps> = ({ onClick, selectedTab }) => {
   const [isLoading, setIsLoading] = useState(false);
   const [fileInput, setFileInput] = useState<File | null>(null);
   const [filePreview, setFilePreview] = useState<string | null>(null);
   const getActiveClass = (option: string) => {
      if (selectedTab === option) {
         return 'active_tab';
      }
   };

   const onImageUpload = async () => {
      setIsLoading(true);
      if (fileInput) {
         try {
            const formData = new FormData();
            formData.append('image', fileInput!);
            const res = await uploadProfilePicture(formData);
            successNotify(res.data.message);
            removeToken();
            setToken(res.data.token);
            setIsLoading(false);
         } catch (e: any) {
            errorNotify(e.response.data.message);
            setIsLoading(false);
         }
      } else {
         errorNotify('Please upload a picture first');
         setIsLoading(false);
      }
   };

   const getAvatar = () => {
      if (filePreview) {
         return filePreview;
      }
      if (getCurrentUser().image) {
         return getCurrentUser().image.avatar;
      }
      return Avatar;
   };

   return (
      <Col md={3} className={'rounded_white_box setting_tabs'}>
         <div className={'text-center profile_change'}>
            <img alt={'avatar'} width={120} height={120} src={getAvatar()} />
            <h4>{getCurrentUser().user_name}</h4>
            <input
               type="file"
               id="file-input"
               onChange={(e) => {
                  setFilePreview(URL.createObjectURL(e.target.files![0]));
                  setFileInput(e.target.files![0]);
               }}
               accept="image/png, image/jpeg"
               className="file_input"
            />

            <label className="file_label" htmlFor="file-input">
               <span>Select Avatar</span>
            </label>

            {!isLoading ? (
               <Button type={'submit'} onClick={onImageUpload}>
                  <FaIcon.FaSave className={'mr-2'} />
                  Save Changes
               </Button>
            ) : (
               <div className="text-center">
                  <Loader />
               </div>
            )}
         </div>
         <hr />
         <div className={'tabs'}>
            <p
               className={getActiveClass(SETTING_OPTIONS.EDIT_PROFILE)}
               onClick={() => onClick(SETTING_OPTIONS.EDIT_PROFILE)}
            >
               Edit Profile
            </p>
            <p
               className={getActiveClass(SETTING_OPTIONS.RESET_EMAIL)}
               onClick={() => onClick(SETTING_OPTIONS.RESET_EMAIL)}
            >
               Change Email address
            </p>
            <p
               className={getActiveClass(SETTING_OPTIONS.RESET_PASSWORD)}
               onClick={() => onClick(SETTING_OPTIONS.RESET_PASSWORD)}
            >
               Change Password
            </p>
         </div>
      </Col>
   );
};

export default SettingTab;
