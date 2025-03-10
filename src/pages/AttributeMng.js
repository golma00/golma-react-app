import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import SearchTree from '../components/tree/SearchTree.js';
import SplitterLayout from 'react-splitter-layout';
import "react-splitter-layout/lib/index.css";
import "../css/splitter.css";
import axios from 'axios';

function AttributeMng(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);

  const [codeList, setCodeList] = useState([]);
  const [count, setCount] = useState(0);

  const [rowData, setRowData] = useState([]);
  const [rowNode, setRowNode] = useState();
  const [attributeCodeList, setAttributeCodeList] = useState(null);

  const [msgst, setMsgst] = useState(0); // JSON 데이터 저장

  const colDefs = [
      { field: "grpCd",
        headerName: "속성그룹", 
        editable: false, 
        width: 120,
        hide: true,
        align: "left" 
      },
      { field: "grpNm",
        headerName: "속성그룹명", 
        editable: false, 
        align: "left" 
      },
      { field: "cd",
        headerName: "속성코드", 
        editable: true, 
        width: 120,
        align: "left" 
      },
      { field: "cdNm",
        headerName: "속성명", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { field: "cdDesc",
        headerName: "속성 설명", 
        editable: true, 
        width: 250,
        align: "left" 
      },
      { field: "cdRefVal01",
        headerName: "비고 1", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal02",
        headerName: "비고 2", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal03",
        headerName: "비고 3", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal04",
        headerName: "비고 4", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal05",
        headerName: "비고 5", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal06",
        headerName: "비고 6", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal07",
        headerName: "비고 7", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal08",
        headerName: "비고 8", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal09",
        headerName: "비고 9", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "cdRefVal10",
        headerName: "비고 10", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "alignSeq",
        headerName: "순서", 
        editable: true, 
        width: 100,
        align: "right" 
      },
      { field: "useYn",
        headerName: "사용유무", 
        editable: true, 
        width: 100,
        align: "center" 
      },
      { field: "uppperGrpCd",
        headerName: "종속속성 그룹", 
        editable: true, 
        width: 120,
        align: "left" 
      },
      { field: "uppperCd",
        headerName: "종속속성 코드", 
        editable: true, 
        width: 120,
        align: "left" 
      },
      { field: "cdType",
        headerName: "속성 타입", 
        editable: true, 
        width: 100,
        align: "center" 
      },
  ];

  useEffect(() => {
    getCodeList();

    if (msgst === 1) {
      setAttritubeGrpList();
      setMsgst(0);
    }
    else if (msgst === 2) {
      grid.current.api.setGridOption("rowData", structuredClone(rowNode));
      setCount(grid.current.api.getDisplayedRowCount());
      setMsgst(0);
    }
  }, [msgst]);

  const getCodeList = async () => {
    try {
      const res = await axios.get("/api/v1/login/langCd?sysId=ADMIN&grpCd=LANG_CD");
      setCodeList(res.data.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  async function getAttritubeGrpList() {
    try {
      let params = {
        tmp: "temp",
      }
      const res = await axios.post("/api/v1/code/attributeGrpList", params);
      setRowData(res.data.data.result);
      setMsgst(1);
    }
    catch (error) {
      alert('error => ', error);
    }
  }

  function setAttritubeGrpList() {
    var dataList = {rowData}.rowData;
    var rowDataMap = dataList.reduce(function(map, node) {
      map[node.cd] = node;
      map[node.cd].children = [];
      return map;
    }, {});

    var tree = [];
    dataList.forEach(function(node) {
      if (node.grpCd && node.cd !== "ROOT") {
        var parent = rowDataMap[node.grpCd];
        if (parent) {
          parent.children.push(node);
        }
        else {
          tree.push(node);
        }
      }
      else {
        tree.push(node);
      }
    });
    setRowData(tree);
  }

  async function getAttributeList(selectedAttributeId, item) {
    try {
      const params = {
        attributeGrpId: item.selectedNodes[0].props.secondKey,
        attributeId: selectedAttributeId[0],
      }
      const res = await axios.post("/api/v1/code/attributeCodeList", params);
      setRowNode(res.data.data.result);
      setMsgst(2);
    }
    catch (error) {
      alert('error => ', error);
    }
  }

  async function onSearch() {
    getAttritubeGrpList();
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
    });
  }

  function onDeleteRow() {
    console.log("onDeleteRow!!!!");
    grid.current.api.deleteRow(true);
  }
  
  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} onExtBtn1={onExtBtn1} onExtBtn2={onExtBtn2}>
      <P2GridButtonBar title="속성관리" onAddRow={onAddRow} onDeleteRow={onDeleteRow} count={count}>
        <button className="grid-btn">
          <span>임시버튼1</span>
        </button>
        <button className="grid-btn">
          <span>임시버튼2</span>
        </button>
      </P2GridButtonBar>
      <div className="w-full h-[500px]">
        <SplitterLayout split="vertical" percentage={true} primaryMinSize={20} secondaryMinSize={20} secondaryInitialSize={75}>
          <SearchTree rowData={rowData} change={getAttributeList}/>
          <P2AgGrid 
            debug={true}
            ref={grid}
            columnDefs={colDefs}
            showStatusColumn={true}
            showCheckedColumn={true}
          />
        </SplitterLayout>
      </div>
    </P2Page>
  )
}

export default AttributeMng;
