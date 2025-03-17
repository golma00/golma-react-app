import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import { P2Select, P2Input, P2MessageBox, P2Tree } from 'components/control/index';
import SplitterLayout from 'react-splitter-layout';
import "react-splitter-layout/lib/index.css";
import "../css/splitter.css";
import axios from 'axios';
import { useCommonCode } from '../hooks/useCommonCode';
import SearchUpperCodePopup from './SearchUpperCodePopup';

function AttributeMng(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);
  const tree = useRef(null);

  const [codeList, setCodeList] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Tree 영역 조회 데이터
  const [treeNode, setTreeNode] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectionNode, setSectionNode] = useState({selectedRow: [], e: []});

  const [ceGroupList, setCeGroupList] = useState([]);
  const [ceList, setCeList] = useState([]);

  const [isSearchUpperCodePopupVisible, setSearchUpperCodePopupVisible] = useState(false);
  const [selectedAgGridRowData, setSelectedAgGridRowData] = useState(null);
  
  const [upperGrpCombo, setUpperGrpCombo] = useState([]);

  // 임시사용
  const cdTypeCombo = [
    { cd: "C", cdNm: "속성" },      // Code
    { cd: "G", cdNm: "속성그룹" },  // Group
  ];

  const {getCodeDatas} = useCommonCode();

  useEffect(() => {
    //getCodeList();
  }, []);

  const colDefs = [
      { 
        field: "grpCd",
        headerName: "속성그룹", 
        editable: false, 
        width: 120,
        hide: true,
        align: "left" 
      },
      { 
        field: "grpNm",
        headerName: "속성그룹명", 
        editable: false, 
        align: "left" 
      },
      { 
        field: "cd",
        headerName: "속성코드", 
        editable: true, 
        required: true,
        width: 120,
        align: "left" 
      },
      { 
        field: "cdNm",
        headerName: "속성명", 
        editable: true, 
        required: true,
        width: 150,
        align: "left" 
      },
      { 
        field: "cdDesc",
        headerName: "속성 설명", 
        editable: true, 
        width: 250,
        align: "left" 
      },
      { 
        field: "alignSeq",
        headerName: "순서", 
        editable: true, 
        width: 100,
        align: "right",
        cellDataType: "number"
      },
      { 
        field: "useYn",
        headerName: "사용유무", 
        editable: true, 
        width: 110,
        align: "center",
        cellDataType: "checkbox",
      },
      { 
        field: "upperGrpCd",
        headerName: "종속속성\n그룹", 
        editable: false, 
        width: 120,
        align: "left",
        onCellClicked: async (params) => {
          setSelectedAgGridRowData(params.data);
          setSearchUpperCodePopupVisible(true);
        },
        cellDataType: "combo",
      },
      { 
        field: "upperCd",
        headerName: "종속속성\n코드", 
        editable: true, 
        width: 120,
        align: "left",
        onCellClicked: async (params) => {
          setSelectedAgGridRowData(params.data);
          setSearchUpperCodePopupVisible(true);
        },
        cellDataType: "combo",
      },
      { 
        field: "cdType",
        headerName: "속성 타입", 
        editable: true, 
        width: 110,
        align: "center",
        cellDataType: "combo",
        cellEditorParams: { 
          valueField: "cd", 
          displayField: "cdNm", 
          values: cdTypeCombo,
        }
      },
      { 
        field: "cdRefVal01",
        headerName: "비고 1", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal02",
        headerName: "비고 2", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal03",
        headerName: "비고 3", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal04",
        headerName: "비고 4", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal05",
        headerName: "비고 5", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal06",
        headerName: "비고 6", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal07",
        headerName: "비고 7", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal08",
        headerName: "비고 8", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal09",
        headerName: "비고 9", 
        editable: true, 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal10",
        headerName: "비고 10", 
        editable: true, 
        width: 150,
        align: "left" 
      },
  ];

  const getCodeList = async () => {
    try {
      const res = await axios.get("/api/v1/login/langCd?sysId=ADMIN&grpCd=LANG_CD");
      setCodeList(res.data.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  async function onSearch() {
    try {
      setLoading(true);

      const searchData = searchArea.current.api.get();
      const res = await axios.post("/api/v1/code/attributeGrpList", searchData);

      setLoading(false);
      if (res.data.code === "00") {
        setRowData(res.data.data.result);
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
    
    const allRowDatas = await grid.current.api.getAllRowNodes();
    for (let saveData of saveDatas) {
      let checkCnt = 0;
      for (let data of allRowDatas) {
        if (data.data._status != "D" && (data.data.cd == saveData.cd)) {
          checkCnt++;
          if (checkCnt > 1) {
            P2MessageBox.warn('중복된 코드를 등록할 수 없습니다. 확인 후 다시 시도해 주십시오.');
            return;
          }
        }
      }
    }

    P2MessageBox.confirm({
      title: '저장 하시겠습니까?',
      onOk: () => onSaveAction(saveDatas),
      onCancel() {},
    });
  }

  async function onSaveAction(saveDatas) {
    try {
      setLoading(true);
      const res = await axios.put("/api/v1/code/saveAttributeCodeList", {
        saveDatas: saveDatas,
        parentGrpCd: selectedRow.grpCd,
        parentCd: selectedRow.cd,
      });

      setLoading(false);
      if (res.data.code === "00") {
        P2MessageBox.success({
          title: '저장이 완료 되었습니다.',
          onOk: () => {
            onSearch();
            getAttributeList(selectionNode.selectedRow, selectionNode.e);
            setTreeNode(selectionNode.e.node);
          }
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

  function onAddRow() {
    grid.current.api.addRow({
      grpCd: selectedRow.cd,
      grpNm: selectedRow.cdNm,
      useYn: "Y",
      cdType: selectedRow.cd == "ROOT" ? "G" : "C",
    });
  }

  function onDeleteRow() {
    grid.current.api.deleteRow(true);
  }

  async function getAttributeList(selectedAttributeId, item) {
    try {
      grid.current.api.refresh();
      const params = {
        attributeGrpId: item.node.props.dataRef.grpCd,
        attributeId: selectedAttributeId[0],
      }
      if (item.node.props.dataRef) {
        setSelectedRow(item.node.props.dataRef);
      }
      const res = await axios.post("/api/v1/code/attributeCodeList", params);

      if (res.data.code === "00") {
        grid.current.api.setGridOption("rowData", structuredClone(res.data.data.result));
        setCount(grid.current.api.getDisplayedRowCount());
      }
    }
    catch (error) {
      P2MessageBox.error('시스템 오류가 발생했습니다.');
      console.log(error);
    }
  }

  function nodeTitleFunc(item) {
    return (item) => item["cd"] === "ROOT" ? item["cd"] : item["cdNm"] + " (" + item["cd"] + ")";
  }

  async function onGridReady() {
    onSearch();
  
    const commonCodeParmas = {
      elemGrpCd : {
        grpCd : "ROOT",
        cd: "G003",
      },
      upperGrpCd : {
        grpCd : "ROOT",
      },
    };
  
    const elemCdParams = {
      elemCd : {
        grpCd : "ROOT",
        cd: "G004",
      },
    };

    const commonCodeCombo = await getCodeDatas(commonCodeParmas);
    const elemCdCombo = await getCodeDatas(elemCdParams);

    setCeGroupList(commonCodeCombo.elemGrpCd);
    setCeList(elemCdCombo.elemCd);
    
    grid.current.api.setColumnComboDatas("upperGrpCd", commonCodeCombo.upperGrpCd, "grpCd", "grpNm");
    grid.current.api.setColumnComboDatas("upperCd", commonCodeCombo.upperGrpCd, "cd", "cdNm");
  }

  async function elemGrpCdSelectionChanged(e) {
    const elemCdParams = {
      elemCd : {
        grpCd : "ROOT",
        cd: "G004",
        upperGrpCd: "G003",
        upperCd: e.value,
      },
    };

    const elemCdCombo = await getCodeDatas(elemCdParams);
    setCeList(elemCdCombo.elemCd);
  }

  const closeearchUpperCodePopup = () => {
    setSearchUpperCodePopupVisible(false);
  }

  const setUpperCode = async (data) => {
    console.log("setUpperCode data => ", data);
    const selectedNode = await grid.current.api.getSelectedNode();
    selectedNode.setDataValue("upperGrpCd", data.grpCd);
    selectedNode.setDataValue("upperCd", data.cd);
  }
  
  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <div className="flex flex-row gap-1">
          <label className="text-xl" htmlFor='attribGrpId'>속성그룹ID</label>
          <P2Input type="combo" id="attribGrpId" name="attribGrpId" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='ceGroupList'>C/E 그룹</label>
          <P2Select id="ceGroupList" name="ceGroupList" className="w-40 text-sm"
            defaultOption="ALL"
            value=""
            onChange={elemGrpCdSelectionChanged}
            datas={ceGroupList}
          />
        </div>
        <div className="flex flex-row gap-2 justify-center">
          <label htmlFor='ceList'>C/E</label>
          <P2Select id="ceList" name="ceList" className="w-40 text-sm"
            defaultOption="ALL"
            value=""
            datas={ceList}
          />
        </div>
      </P2SearchArea>
      <P2GridButtonBar title="속성관리" onAddRow={onAddRow} onDeleteRow={onDeleteRow} count={count}>
        <button className="grid-btn">
          <span>임시버튼1</span>
        </button>
        <button className="grid-btn">
          <span>임시버튼2</span>
        </button>
      </P2GridButtonBar>
      <div className="w-full h-[500px]">
        <SplitterLayout split="vertical" percentage={true} primaryMinSize={20} secondaryMinSize={20} secondaryInitialSize={75} customClassName='border border-solid '>
          <P2Tree ref={tree} 
            rowData={rowData}
            nodeKeyField={"cd"}
            parentKeyField={"parentCd"}
            nodeTitleField={nodeTitleFunc}
            onSelect={(selectedRow, e) => {
              if (e.selectedNodes.length > 0) {
                setSectionNode({selectedRow: selectedRow, e: e});
                getAttributeList(selectedRow, e);
                setTreeNode(e.node);
              }
              else {
                getAttributeList(selectionNode.selectedRow, selectionNode.e);
                setTreeNode(selectionNode.e.node);
              }
            }}
            defaultExpandedKeys={['ROOT']}
          />
          <P2AgGrid 
            debug={true}
            ref={grid}
            columnDefs={colDefs}
            showStatusColumn={true}
            showCheckedColumn={true}
            onGridReady={onGridReady}
          />
        </SplitterLayout>
      </div>
      {
        isSearchUpperCodePopupVisible && (
          <SearchUpperCodePopup className="w-[800px]"
            onOk={setUpperCode}
            onClose={closeearchUpperCodePopup}
            params={selectedAgGridRowData}
            props={props}
          />
        )
      }
    </P2Page>
  )
}

export default AttributeMng;
