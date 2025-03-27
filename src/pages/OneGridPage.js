import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import { P2Input, P2MessageBox, P2Select, P2RangePicker } from 'components/control/index';
import { useTabNavigate } from 'hooks/index';
import axios from 'axios';

function OneGridPage(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addTab } = useTabNavigate();

  const colDefs = [
    { field: "authGrpId", headerName: "권한그룹ID", width: 150, align: "center" },
    { field: "authGrpNm", headerName: "권한그룹명", width: 400, editable: true, required: true },
    { field: "alignSeq",  headerName: "정렬순서",   width: 120, editable: true, cellDataType: "number" },
    { field: "useYn",     headerName: "사용여부",   width: 120, editable: true, cellDataType: "checkbox" },
    { field: "chgUserId", headerName: "수정자ID",   width: 150, },
    { field: "chgDate",   headerName: "수정일시",   width: 200, },
  ];

  const [authCodeList, setAuthCodeList] = useState([
    { cd: "Y", cdNm: "사용" },
    { cd: "N", cdNm: "미사용" },
    { cd: "C", cdNm: "12312312312312312312312312312312" },
  ]);

  async function onSearch() {
    try {
      setLoading(true);
      grid.current.api.clear();

      const searchData = searchArea.current.api.get();
      const res = await axios.post("/api/v1/auth/list", searchData);

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

    addTab({
      menuPath: 'pages/TwoGridPage',
      closeAfterOpen: true,
      params: {
        authGrpId: 'test',
      },
    });

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
    try {
      const res = await axios.put("/api/v1/auth/save", {
        saveDatas: saveDatas
      });

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
    await grid.current.api.addRow({ useYn: "Y" }, "authGrpNm");
  }

  function onDeleteRow() {
    grid.current.api.deleteRow(true);
  }

  function onGridReady() {
    onSearch();
  }

  return (
    <P2Page onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea} canExpanded={true} minLine={1} maxLine={2}>
        <div className="w-full flex flex-row gap-x-5 gap-y-2">
          <div className="flex flex-row gap-2">
            <label className="common-label" htmlFor='authGrpId'>권한그룹ID</label>
            <P2Input id="authGrpId" name="authGrpId" className="w-60"/>
          </div>
          <div className="w-full flex flex-row gap-2">
            <label className="common-label" htmlFor='authGrpNm'>권한그룹명</label>
            <P2Input id="authGrpNm" name="authGrpNm" className="w-60"/>
          </div>
          <div className="w-full flex flex-row gap-2">
            <label className="common-label" htmlFor='crtDt'>기간</label>
            <P2RangePicker id="crtDt" name="crtDt" value={["20250227", "20250327"]} className="w-80"/>
          </div>
        </div>
        <div className="flex flex-row gap-x-5 gap-y-2">
          <div className="flex flex-row gap-2">
            <label className="common-label" htmlFor='authGrpId2'>권한그룹ID2</label>
            <P2Input id="authGrpId2" name="authGrpId2" />
          </div>
          <div className="flex flex-row gap-2">
            <label className="common-label" htmlFor='authGrpNm2'>권한그룹명2</label>
            <P2Select id="authGrpNm2" name="authGrpNm2" datas={authCodeList} isMulti={true} 
              menuWidth={300} className="w-80 text-sm bg-white rounded-md"/>
          </div>
        </div>
      </P2SearchArea>
      <P2GridButtonBar title="권한그룹 목록" onAddRow={onAddRow} onDeleteRow={onDeleteRow} count={count}>
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
    </P2Page>
  )
}

export default OneGridPage;
