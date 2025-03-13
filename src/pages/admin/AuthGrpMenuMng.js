import React, { useRef, useState, useEffect, useCallback } from 'react';
import { P2MessageBox } from 'components/control/index';
import { P2Page, P2SearchArea, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import SplitterLayout from 'react-splitter-layout';
import axios from 'axios';

function AuthGrpMenuMng(props) {

  const searchArea = useRef(null);
  const gridAuthGrp = useRef(null);
  const gridMenu = useRef(null);

  const [loading, setLoading] = useState(false);
  const [countAuthGrp, setCountAuthGrp] = useState(0);
  const [countMenu, setCountMenu] = useState(0);

  const colDefAuthGrps = [
    { headerName: 'ID',         field: 'authGrpId', width: 60,  align: "center" },
    { headerName: '권한그룹명', field: 'authGrpNm', width: 200 },
  ];
  const colDefMenus = [
    { headerName: '사용',        field: 'exsistYn',   width: 60 , cellDataType: "checkbox" },
    { headerName: 'ID',          field: 'menuId',     width: 60,  align: "center" },
    { headerName: '메뉴명',      field: 'menuNm',     width: 300, },
    { headerName: '저장\n버튼',  field: 'saveUseYn',  width: 60 , cellDataType: "checkbox" },
    { headerName: '기타\n버튼1', field: 'etcUseYn1',  width: 60 , cellDataType: "checkbox" },
    { headerName: '기타\n버튼2', field: 'etcUseYn2',  width: 60 , cellDataType: "checkbox" },
    { headerName: '기타\n버튼3', field: 'etcUseYn3',  width: 60 , cellDataType: "checkbox" },
    { headerName: '기타\n버튼4', field: 'etcUseYn4',  width: 60 , cellDataType: "checkbox" },
    { headerName: '기타\n버튼5', field: 'etcUseYn5',  width: 60 , cellDataType: "checkbox" },
  ];

  async function onSearch() {
    try {
      setLoading(true);
      gridAuthGrp.current.api.refresh();

      const searchData = searchArea.current.api.get();
      searchData["useYn"] = "Y";

      const res = await axios.post("/api/v1/auth/list", searchData);

      setLoading(false);
      if (res.data.code === "00") {
        gridAuthGrp.current.api.setGridOption("rowData", res.data.data.result);
        setCountAuthGrp(res.data.data.result.length);
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

  async function onSearchMenu() {
    try {
      setLoading(true);
      gridMenu.current.api.refresh();

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
      const res = await axios.put("/api/v1/authGrpMenu/saveAuthGrpMenu", {
        saveDatas: saveDatas
      });

      setLoading(false);
      if (res.data.code === "00") {
        P2MessageBox.success({
          content: '저장이 완료 되었습니다.',
          onOk: () => onSearch(),
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

  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
      </P2SearchArea>
      <div className="w-full">
        <SplitterLayout split="vertical" customClassName="w-full h-[600px]">
          <div className="h-[600px] flex flex-col gap-1">
            <P2GridButtonBar title="권한 그룹 목록" count={countAuthGrp}/>
            <P2AgGrid  
              debug={true}
              ref={gridAuthGrp}
              columnDefs={colDefAuthGrps}
              showStatusColumn={true}
              showCheckedColumn={true}
              onGridReady={onGridReadyAuthGrp}
              onSelectionChanged={onSelectionChangedAuthGrp}
            />
          </div>
          <div className="h-[600px] flex flex-col gap-1">
            <P2GridButtonBar title="메뉴 목록" count={countMenu}/>
            <P2AgGrid ref={gridMenu}
              columnDefs={colDefMenus}
              showStatusColumn={true}
            />
          </div>
        </SplitterLayout>
      </div>
    </P2Page>
  );
}

export default AuthGrpMenuMng;
