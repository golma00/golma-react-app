import React, { useState, useRef, useEffect } from 'react'
import { P2AgGrid, P2SearchArea, P2Select } from 'components/index';
import axios from 'axios';
import './App.css'

function App() {
  const searchArea = useRef(null);
  const selectCeGroup = useRef(null);
  const selectCeGroup2 = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  const [textValue, setTextValue] = useState("test");

  const [codeList, setCodeList] = useState([]);

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
      { field: "make", headerName: "Make", editable: true, },
      { field: "model", headerName: "Model", editable: true, },
      { field: "price", headerName: "Price", editable: true, cellDataType: "number" },
      { field: "electric", headerName: "Electric", editable: true, cellDataType: "checkbox" },
      { field: "controller", headerName: "Controller", editable: true, cellDataType: "combo", 
        cellEditorParams: { valueField: "cd", displayField: "cdNm", values: controllerData } }
  ];

  useEffect(() => {
    getCodeList();
  }, []);

  useEffect(() => {
    console.log(selectCeGroup.current);
  }, [selectCeGroup.current]);

  const getCodeList = async () => {
    try {
      const res = await axios.get("/api/v1/login/langCd?sysId=ADMIN&grpCd=LANG_CD");
      setCodeList(res.data.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  function loadData() {
    gridApi.refresh();
    gridApi.setGridOption("rowData", rowData);
  }

  function addData() {
    gridApi.addRow({
      make: "123",
      model: "RED",
      price: 30000,
      electric: false
    });
  }

  async function allRowNodes() {
    console.log(await gridApi.getAllRowNodes());
  }

  async function insertedRowNodes() {
    console.log(await gridApi.getInsertedRowNodes());
    console.log(selectCeGroup.current.api.setSelectedIndex(2));
  }

  function onSearch(searchData) {
    console.log(searchData);
  }

  async function search() {
    await searchArea.current.api.setValue("test", "Eeeee");
    console.log(await searchArea.current.api.get());
  }
  
  return (
    <div className="flex flex-col w-full gap-1 px-2 py-1">
      <div className="flex flex-row w-full h-8 gap-1 justify-end">
        <button className="common-btn" onClick={loadData}>Load Data</button>
        <button className="common-btn" onClick={addData}>Add Data</button>
        <button className="common-btn" onClick={allRowNodes}>All Data</button>
        <button className="common-btn" onClick={insertedRowNodes}>Insert Data</button>
        <button className="common-btn" onClick={search}>Search</button>
        <P2Select name="ceGroup1" className="w-40 text-sm" 
          defaultOption="ALL"
          isMulti={true}
          value={["KR"]}
          datas={codeList}
        />
      </div>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <label class="text-xl">계획연도</label>
        <input type="text" name="planYear" className="text-sm bg-white border border-gray-200 rounded-md" value={textValue} onChange={(e) => setTextValue(e.target.value)}/>
        <label>제목</label>
        <input type="text" name="title" className="text-sm bg-white border border-gray-200 rounded-md"/>
        <label>기간</label>
        <input type="checkbox" name="period" className="text-sm bg-white border border-gray-200 rounded-md" changeaftersearch="true" checked={true}/>
        <label>C/E 그룹</label>
        <P2Select name="ceGroup" className="w-40 text-sm" ref={selectCeGroup}
          defaultOption="ALL"
          value=""
          datas={codeList}
        />
        <label>C/E 그룹2</label>
        <P2Select name="ceGroup2" className="w-40 text-sm" ref={selectCeGroup2}
          value={["KR"]}
          isMulti={true}
          datas={codeList}
        />
        <label>테스트</label>
        <input type="text" name="test" className="text-sm bg-white border border-gray-200 rounded-md"/>
      </P2SearchArea>
      <div className="w-full h-[500px]">
        <P2AgGrid 
          debug={true}
          columnDefs={colDefs}
          showStatusColumn={true}
          showCheckedColumn={true}
          api={setGridApi}
        />
      </div>
    </div>
  )
}

export default App
