import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ current, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <BSPagination.Item
        key={number}
        active={number === current}
        onClick={() => onPageChange(number)}
      >
        {number}
      </BSPagination.Item>
    );
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <BSPagination>
        <BSPagination.Prev disabled={current === 1} onClick={() => onPageChange(current - 1)} />
        {items}
        <BSPagination.Next disabled={current === totalPages} onClick={() => onPageChange(current + 1)} />
      </BSPagination>
    </div>
  );
};

export default Pagination;