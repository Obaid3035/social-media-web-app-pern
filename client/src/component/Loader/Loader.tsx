import React from 'react';
import { Grid } from 'react-loader-spinner';

const Loader = () => {
   return (
      <Grid
         wrapperStyle={{
            justifyContent: 'center',
         }}
         width='35'
         color='#2196F3'
         ariaLabel='loading'
      />
   );
};

export default Loader;
