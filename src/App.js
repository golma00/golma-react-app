import React, { useState, useRef, useEffect } from 'react'
import { P2AgGrid, P2SearchArea, P2Select } from 'components/index';
import axios from 'axios';
import './App.css'

function App() {
  const searchArea = useRef(null);
  const selectCeGroup = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  const [codeValue, setCodeValue] = useState("KR");
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
    console.log(textValue);
  }
  
  return (
    <>
      <div className="flex flex-row w-full hd gap-2">
        <button onClick={loadData}>Load Data</button>
        <button onClick={addData}>Add Data</button>
        <button onClick={allRowNodes}>All Data</button>
        <button onClick={insertedRowNodes}>Insert Data</button>
        <button onClick={search}>Search</button>
        <P2Select name="ceGroup1" className="w-40" 
          defaultOption="ALL"
          value={codeValue}
          datas={codeList}
        />
        <input type="text" name="title111" className="bg-white border border-gray-200 rounded-md"/>
      </div>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <label>계획연도</label>
        <input type="text" name="planYear" className="bg-white border border-gray-200 rounded-md" value={textValue} onChange={(e) => setTextValue(e.target.value)}/>
        <label>제목</label>
        <input type="text" name="title" className="bg-white border border-gray-200 rounded-md"/>
        <label>기간</label>
        <input type="checkbox" name="period" className="bg-white border border-gray-200 rounded-md" changeaftersearch="true" checked={true}/>
        <label>C/E 그룹</label>
        <P2Select name="ceGroup" className="w-40" ref={selectCeGroup}
          defaultOption="ALL"
          value="ALL"
          datas={codeList}
        />
        <label>테스트</label>
        <input type="text" name="test" className="bg-white border border-gray-200 rounded-md"/>
      </P2SearchArea>
      <div style={{ flex: 0, width: "100%", height: "500px" }}>
        <P2AgGrid 
          columnDefs={colDefs}
          showStatusColumn={true}
          showCheckedColumn={true}
          api={setGridApi}
        />
      </div>
    </>
  )
}

export default App
