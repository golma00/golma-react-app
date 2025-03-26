import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar, P2Pagination } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import { P2MessageBox } from 'components/control/index';
import axios from 'axios';

function PaginationGridPage(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [rowData, setRowData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setCurrentData(rowData.slice(start, end));
  }, [rowData, page, pageSize]);
  

  useEffect(() => {
    if (currentData.length > 0) {
      console.log("바뀜!");
      grid.current.api.setGridOption("rowData", currentData);
    }
  }, [currentData]);

  const colDefs = [
    { 
      field: "column01", 
      headerName: "컬럼01", 
      width: 150, 
      align: "left"
    },
    { 
      field: "column02", 
      headerName: "컬럼02", 
      width: 150, 
      align: "left"
    },
    { 
      field: "column03", 
      headerName: "컬럼03", 
      width: 150, 
      align: "left"
    },
  ];

  async function onSearch() {
    try {
      setLoading(true);
      grid.current.api.clear();

      //const searchData = searchArea.current.api.get();
      //const res = await axios.post("", searchData);

      const data = [];
      for (let i = 1; i <= 101; i++) {
        data.push({
          column01: `Data ${i} - Col01`,
          column02: `Data ${i} - Col02`,
          column03: `Data ${i} - Col03`,
        });
      }
      setRowData(data);

      //await grid.current.api.setGridOption("rowData", data);

      setLoading(false);
      //if (res.data.code === "00") {
        //grid.current.api.setGridOption("rowData", res.data.data.result);
        setCount(data.length);
      //}
      //else {
      //  P2MessageBox.error(res.data.message || '시스템 오류가 발생했습니다.');
      //}
    }
    catch (error) {
      setLoading(false);
      P2MessageBox.error('시스템 오류가 발생했습니다.');
      console.log(error);
    }
  }

  function onGridReady() {
    onSearch();
  }

  return (
    <P2Page onSearch={onSearch} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
      </P2SearchArea>
      <P2GridButtonBar title="샘플 데이터" count={count}>
      </P2GridButtonBar>
      <div className="w-full h-full">
        <P2AgGrid  
          debug={true}
          ref={grid}
          columnDefs={colDefs}
          showStatusColumn={true}
          showCheckedColumn={true}
          onGridReady={onGridReady}
        />
      </div>
      <div>
        <P2Pagination
          current={page}
          pageSize={pageSize}
          total={rowData.length}
          onPageChange={(page) => setPage(page)}
        />
      </div>
    </P2Page>
  )
}

export default PaginationGridPage;
