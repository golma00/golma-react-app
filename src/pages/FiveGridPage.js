import React, { useState, useRef, useEffect } from 'react';
import { P2Page, P2SearchArea, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import { P2Input, P2MessageBox } from 'components/control/index';
import axios from 'axios';

function FiveGridPage(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const colDefs = [
    { field: "empNo",    headerName: "사원번호",   width: 150, editable: true  , align: "center" , required: true},
    { field: "empName",  headerName: "사원명",     width: 150, editable: true  , required: true },
    { field: "empHpno",  headerName: "휴대폰번호", width: 150, editable: true } ,
    { field: "empEmail", headerName: "e메일주소",  width: 150, editable: true}  ,

  ];

  async function onSearch() {
    try {
      setLoading(true);
      grid.current.api.refresh();
      let iempNo = await searchArea.current.api.get('empNo').empNo;
      if (iempNo === undefined ) {iempNo=""};

      const res = await axios.get(`/api/v1/userLang/emp/${iempNo}`);
      
      console.log("res==>" + JSON.stringify(res,null,2));

      setLoading(false);
      if (res.data.code === "00") {
        grid.current.api.setGridOption("rowData", res.data.data.result);
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

  async function onSave() {

    const saveDatas = await grid.current.api.getModifiedRows();
    if (saveDatas.length === 0) {
      P2MessageBox.warn('저장할 데이터가 없습니다.');
      return;
    }

    P2MessageBox.confirm({
      content: '저장 하시겠습니까?',
      onOk: () => onSaveAction(saveDatas),
      onCancel() {},
    });
  }

  async function onSaveAction(saveDatas) {
    setLoading(true);
    console.log("saveDatas==" + saveDatas);

    try {
      const res = await axios.post("/api/v1/userLang/saveemp", saveDatas);

      setLoading(false);
      if (res.data.code === "00") {
        P2MessageBox.success({
          content: '저장이 완료 되었습니다.',
          onOk: () => onSearch(),
        });
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

  async function onAddRow() {
    await grid.current.api.addRow({}, "authGrpNm");
  }

  function onDeleteRow() {
    grid.current.api.deleteRow(true);
  }

  function onGridReady() {
    onSearch();
  }

  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <div className="flex flex-row gap-1">
          <label class="text-xl" htmlFor='authGrpId'>사원번호</label>
          <P2Input type="text" id="empNO" name="empNo" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
      </P2SearchArea>
      <P2GridButtonBar title="직원 목록" onAddRow={onAddRow} onDeleteRow={onDeleteRow} count={count}>
      </P2GridButtonBar>
      <div className="w-full h-[500px]">
        <P2AgGrid  
          debug={true}
          ref={grid}
          columnDefs={colDefs}
          showStatusColumn={true}
          showCheckedColumn={true}
          onGridReady={onGridReady}
        />
      </div>
    </P2Page>
  )
}

export default FiveGridPage;
