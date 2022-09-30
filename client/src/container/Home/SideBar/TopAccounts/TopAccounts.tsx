import React from 'react';
import TopAccount from './TopAccount/TopAccount';
import { IUser } from "../../../../component/Header/Header";

const TopAccounts: React.FC<{ topAccounts: IUser[]  }> = ({ topAccounts}) => {
   return (
      <div className={'top_account'}>
         <h4>Top Accounts</h4>
        {
          topAccounts.length > 0 ?
            <TopAccount topAccounts={topAccounts} />
           : (
              <div className="text-center">
                <p className={"text-muted"}> No Accounts Found</p>
              </div>
            )
        }

      </div>
   );
};

export default TopAccounts;
