import React from 'react';
import Button from '../../../component/Button/Button';
import { Col } from 'react-bootstrap';
import './NotFriend.scss';

interface INotFriendProps {
   onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const NotFriend: React.FC<INotFriendProps> = (props) => {
   return (
      <Col md={8} className={'not_friend text-center p-4'}>
         <h5>To see post</h5>
         <p className={'text-muted mt-3'}>you have to follow Him / Her</p>
         <Button onClick={props.onClick} className={'mt-3'}>Follow</Button>
      </Col>
   );
};

export default NotFriend;
