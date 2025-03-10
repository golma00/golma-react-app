import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import SearchTree from '../components/tree/SearchTree.js';
import axios from 'axios';
import SplitterLayout from 'react-splitter-layout';
import "react-splitter-layout/lib/index.css";
import "../css/splitter.css";

function AttributeMng(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);

  const [codeList, setCodeList] = useState([]);
  const [count, setCount] = useState(0);

  const [rowData, setRowData] = useState([]);
  const [attributeCodeList, setAttributeCodeList] = useState(null);

  const [msgst, setMsgst] = useState(0); // JSON 데이터 저장

  const colDefs = [
      { field: "GRP_CD",
        headerName: "속성그룹", 
        editable: true, 
        width: 120,
        align: "left" 
      },
      { field: "GRP_NM",
        headerName: "속성그룹명", 
        editable: true, 
        hide: true,
        align: "left" 
      },
      { field: "CD",
        headerName: "속성", 
        editable: true, 
        width: 120,
        align: "left" 
      },
      { field: "CD_NM",
        headerName: "속성명", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { field: "CD_DESC",
        headerName: "속성 설명", 
        editable: true, 
        width: 250,
        align: "left" 
      },
      { field: "CD_REF_VAL_01",
        headerName: "비고 1", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_02",
        headerName: "비고 2", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_03",
        headerName: "비고 3", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_04",
        headerName: "비고 4", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_05",
        headerName: "비고 5", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_06",
        headerName: "비고 6", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_07",
        headerName: "비고 7", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_08",
        headerName: "비고 8", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_09",
        headerName: "비고 9", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "CD_REF_VAL_10",
        headerName: "비고 10", 
        editable: true, 
        width: 200,
        align: "left" 
      },
      { field: "ALIGN_SEQ",
        headerName: "순서", 
        editable: true, 
        width: 100,
        align: "right" 
      },
      { field: "USE_YN",
        headerName: "사용유무", 
        editable: true, 
        width: 100,
        align: "center" 
      },
      { field: "UPPPER_GRP_CD",
        headerName: "종속 속성그룹", 
        editable: true, 
        width: 120,
        align: "left" 
      },
      { field: "UPPPER_CD",
        headerName: "종속 속성", 
        editable: true, 
        width: 120,
        align: "left" 
      },
      { field: "CD_TYPE",
        headerName: "속성 타입", 
        editable: true, 
        width: 100,
        align: "left" 
      },
  ];

  useEffect(() => {
    getCodeList();

    if (msgst === 1) {
      setAttritubeGrpList();
      setMsgst(0);
    }
    else if (msgst === 2) {
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
      let responce = await fetch("/api/v1/code/attributeGrpList", {
                             method: 'POST',
                             headers: {
                               "Content-Type":"application/json; charset=utf-8"
                             },
                             body: JSON.stringify(params)
                           })
                           .then(async (res) => {
                             let res_data = await res.json();
                             setRowData(res_data.data.result);
                             setMsgst(1);
                           });
    }
    catch (error) {
      alert('error => ',error);
    }
  }

  function setAttritubeGrpList() {
    var dataList = {rowData}.rowData;
    var rowDataMap = dataList.reduce(function(map, node) {
      map[node.CD] = node;
      map[node.CD].children = [];
      return map;
    }, {});

    var tree = [];
    dataList.forEach(function(node) {
      if (node.GRP_CD && node.CD !== "ROOT") {
        var parent = rowDataMap[node.GRP_CD];
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
    console.log("tree => ", tree);
    setRowData(tree);
  }

  async function getAttributeList(a) {
    console.log("a => ", a);
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
