import React from 'react';
import { MoonLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className="page-loading">
      <MoonLoader color="white" size={30} />
    </div>
  );
};

export default Loading;
