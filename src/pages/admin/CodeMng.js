import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import { P2Select, P2Input, P2MessageBox, P2Tree } from 'components/control/index';
import SplitterLayout from 'react-splitter-layout';
import "react-splitter-layout/lib/index.css";
import "../../css/splitter.css";
import axios from 'axios';
import { useCommonCode } from '../../hooks/useCommonCode';
import SearchUpperCodePopup from './SearchUpperCodePopup';
import * as Utils from 'utils/Utils';
import { insertStatus } from 'components/grid/P2AgGrid';

function CodeMng(props) {
  const searchArea = useRef(null);
  const grid = useRef(0);
  const tree = useRef(null);

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Tree 영역 조회 데이터
  const [treeNode, setTreeNode] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectionNode, setSectionNode] = useState({selectedRow: [], e: []});
  
  const [cdType, setCdType] = useState([]);
  const [upperGrpCdCombo, setUpperGrpCdCombo] = useState([]);

  const [isSearchUpperCodePopupVisible, setSearchUpperCodePopupVisible] = useState(false);
  const [selectedAgGridRowData, setSelectedAgGridRowData] = useState(null);

  //코드 조회용 공통 function
  const {getCodeDatas} = useCommonCode();

  useEffect(() => {
  }, []);

  const colDefs = [
      { 
        field: "grpCd",
        headerName: "그룹코드", 
        editable: false, 
        width: 120,
        hide: true,
        align: "left",
        pinned: "left",
      },
      { 
        field: "grpNm",
        headerName: "그룹코드명", 
        editable: false, 
        width: 120,
        align: "left",
        pinned: "left",
      },
      { 
        field: "cd",
        headerName: "코드", 
        editable: (params) => params.data._status == insertStatus,
        required: true,
        width: 120,
        align: "left",
        pinned: "left",
        invalid: (params) => {
          if (params && Utils.isEmpty(params.data.cd)) {
            return "필수 입력 컬럼에 값이 존재하지않습니다1.";
          }
          return "";
        },
      },
      { 
        field: "cdNm",
        headerName: "코드명", 
        editable: true, 
        required: true,
        width: 150,
        align: "left",
        pinned: "left",
        invalid: (params) => {
          if (params && Utils.isEmpty(params.data.cdNm)) {
            return "필수 입력 컬럼에 값이 존재하지않습니다2.";
          }
          return "";
        },
      },
      { 
        field: "cdDesc",
        headerName: "코드 설명", 
        editable: true, 
        width: 250,
        align: "left",
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
        headerName: "종속\n그룹코드", 
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
        headerName: "종속 코드", 
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
        field: "cdType",
        headerName: "코드 타입", 
        editable: true, 
        width: 110,
        align: "center",
        cellDataType: "combo",
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
  
  const [columnDefs, setColumnDefs] = useState(colDefs);

  function setHeaderNames(parentData) {
    var columnDefinition = grid.current.api.getGridOption("columnDefs");
    columnDefinition.forEach((colDef) => {
      if (colDef.field && colDef.field.startsWith("cdRefVal")) {
        if (parentData && parentData[colDef.field]) {
          colDef.headerName = parentData[colDef.field];
        }
        else {
          colDef.headerName = "비고 " + colDef.field.slice(-2);
        }
      }
    });
    grid.current.api.setGridOption("columnDefs", columnDefinition);
  }

  // 다른 그리드 세팅 이후 마지막에 실행해주어야 적용됨
  function setGridComboDatas() {
    grid.current.api.setColumnComboDatas("upperGrpCd", upperGrpCdCombo, "grpCd", "grpNm");
    grid.current.api.setColumnComboDatas("upperCd", upperGrpCdCombo, "cd", "cdNm");
    grid.current.api.setColumnComboDatas("cdType", cdType, "cd", "cdNm");
  }

  async function onSearch() {
    try {
      setLoading(true);
      tree.current.api.refresh();
      grid.current.api.refresh();

      const searchData = searchArea.current.api.get();
      const res = await axios.post("/api/v1/code/getGrpCodeList", searchData);

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

    if (Utils.isNotEmpty(await grid.current.api.validate())) {
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
      const res = await axios.put("/api/v1/code/saveCommonCodeList", {
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
            getCommonCodeList(selectionNode.selectedRow, selectionNode.e);
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
    if(Utils.isEmpty(selectedRow)){
      P2MessageBox.warn('그룹코드가 선택되지않았습니다.\n선택 후 다시 시도해주십시오.');
      return false;
    }

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

  async function getCommonCodeList(selectedCodeId, item) {
    try {
      grid.current.api.refresh();
      const params = {
        grpCodeId: item.node.props.dataRef.grpCd,
        codeId: selectedCodeId[0],
      }
      if (item.node.props.dataRef) {
        setSelectedRow(item.node.props.dataRef);
      }
      const res = await axios.post("/api/v1/code/getCommonCodeList", params);

      if (res.data.code === "00") {
        grid.current.api.setGridOption("rowData", structuredClone(res.data.data.result));
        grid.current.api.firstRowSelected();

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

  function onSelect(selectedRow, e) {
    if (e.selectedNodes.length > 0) {
      setSectionNode({selectedRow: selectedRow, e: e});
      getCommonCodeList(selectedRow, e);
      setTreeNode(e.node);
      setHeaderNames(e.node.props.dataRef);
      setGridComboDatas();
    }
    else {
      getCommonCodeList(selectionNode.selectedRow, selectionNode.e);
      setTreeNode(selectionNode.e.node);
      setHeaderNames(e.node.props.dataRef);
      setGridComboDatas();
    }
  }

  async function onGridReady() {
    onSearch();
  
    //불러올 공통 코드 개수만큼 Object 생성
    const commonCodeParams = {
      cdType: {
        grpCd : "ROOT",
        cd : "G001",
      },
      upperGrpCd : {
        grpCd : "ROOT",
      },
    };
    //한번 조회로 모든 결과 불러오기
    const commonCodeCombo = await getCodeDatas(commonCodeParams);
    //불러온 조회값에서 각각 필요한 데이터 뽑아서 UseSate 변수에 set
    setCdType(commonCodeCombo.cdType);
    setUpperGrpCdCombo(commonCodeCombo.upperGrpCd);
  }

  const closeearchUpperCodePopup = () => {
    setSearchUpperCodePopupVisible(false);
  }

  const setUpperCode = async (data) => {
    const selectedNode = await grid.current.api.getSelectedNode();
    selectedNode.setDataValue("upperGrpCd", data.grpCd);
    selectedNode.setDataValue("upperCd", data.cd);
  }
  
  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <div className="flex flex-row gap-1">
          <label className="text-xl" htmlFor='attribGrpId'>그룹코드ID</label>
          <P2Input type="combo" id="attribGrpId" name="attribGrpId" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
      </P2SearchArea>
      <P2GridButtonBar title="코드관리" onAddRow={onAddRow} onDeleteRow={onDeleteRow} count={count} menuProps={props.menuProps}>
      </P2GridButtonBar>
      <div className="w-full h-[500px]">
        <SplitterLayout split="vertical" percentage={true} primaryMinSize={20} secondaryMinSize={20} secondaryInitialSize={80}>
          <P2Tree ref={tree} 
            rowData={rowData}
            nodeKeyField={"cd"}
            parentKeyField={"parentCd"}
            nodeTitleField={nodeTitleFunc}
            onSelect={onSelect}
            defaultExpandedKeys={['ROOT']}
          />
          <P2AgGrid 
            debug={true}
            ref={grid}
            columnDefs={columnDefs}
            showStatusColumn={true}
            showCheckedColumn={true}
            onGridReady={onGridReady}
          />
        </SplitterLayout>
      </div>
      <SearchUpperCodePopup className="w-[800px]"
        visible={isSearchUpperCodePopupVisible}
        onOk={setUpperCode}
        onClose={closeearchUpperCodePopup}
        params={selectedAgGridRowData}
        props={props}
      />
    </P2Page>
  )
}

export default CodeMng;
