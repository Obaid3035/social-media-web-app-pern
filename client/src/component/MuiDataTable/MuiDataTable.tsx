import React from 'react';
import MUIDataTable, { FilterType } from 'mui-datatables';
import { PAGINATION_LIMIT_TABLE } from '../../utils/helper';
import { Spinner } from 'react-bootstrap';

const _ = require('lodash');

const MuiDataTable: React.FC<any> = ({
   data: { count, data },
   columns,
   title,
   setPage,
   page,
   search,
   setSearchText,
   isLoading,
}) => {
   const handler = _.debounce((newTableState: any) => {
      if (setSearchText) {
         setSearchText(newTableState.searchText);
      }
      setPage(newTableState.page);
   }, 1000);

   const searchHandler = (newTableState: any) => {
      if (!newTableState.searchText) {
         newTableState.searchText = '';
      }
      if (newTableState.searchText.length >= 0) {
         handler(newTableState);
      }
   };

   const options: FilterType | any = {
      filter: false,
      search,
      rowsPerPageOptions: [],
      rowsPerPage: PAGINATION_LIMIT_TABLE,
      count,
      serverSide: true,
      jumpToPage: false,
      page,
      print: false,
      onTableChange: (action: string, newTableState: any) => {
         switch (action) {
            case 'changePage':
               changePage(newTableState);
               break;
            case 'search':
               searchHandler(newTableState);
               break;
         }
      },
      viewColumns: false,
      responsive: 'standard',
      filterType: 'checkbox',
      selectableRows: 'none',
      textLabels: {
         body: {
            noMatch: isLoading ? (
               <div className={'text-center'}>
                  <Spinner animation={'border'} />
               </div>
            ) : (
               'No Data Found'
            ),
         },
      },
   };

   const changePage = (newTableState: any) => {
      setPage(newTableState.page);
   };

   return (
      <div className="mt-4 table">
         {/* @ts-ignore*/}
         <MUIDataTable
            title={title}
            data={data}
            columns={columns}
            options={options}
         />
      </div>
   );
};
export default MuiDataTable;
