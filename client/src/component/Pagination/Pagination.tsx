import React from 'react';
import './Pagination.scss';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface IPagination {
   page: number;
   setPage: React.Dispatch<React.SetStateAction<number>>;
   totalPage: number;
}

const Pagination: React.FC<IPagination> = ({ totalPage, page, setPage }) => {
   if (totalPage > 0) totalPage -= 1;
   const items = [];
   let leftSide = page - 1;
   if (leftSide <= 0) leftSide = 0;
   let rightSide = page + 1;
   if (rightSide > totalPage) rightSide = totalPage;
   for (let number = leftSide; number <= rightSide; number++) {
      items.push(
         <div
            key={number}
            className={number === page ? 'round-effect active' : 'round-effect'}
            onClick={() => {
               setPage(number);
            }}
         >
            {number}
         </div>
      );
   }
   const nextPage = () => {
      if (page < totalPage) {
         setPage(page + 1);
      }
   };

   const prevPage = () => {
      if (page > 0) {
         setPage(page - 1);
      }
   };
   return (
      <div className="flex-container">
         <div className="paginate-ctn">
            <div className="round-effect" onClick={prevPage}>
               <HiChevronLeft />
            </div>
            {items}
            <div className="round-effect" onClick={nextPage}>
               <HiChevronRight />
            </div>
         </div>
      </div>
   );
};
export default Pagination;
