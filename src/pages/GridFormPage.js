import React, { useState, useRef } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar, P2FormArea } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import { P2Select } from 'components/control/index';
import SplitterLayout from 'react-splitter-layout';
import axios from 'axios';

function GridFormPage(props) {

  const searchArea = useRef(null);
  const grid = useRef(null);
  const formArea = useRef(null);

  const [codeList, setCodeList] = useState([]);

  const [rowNode, setRowNode] = useState();

  const controllerData = [
    { cd: "1A", cdNm: "일A" },
    { cd: "2A", cdNm: "둘A" },
    { cd: "3A", cdNm: "셋A" },
  ]

  const colDefs = [
    { field: "make", headerName: "Make", },
    { field: "model", headerName: "Model", },
    { field: "price", headerName: "Price", cellDataType: "number" },
    { field: "electric", headerName: "Electric", cellDataType: "checkbox" },
    { field: "controller", headerName: "Controller", cellDataType: "combo", 
      cellEditorParams: { valueField: "cd", displayField: "cdNm", values: controllerData } }
  ];

  const [count, setCount] = useState(0);

  const rowData = [
      { make: "Tesla",  model: "Model Y", price: 64950, electric: "Y", controller: "1A", color: "red" },
      { make: "Ford",   model: "F-Series", price: 33850, electric: "N", controller: "2A", color: "blue" },
      { make: "Toyota", model: "Corolla", price: 29600, electric: "Y", controller: "3A", color: "green" },
  ];

  function loadData() {
    grid.current.api.refresh();
    grid.current.api.setGridOption("rowData", structuredClone(rowData));
    grid.current.api.firstRowSelected();

    setCount(grid.current.api.getDisplayedRowCount());
  }

  async function onSearch() {
    loadData();
    console.log(await searchArea.current.api.get());
  }

  async function onSave() {
    console.log(await grid.current.api.getSelectedNode());
  }

  async function onSelectionChanged(event) {
    setRowNode(await event.api.getSelectedNode());
  }

  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='planYear'>계획연도</label>
          <input type="text" id="planYear" name="planYear" className="text-sm bg-white border border-gray-200 rounded-md" />
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
          <P2Select id="ceGroup" name="ceGroup" className="w-40 text-sm"
            defaultOption="ALL"
            value=""
            datas={codeList}
          />
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='test'>테스트</label>
          <input type="text" id="test" name="test" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
      </P2SearchArea>
      <div className="w-full">
        <SplitterLayout split="vertical" customClassName="w-full h-[600px]">
          <div className="h-[550px]">
            <P2GridButtonBar title="그리드" count={count}/>
            <P2AgGrid 
              debug={true}
              ref={grid}
              columnDefs={colDefs}
              showStatusColumn={true}
              showCheckedColumn={true}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
          <div className="h-[550px]">
            <P2GridButtonBar title="그리드 상세"/>
            <P2FormArea ref={formArea} className="p2-form-area h-[550px]" rowNode={rowNode} gridRef={grid}>
              <div className="flex flex-row gap-2">
                <label htmlFor='make' className="w-20">Make</label>
                <input type="text" id="make" name="make" className="text-sm bg-white border border-gray-200 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='model' className="w-20">Model</label>
                <input type="text" id="model" name="model" className="text-sm bg-white border border-gray-200 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='price' className="w-20">Price</label>
                <input type="text" id="price" name="price" className="text-sm bg-white border border-gray-200 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='electric' className="w-20">Electric</label>
                <input type="checkbox" id="electric" name="electric" className="text-sm bg-white border border-gray-200 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='controller' className="w-20">Controller</label>
                <P2Select id="controller" name="controller" className="w-40 text-sm"
                  defaultOption="BLANK"
                  value=" "
                  datas={controllerData}
                />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='color' className="w-20">Color</label>
                <input type="text" id="color" name="color" className="text-sm bg-white border border-gray-200 rounded-md" />
              </div>
            </P2FormArea>
          </div>
        </SplitterLayout>
      </div>
    </P2Page>
  )
}

export default GridFormPage;
