import React, { useRef, useState, useEffect, useCallback } from 'react';
import { P2Page, P2SearchArea, P2GridButtonBar } from 'components/layout/index';
import { P2Input, P2MessageBox } from 'components/control/index';
import { P2AgGrid } from 'components/grid/index';
import SplitterLayout from 'react-splitter-layout';
import axios from 'axios';
import * as Utils from 'utils/Utils';
import * as Validate from 'utils/Validate';

function AuthGrpMenuMng(props) {

  const searchArea = useRef(null);
  const gridAuthGrp = useRef(null);
  const gridMenu = useRef(null);

  const [loading, setLoading] = useState(false);
  const [countAuthGrp, setCountAuthGrp] = useState(0);
  const [countMenu, setCountMenu] = useState(0);

  const visibleFunc = (params) => params.data[params.colDef.field.replace("Use", "Has")] === "Y";
  const textFunc = (params) => params.data[params.colDef.field.replace("UseYn", "BtnNm")];

  const colDefAuthGrps = [
    { headerName: 'ID',         field: 'authGrpId', width: 80,  align: "center" },
    { headerName: '권한그룹명', field: 'authGrpNm', width: 200 },
  ];
  const colDefMenus = [
    { headerName: '사용',        field: 'useYn',      width: 60 , cellDataType: "checkbox", filter: false, editable: true, },
    { headerName: 'ID',          field: 'menuId',     width: 80,  align: "center" },
    { headerName: '메뉴명',      field: 'menuNm',     width: 400, cellClass: "whitespace-pre-wrap" },
    { headerName: '저장\n버튼',  field: 'saveUseYn',  width: 80,  cellDataType: "checkbox", filter: false, editable: true },
    { headerName: '기타\n버튼1', field: 'extUseYn1',  width: 100, cellDataType: "checkbox", filter: false, editable: true, 
      cellRendererParams: { visibleFunc, textFunc }, cellEditorParams: { visibleFunc, textFunc },
      tooltipValueGetter: (params) => params.data["extBtnNm1"]
    },
    { headerName: '기타\n버튼2', field: 'extUseYn2',  width: 100, cellDataType: "checkbox", filter: false, editable: true, 
      cellRendererParams: { visibleFunc, textFunc }, cellEditorParams: { visibleFunc, textFunc },
      tooltipValueGetter: (params) => params.data["extBtnNm2"]
    },
    { headerName: '기타\n버튼3', field: 'extUseYn3',  width: 100, cellDataType: "checkbox", filter: false, editable: true, 
      cellRendererParams: { visibleFunc, textFunc }, cellEditorParams: { visibleFunc, textFunc },
      tooltipValueGetter: (params) => params.data["extBtnNm3"]
    },
    { headerName: '기타\n버튼4', field: 'extUseYn4',  width: 100, cellDataType: "checkbox", filter: false, editable: true, 
      cellRendererParams: { visibleFunc, textFunc }, cellEditorParams: { visibleFunc, textFunc },
      tooltipValueGetter: (params) => params.data["extBtnNm4"]
    },
    { headerName: '기타\n버튼5', field: 'extUseYn5',  width: 100, cellDataType: "checkbox", filter: false, editable: true, 
      cellRendererParams: { visibleFunc, textFunc }, cellEditorParams: { visibleFunc, textFunc },
      tooltipValueGetter: (params) => params.data["extBtnNm5"]
    },
  ];

  useEffect(() => {
    searchArea.current.api.setValid({
      
    });
  }, []);

  async function onSearch() {
    try {
      if (Utils.isNotEmpty(await searchArea.current.api.validate())) {
        return;
      }
      
      setLoading(true);
      gridAuthGrp.current.api.clear();
      gridMenu.current.api?.clear();

      const searchData = searchArea.current.api.get();
      searchData["useYn"] = "Y";

      const res = await axios.post("/api/v1/auth/list", searchData);

      setLoading(false);
      if (res.data.code === "00") {
        gridAuthGrp.current.api.setGridOption("rowData", res.data.data.result);
        setCountAuthGrp(res.data.data.result.length);
        gridAuthGrp.current.api.firstRowSelected();
      }
      else {
        P2MessageBox.error(res.data.message || '시스템 오류가 발생했습니다');
      }
    }
    catch (error) {
      setLoading(false);
      P2MessageBox.error('시스템 오류가 발생했습니다.');
      console.log(error);
    }
  }

  async function onSearchMenu() {
    try {
      setLoading(true);
      gridMenu.current.api.clear();

      const selectedRow = await gridAuthGrp.current.api.getSelectedRow();
      const res = await axios.post("/api/v1/authGrpMenu/authGrpMenuList", selectedRow);

      setLoading(false);
      if (res.data.code === "00") {
        gridMenu.current.api.setGridOption("rowData", res.data.data.result);
        setCountMenu(res.data.data.result.length);
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
    const saveDatas = await gridMenu.current.api.getModifiedRows();
    if (saveDatas.length === 0) {
      P2MessageBox.warn('저장할 데이터가 없습니다.');
      return;
    }

    P2MessageBox.confirm({
      content: '저장 하시겠습니까?',
      onOk: () => onSaveAction(saveDatas),
      onCancel() {},
    });
  }

  async function onSaveAction(saveDatas) {
    setLoading(true);
    try {
      const selectedAuthGrp = await gridAuthGrp.current.api.getSelectedRow();
      const res = await axios.put("/api/v1/authGrpMenu/saveAuthGrpMenu", {
        saveDatas: saveDatas,
        authGrpId: selectedAuthGrp.authGrpId
      });

      setLoading(false);
      if (res.data.code === "00") {
        P2MessageBox.success({
          content: '저장이 완료 되었습니다.',
          onOk: () => onSearchMenu(),
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

  const onGridReadyAuthGrp = useCallback((e) => {
    onSearch();
  }, []);

  const onSelectionChangedAuthGrp = useCallback((e) => {
    onSearchMenu();
  }, []);

  const onCellValueChangedMenu = useCallback((e) => {
    if (e.column.colId === "useYn") {
      e.api.forEachNode((node) => {
        if (node.data.upperMenuId === e.data.menuId) {
          node.setDataValue("useYn", e.newValue);
        }
      });
    }
  }, []);


  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea} >
        <div className="flex flex-row gap-2">
          <label className="text-xl" htmlFor='authGrpId'>권한그룹ID</label>
          <P2Input id="authGrpId" name="authGrpId" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
        <div className="flex flex-row gap-2">
          <label className="text-xl" htmlFor='authGrpNm'>권한그룹명</label>
          <P2Input id="authGrpNm" name="authGrpNm" className="text-sm bg-white border border-gray-200 rounded-md"/>
        </div>
      </P2SearchArea>
      <div className="w-full h-full">
        <SplitterLayout split="vertical" customClassName="w-full h-full" percentage={true} primaryMinSize={20} secondaryMinSize={20} secondaryInitialSize={80} >
          <div className="h-full flex flex-col gap-1">
            <P2GridButtonBar title="권한 그룹 목록" count={countAuthGrp}/>
            <P2AgGrid  
              debug={true}
              ref={gridAuthGrp}
              columnDefs={colDefAuthGrps}
              onGridReady={onGridReadyAuthGrp}
              onSelectionChanged={onSelectionChangedAuthGrp}
            />
          </div>
          <div className="h-full flex flex-col gap-1">
            <P2GridButtonBar title="메뉴 목록" count={countMenu}/>
            <P2AgGrid ref={gridMenu}
              columnDefs={colDefMenus}
              showStatusColumn={true}
              onCellValueChanged={onCellValueChangedMenu}
            />
          </div>
        </SplitterLayout>
      </div>
    </P2Page>
  );
}

export default AuthGrpMenuMng;
