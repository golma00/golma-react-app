import React, { useState, useRef } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar, P2FormArea } from 'components/layout/index';
import { P2Select, P2Input, P2Checkbox, P2Tree, P2InputNumber } from 'components/control/index';
import SplitterLayout from 'react-splitter-layout';
import axios from 'axios';

function TreeFormPage(props) {
  const searchArea = useRef(null);
  const formArea = useRef(null);
  const tree = useRef(null);

  const [loading, setLoading] = useState(false);
  const [codeList, setCodeList] = useState([]);
  const [treeNode, setTreeNode] = useState(null);

  const controllerData = [
    { cd: "1A", cdNm: "일A" },
    { cd: "2A", cdNm: "둘A" },
    { cd: "3A", cdNm: "셋A" },
  ]

  const [rowData, setRowData] = useState([
      { make: "Tesla",  model: "ROOT", price: 64950, electric: "Y", controller: "1A", color: "red", parentModel: "" },
      { make: "Ford",   model: "F-Series", price: 33850, electric: "N", controller: "2A", color: "blue", parentModel: "ROOT" },
      { make: "Toyota", model: "Corolla", price: 29600, electric: "Y", controller: "3A", color: "green", parentModel: "ROOT" },
  ]);

  async function onSearch() {
    console.log(await searchArea.current.api.get());
  }

  async function onSave() {
    const rowData = tree.current.api.getModifiedRowData();
    console.log(rowData);
  }

  function onAddTreeNode() {
    tree.current.api.addChildTreeNode({
      price: 500, electric: "Y", controller: "1A", color: "yellow", make: "신규"
    });
  }

  function onDeleteTreeNode() {
    tree.current.api.deleteTreeNode(tree.current.api.getSelectedTreeNodeKey());
  }

  function nodeTitleFunc(item) {
    // string 이나 function 이나 둘 중 하나만 사용 가능
    // return "make";
    return (item) => `${item["make"]} (${item["model"]})`;
  }

  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='planYear'>계획연도</label>
          <P2Input type="text" id="planYear" name="planYear" className="text-sm bg-white border border-gray-200 rounded-md" />
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='title'>제목</label>
          <P2Input type="text" id="title" name="title" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='period'>기간</label>
          <P2Input type="checkbox" id="period" name="period" className="text-sm bg-white border border-gray-200 rounded-md" changeaftersearch="true" checked={true}/>
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
          <P2Input type="text" id="test" name="test" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
      </P2SearchArea>
      <div className="w-full">
        <SplitterLayout split="vertical" customClassName="w-full h-[600px]">
          <div className="h-[550px] flex flex-col gap-1">
            <P2GridButtonBar title="트리" >
              <button className="grid-btn" onClick={onAddTreeNode}>
                자식 추가
              </button>
              <button className="grid-btn" onClick={onDeleteTreeNode}>
                노드 삭제
              </button>
            </P2GridButtonBar>
            <P2Tree ref={tree} 
              rowData={rowData}
              nodeKeyField={"model"}
              parentKeyField={"parentModel"}
              nodeTitleField={nodeTitleFunc}
              onSelect={(selectedRow, e) => setTreeNode(e.node)}
              defaultExpandedKeys={['ROOT']}
            />
          </div>
          <div className="h-[550px] flex flex-col gap-1">
            <P2GridButtonBar title="트리 상세"/>
            <P2FormArea ref={formArea} className="p2-form-area h-[550px]" treeNode={treeNode}>
              <div className="flex flex-row gap-2">
                <label htmlFor='make' className="w-20">Make</label>
                <P2Input id="make" name="make" className="text-sm bg-white border border-gray-200 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='model' className="w-20">Model</label>
                <P2Input id="model" name="model" className="text-sm bg-white border border-gray-200 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='price' className="w-20">Price</label>
                <P2InputNumber id="price" name="price" className="!w-full text-sm bg-white border border-gray-200 rounded-md" />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='electric' className="w-20">Electric</label>
                <P2Checkbox id="electric" name="electric" className="!w-full text-sm" />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='controller' className="w-20">Controller</label>
                <P2Select id="controller" name="controller" className="!w-full text-sm"
                  defaultOption="BLANK"
                  value=" "
                  datas={controllerData}
                />
              </div>
              <div className="flex flex-row gap-2">
                <label htmlFor='color' className="w-20">Color</label>
                <P2Input id="color" name="color" className="text-sm bg-white border border-gray-200 rounded-md" />
              </div>
            </P2FormArea>
          </div>
        </SplitterLayout>
      </div>
    </P2Page>
  )
}

export default TreeFormPage;
