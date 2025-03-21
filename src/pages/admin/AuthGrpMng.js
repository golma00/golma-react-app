import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid, onlyInsertRow } from 'components/grid/index';
import { P2Input, P2MessageBox } from 'components/control/index';
import axios from 'axios';
import * as Utils from 'utils/Utils';
import * as Validate from 'utils/Validate';

function OneGridPage(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const colDefs = [
    { field: "authGrpId", headerName: "권한그룹ID", width: 150, align: "center" },
    { field: "authGrpNm", headerName: "권한그룹명", width: 400, editable: true, required: true, valid: (params) => Validate.validateRequired(params.value) },
    { field: "alignSeq",  headerName: "정렬순서",   width: 120, editable: true, cellDataType: "number" },
    { field: "useYn",     headerName: "사용여부",   width: 120, editable: true, cellDataType: "checkbox" },
    { field: "chgUserId", headerName: "수정자ID",   width: 150, },
    { field: "chgDate",   headerName: "수정일시",   width: 200, },
  ];

  useEffect(() => {
    searchArea.current.api.setValid({
      authGrpId: (params) => {
        return Validate.validateRequired(params.value);
      },
      authGrpNm: (params) => {
        return Validate.validateRequired(params.value);
      },
    });
  }, []);

  async function onSearch() {
    try {
      if (Utils.isNotEmpty(await searchArea.current.api.validate())) {
        return;
      }

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

    const saveDatas = await grid.current.api.getModifiedRows();
    if (saveDatas.length === 0) {
      P2MessageBox.warn('저장할 데이터가 없습니다.');
      return;
    }

    if (Utils.isNotEmpty(await grid.current.api.validate())) {
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
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <div className="flex flex-row gap-1">
          <label class="text-xl" htmlFor='authGrpId'>권한그룹ID</label>
          <P2Input type="text" id="authGrpId" name="authGrpId" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
        <div className="flex flex-row gap-1">
          <label class="text-xl" htmlFor='authGrpNm'>권한그룹명</label>
          <P2Input type="text" id="authGrpNm" name="authGrpNm" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
      </P2SearchArea>
      <P2GridButtonBar menuProps={props.menuProps} title="권한그룹 목록" onAddRow={onAddRow} onDeleteRow={onDeleteRow} count={count}>
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

export default OneGridPage;
