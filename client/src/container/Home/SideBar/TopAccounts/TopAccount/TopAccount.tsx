import React from 'react';
import Avatar from '../../../../../assets/img/avatar.jpg';
import './TopAccount.scss';
import { IUser } from "../../../../../component/Header/Header";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../../../utils/helper";

const TopAccount: React.FC<{ topAccounts: IUser[]  }> = ({ topAccounts }) => {
   const navigation = useNavigate()
   const redirection = (id: number, user_name: string) => {
      if (getCurrentUser().id === id) {
         navigation(`/profile`)
      } else {
         navigation(`/${user_name}`)
      }
   }
   return (
      <div className={'top_account_profiles'}>
        {
          topAccounts.map((account) => (
            <div className={'text-center ml-3'} key={account.id}>
              <img width={60} height={60} alt={'profile'}
                   onClick={() => redirection(account.id, account.user_name)}
                   src={account.image ? account.image.avatar : Avatar}
              />
              <p className={'text-muted mt-2'}>{ account.user_name}</p>
            </div>
          ))
        }

      </div>
   );
};

export default TopAccount;
