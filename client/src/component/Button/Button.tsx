import React from 'react';
import './Button.scss';

interface IButtonProps {
   className?: string;
   onClick?: React.MouseEventHandler<HTMLButtonElement>;
   type?: 'button' | 'submit' | 'reset' | undefined;
}


const Button: React.FC<IButtonProps> = (props) => {
   return (
      <button type={props.type} onClick={props.onClick} className={props.className + ' site_btn'}>{
         props.children
      }</button>
   );
};

export default Button;
