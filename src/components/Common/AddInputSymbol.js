import React from 'react';

const wrapStyle = {
  height: '35px',
  width: '35px',
  background: '#e9ecef',
  fontSize: '0.875rem',
  border: '1px solid #dde6e9',
};

function AddInputSymbol({ symbol }) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={wrapStyle}
    >
      {symbol}
    </div>
  );
}

export default AddInputSymbol;
