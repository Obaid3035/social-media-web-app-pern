import React from 'react';
import * as RiIcon from 'react-icons/ri';
import { Modal } from 'react-bootstrap';
import './SiteModal.scss';

export interface ISiteModal {
   show: boolean;
   onModalChange: () => void;
   size?: "sm" | "lg" | "xl" | undefined,
}

const SiteModal: React.FC<ISiteModal> = ({ show, onModalChange, children, size }) => {
   return (
      <Modal show={show} size={size} backdrop="static" keyboard={false} className={"site_modal"} centered={true}>
         <Modal.Header className={'modal_header'}>
            <RiIcon.RiCloseCircleLine onClick={onModalChange} />
         </Modal.Header>
         <Modal.Body>{children}</Modal.Body>
      </Modal>
   );
};

export default SiteModal;
