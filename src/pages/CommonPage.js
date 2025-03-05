import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { P2Page, P2AgGrid, P2SearchArea, P2Select, P2GridButtonBar } from 'components/index';
import axios from 'axios';

function CommonPage() {
  const searchArea = useRef(null);
  const selectCeGroup = useRef(null);
  const selectCeGroup2 = useRef(null);
  const grid = useRef(0);

  const [textValue, setTextValue] = useState("test");

  const [codeList, setCodeList] = useState([]);
  const [count, setCount] = useState(0);

  const rowData = [
      { make: "Tesla",  model: "Model Y", price: 64950, electric: "Y", controller: "1A" },
      { make: "Ford",   model: "F-Series", price: 33850, electric: "N", controller: "2A" },
      { make: "Toyota", model: "Corolla", price: 29600, electric: "Y", controller: "3A" },
  ];

  const controllerData = [
    { cd: "1A", cdNm: "일A" },
    { cd: "2A", cdNm: "둘A" },
    { cd: "3A", cdNm: "셋A" },
  ]

  const colDefs = [
      { field: "make", headerName: "Make", editable: true, align: "center" },
      { field: "model", headerName: "Model", editable: true, },
      { field: "price", headerName: "Price", editable: true, cellDataType: "number" },
      { field: "electric", headerName: "Electric", editable: true, cellDataType: "checkbox" },
      { field: "controller", headerName: "Controller", editable: true, cellDataType: "combo", 
        cellEditorParams: { valueField: "cd", displayField: "cdNm", values: controllerData } }
  ];

  useEffect(() => {
    getCodeList();
  }, []);

  const getCodeList = async () => {
    try {
      const res = await axios.get("/api/v1/login/langCd?sysId=ADMIN&grpCd=LANG_CD");
      setCodeList(res.data.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  function loadData() {
    grid.current.api.refresh();
    grid.current.api.setGridOption("rowData", structuredClone(rowData));

    setCount(grid.current.api.getDisplayedRowCount());
  }

  async function onSearch() {
    loadData();
    console.log(await searchArea.current.api.get());
  }

  async function onSave() {
    console.log("onSave!!!!");
    console.log(await grid.current.api.getAllRowNodes());
    console.log(await grid.current.api.getInsertedRowNodes());
  }

  function onExtBtn1() {
    console.log("onExtBtn1!!!!");
  }

  function onExtBtn2() {
    console.log("onExtBtn2!!!!");
  }

  function onAddRow() {
    console.log("onAddRow!!!!");
    grid.current.api.addRow({
      make: "123",
      model: "RED",
      price: 30000,
      electric: false
    });
  }

  function onDeleteRow() {
    console.log("onDeleteRow!!!!");
    grid.current.api.deleteRow(true);
  }
  
  return (
    <P2Page onSearch={onSearch} onSave={onSave} onExtBtn1={onExtBtn1} onExtBtn2={onExtBtn2}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='planYear'>계획연도</label>
          <input type="text" id="planYear" name="planYear" className="text-sm bg-white border border-gray-200 rounded-md" value={textValue} onChange={(e) => setTextValue(e.target.value)}/>
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='title'>제목</label>
          <input type="text" id="title" name="title" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='period'>기간</label>
          <input type="checkbox" id="period" name="period" className="text-sm bg-white border border-gray-200 rounded-md" changeaftersearch="true" checked={true}/>
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='ceGroup'>C/E 그룹</label>
          <P2Select id="ceGroup" name="ceGroup" className="w-40 text-sm" ref={selectCeGroup}
            defaultOption="ALL"
            value=""
            datas={codeList}
          />
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='ceGroup2'>C/E 그룹2</label>
          <P2Select id="ceGroup2" name="ceGroup2" className="w-40 text-sm" ref={selectCeGroup2}
            value={["KR"]}
            isMulti={true}
            datas={codeList}
            />
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='test'>테스트</label>
          <input type="text" id="test" name="test" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
      </P2SearchArea>
      <P2GridButtonBar title="테스트" onAddRow={onAddRow} onDeleteRow={onDeleteRow} count={count}>
        <button className="grid-btn">
          <span>임시버튼1</span>
        </button>
        <button className="grid-btn">
          <span>임시버튼2</span>
        </button>
      </P2GridButtonBar>
      <div className="w-full h-[500px]">
        <P2AgGrid
          debug={true}
          ref={grid}
          columnDefs={colDefs}
          showStatusColumn={true}
          showCheckedColumn={true}
        />
      </div>
    </P2Page>
  )
}

export default CommonPage;
