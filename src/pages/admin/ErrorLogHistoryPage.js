import React, { useState, useRef, useEffect, useCallback } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar, P2FormArea, P2SplitterLayout } from 'components/layout/index';
import { P2AgGrid, onlyInsertRow, InvalidFunction } from 'components/grid/index';
import { P2InputTextArea, P2RangePicker, P2MessageBox } from 'components/control/index';
import axios from 'axios';
import * as Utils from 'utils/Utils';
import * as Validate from 'utils/Validate';

/**
 * 프로그램명   : 에러 로그 조회 화면
 * 프로그램설명 : 에러 로그 조회 화면
 *
 * 작성자       : 황준혁
 * 작성일자     : 2025.03.27
 */
function ErrorLogHistoryPage(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);
  const formArea = useRef(0);

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowNode, setRowNode] = useState();

  const colDefs = [
    {
      field: "seq",
      headerName: "순서",
      width: 80,
      editable: false,
      align: "left",
    },
    {
      field: "crtDt",
      headerName: "생성일시",
      width: 170,
      editable: false,
      align: "left",
    },
    {
      field: "appNm",
      headerName: "어플리케이션명",
      width: 190,
      editable: false,
      align: "left",
    },
    {
      field: "apiUrl",
      headerName: "API URL",
      width: 280,
      editable: false,
      align: "left",
    },
    {
      field: "methodNm",
      headerName: "메소드명",
      width: 530,
      editable: false,
      align: "left",
    },
    {
      field: "traceId",
      headerName: "추적ID",
      width: 280,
      editable: false,
      align: "left",
    },
  ];

  useEffect(() => {
    searchArea.current.api.setValid({
    });

    formArea.current.api.setValid({
      paramVal: (params) => Validate.validateMaxByte(params.value, 4000),
    });
  }, []);

  useEffect(() => {
    getErrorLogDetails(rowNode);
  }, [rowNode]);

  // 조회
  async function onSearch() {
    try {
      if (Utils.isNotEmpty(await searchArea.current.api.validate())) {
        return;
      }

      setLoading(true);
      grid.current.api.clear();
      formArea.current.api?.clear();

      const searchData = searchArea.current.api.get();
      const res = await axios.post("/api/v1/errorLogHistory/errorLogHistoryList", searchData);

      setLoading(false);
      if (res.data.code === "00") {
        grid.current.api.setGridOption("rowData", res.data.data.result);
        grid.current.api.firstRowSelected();
        setCount(res.data.data.result.length);
      }
      else {
        P2MessageBox.error(res.data.message || '시스템 오류가 발생했습니다.');
      }
    }
    catch (error) {
      setLoading(false);
      P2MessageBox.error('시스템 오류가 발생했습니다.');
      console.log(error);
    }
  }


  const onGridReady = useCallback((e) => {
    onSearch();
  }, []);

  const onBeforeSelectionChanged = useCallback(async (e) => {
    return Utils.isEmpty(await formArea.current.api.validate());
  }, []);

  const onSelectionChanged = useCallback(async (e) => {
    setRowNode(await e.api.getSelectedNode());
  }, []);

  async function getErrorLogDetails(rowNode) {
    try {
      if (Utils.isEmpty(rowNode)) {
        return;
      }
      setLoading(true);
      const seqNo = rowNode.data.seq;
      formArea.current.api?.clear();

      const res = await axios.post("/api/v1/errorLogHistory/getErrorLogDetails", {seq: seqNo});

      setLoading(false);
      if (res.data.code === "00") {
        if (Utils.isNotEmpty(res.data.data.result.errCntn)) {
          formArea.current.api?.set("paramVal", res.data.data.result.paramVal);
          formArea.current.api?.set("errCntn",  res.data.data.result.errCntn);
        }
      }
      else {
        P2MessageBox.error(res.data.message || '시스템 오류가 발생했습니다.');
      }
    }
    catch (error) {
      setLoading(false);
      P2MessageBox.error('시스템 오류가 발생했습니다.');
      console.log(error);
    }
  }

  return (
    <P2Page onSearch={onSearch} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <div className="flex flex-row gap-2">
          <label className="common-label" htmlFor='crtDt'>생성일시</label>
          <P2RangePicker id="crtDt" name="crtDt" value={[Utils.getDate(-7), Utils.getToday()]} className="w-80"/>
        </div>
      </P2SearchArea>
      <div className="w-full">
        <P2SplitterLayout vertical={false} className="w-full h-full" percentage={true} primaryMinSize={20} secondaryMinSize={20} secondaryInitialSize={50} >
          <div className="h-full flex flex-col gap-1">
            <P2GridButtonBar title="에러 로그 목록" count={count}>
            </P2GridButtonBar>
            <P2AgGrid
              debug={true}
              ref={grid}
              columnDefs={colDefs}
              onGridReady={onGridReady}
              onBeforeSelectionChanged={onBeforeSelectionChanged}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
          <div className="h-full flex flex-col gap-1">
            <P2GridButtonBar title="에러 로그 상세">
            </P2GridButtonBar>
            <P2SplitterLayout vertical={true} className="w-full h-full" percentage={true} primaryMinSize={20} secondaryMinSize={20} secondaryInitialSize={80} >
            <P2FormArea ref={formArea} className="p2-form-area h-[550px]">
              <div className="flex flex-col gap-2 w-full h-[20%]">
                <label for='paramVal' className="common-label w-full">파라미터값</label>
                <P2InputTextArea id="paramVal" name="paramVal" className="w-full grow"/>
              </div>
              <div className="flex flex-col gap-2 w-full h-full">
                <label for='errCntn' className="common-label w-full">에러내용</label>
                <P2InputTextArea id="errCntn" name="errCntn" className="w-full grow"/>
              </div>
            </P2FormArea>
            </P2SplitterLayout>
          </div>
        </P2SplitterLayout>
      </div>
    </P2Page>
  )
}

export default ErrorLogHistoryPage;

// import React, { useState, useRef, useEffect } from 'react'
// import { P2Page, P2SearchArea, P2GridButtonBar, P2Pagination } from 'components/layout/index';
// import { P2AgGrid } from 'components/grid/index';
// import { P2MessageBox } from 'components/control/index';
// import axios from 'axios';

// function PaginationGridPage(props) {
//   const searchArea = useRef(null);
//   const grid = useRef(0);
//   const [count, setCount] = useState(0);
//   const [loading, setLoading] = useState(false);
  
//   const [rowData, setRowData] = useState([]);
//   const [currentData, setCurrentData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     const start = (page - 1) * pageSize;
//     const end = start + pageSize;
//     setCurrentData(rowData.slice(start, end));
//   }, [rowData, page, pageSize]);
  

//   useEffect(() => {
//     if (currentData.length > 0) {
//       console.log("바뀜!");
//       grid.current.api.setGridOption("rowData", currentData);
//     }
//   }, [currentData]);

//   const colDefs = [
//     { 
//       field: "column01", 
//       headerName: "컬럼01", 
//       width: 150, 
//       align: "left"
//     },
//     { 
//       field: "column02", 
//       headerName: "컬럼02", 
//       width: 150, 
//       align: "left"
//     },
//     { 
//       field: "column03", 
//       headerName: "컬럼03", 
//       width: 150, 
//       align: "left"
//     },
//   ];

//   async function onSearch() {
//     try {
//       setLoading(true);
//       grid.current.api.clear();

//       //const searchData = searchArea.current.api.get();
//       //const res = await axios.post("", searchData);

//       const data = [];
//       for (let i = 1; i <= 101; i++) {
//         data.push({
//           column01: `Data ${i} - Col01`,
//           column02: `Data ${i} - Col02`,
//           column03: `Data ${i} - Col03`,
//         });
//       }
//       setRowData(data);

//       //await grid.current.api.setGridOption("rowData", data);

//       setLoading(false);
//       //if (res.data.code === "00") {
//         //grid.current.api.setGridOption("rowData", res.data.data.result);
//         setCount(data.length);
//       //}
//       //else {
//       //  P2MessageBox.error(res.data.message || '시스템 오류가 발생했습니다.');
//       //}
//     }
//     catch (error) {
//       setLoading(false);
//       P2MessageBox.error('시스템 오류가 발생했습니다.');
//       console.log(error);
//     }
//   }

//   function onGridReady() {
//     onSearch();
//   }

//   return (
//     <P2Page onSearch={onSearch} loading={loading}>
//       <P2SearchArea onSearch={onSearch} ref={searchArea}>
//       </P2SearchArea>
//       <P2GridButtonBar title="샘플 데이터" count={count}>
//       </P2GridButtonBar>
//       <div className="w-full h-full">
//         <P2AgGrid  
//           debug={true}
//           ref={grid}
//           columnDefs={colDefs}
//           showStatusColumn={true}
//           showCheckedColumn={true}
//           onGridReady={onGridReady}
//         />
//       </div>
//       <div>
//         <P2Pagination
//           current={page}
//           pageSize={pageSize}
//           total={rowData.length}
//           onPageChange={(page) => setPage(page)}
//         />
//       </div>
//     </P2Page>
//   )
// }

// export default PaginationGridPage;
