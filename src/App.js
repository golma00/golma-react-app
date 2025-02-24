import React, { useState, useRef, useEffect } from 'react'
import { P2AgGrid, P2SearchArea, P2Select } from 'components/index';
import axios from 'axios';
import './App.css'

function App() {
  const searchArea = useRef(null);
  const selectCeGroup = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  const [codeValue, setCodeValue] = useState("KR");

  const [codeList, setCodeList] = useState([]);

  const rowData = [
      { make: "Tesla",  model: "Model Y", price: 64950, electric: true },
      { make: "Ford",   model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  const colDefs = [
      { field: "make", headerName: "Make", editable: true },
      { field: "model", headerName: "Model", editable: true },
      { field: "price", headerName: "Price", editable: true },
      { field: "electric", headerName: "Electric", editable: true }
  ];

  useEffect(() => {
    getCodeList();
  }, []);

  const getCodeList = async () => {
    const res = await axios.get("/api/v1/login/langCd?sysId=ADMIN&grpCd=LANG_CD");
    setCodeList(res.data.data.result);
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
    setCodeValue("EN");
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
        <input type="text" name="planYear" className="bg-white border border-gray-200 rounded-md" value={"2025"}/>
        <label>제목</label>
        <input type="text" name="title" className="bg-white border border-gray-200 rounded-md"/>
        <label>기간</label>
        <input type="checkbox" name="period" className="bg-white border border-gray-200 rounded-md" changeAfterSearch={true} checked={true}/>
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
          api={setGridApi}
        />
      </div>
    </>
  )
}

export default App
