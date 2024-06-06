import React from 'react';
import ReactPaginate from 'react-paginate';

export function Paginate({ pageCount, handlePageClick, selected }) {
  return (
    <ReactPaginate
      breakLabel="...."
      previousLabel="<"
      nextLabel=" > "
      onPageChange={({ selected }) => handlePageClick(selected)}
      pageCount={pageCount}
      className="react-paginate"
      pageClassName="li-button"
      pageLinkClassName="link-button"
      renderOnZeroPageCount={false}
      forcePage={selected}
    />
  );
}
