import React from 'react';
import { Pagination } from 'antd';

const P2Pagination = ({ current, pageSize, total, onPageChange }) => {
  const handleChange = (page, newPageSize) => {
    onPageChange(page);
  };

  return (
    <Pagination className="flex self-center"
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={handleChange}
    />
  );
};

export default P2Pagination;