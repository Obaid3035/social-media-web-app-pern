import React, { useEffect, useState } from 'react';
import './HistoryLog.scss';
import Pagination from '../../component/Pagination/Pagination';
import { getHistoryLog } from '../../services/api/calorie';
import Loader from '../../component/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { getHelmet } from '../../utils/helmet';

const HistoryLog = () => {
   const navigation = useNavigate();
   const [page, setPage] = useState(0);
   const [history, setHistory] = useState<any>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [totalPage, setTotalPage] = useState(0);
   useEffect(() => {
      setIsLoading(true);
      getHistoryLog(page, 7).then((res) => {
         setTotalPage(res.data.count);
         setHistory(res.data.data);
         setIsLoading(false);
      });
   }, [page]);

   return (
     <div className={'main_history'}>
        {getHelmet('History Log')}
        <h5>HISTORY LOG</h5>
        {!isLoading ? (
          <React.Fragment>
             <div className={'container'}>
                <div className={'row justify-content-center'}>
                   {history.length > 0 ? (
                     history.map((historyWeek: any, i: number) => {
                        return (
                          <div className={'col-md-6 my-4'} key={i}>
                             <React.Fragment>
                                <div className={'date_section'}>
                                   <p>
                                      <strong>Date: </strong>{' '}
                                      {Object.keys(historyWeek)[0]}
                                   </p>
                                </div>

                                <div className={'history_logs'}>
                                   <ul>
                                      {history[i][
                                        Object.keys(historyWeek)[0]
                                        ].map((m: any) => (
                                        <React.Fragment>
                                           <li>
                                              <div
                                                className={'history_desc'}
                                              >
                                                 <p>{m.mealType}</p>
                                                 <button
                                                   onClick={() =>
                                                     navigation(
                                                       `/food-stats/${m.id}/stat`
                                                     )
                                                   }
                                                 >
                                                    View More
                                                 </button>
                                              </div>
                                           </li>
                                           <hr />
                                        </React.Fragment>
                                      ))}
                                   </ul>
                                </div>
                             </React.Fragment>
                          </div>
                        );
                     })
                   ) : (
                     <div className={'text-center'}>
                        <p>No History Found</p>
                     </div>
                   )}
                </div>
             </div>
             <div>
                <Pagination
                  page={page}
                  totalPage={totalPage}
                  setPage={setPage}
                />
             </div>
          </React.Fragment>
        ) : (
          <div className={'text-center'}>
             <Loader />
          </div>
        )}
        <p className={'want_to_check'} onClick={() => navigation('/graph')}>
           Want to check your report? <span>Click Here</span>
        </p>
     </div>
   );
};
export default HistoryLog;
