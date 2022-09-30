import React from "react";
import SiteModal from "../SiteModal/SiteModal";
import Button from "../Button/Button";
import './DeletePopUp.scss';

interface IDeletePopUp {
  show: boolean;
  onClose: () => void;
  onDelete: () => void
}

const DeletePopUp: React.FC<IDeletePopUp> = ({show, onClose, onDelete}) => {
  return (
    <SiteModal  show={show} onModalChange={onClose}>
      <div className={"delete_div"}>
        <h4>Are you sure you want to delete this ?</h4>
        <div className={'mt-4'}>
          <Button className={'w-25'} onClick={onClose}>No</Button>
          <Button className={'w-25'} onClick={onDelete}>Yes</Button>
        </div>
      </div>

    </SiteModal>
  );
};

export default DeletePopUp;
