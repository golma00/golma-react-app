import React, { useRef, useState, useEffect } from 'react';
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
    { headerName: '권한그룹ID', field: 'authGrpId', width: 100 },
    { headerName: '권한그룹명', field: 'authGrpNm', width: 200 },
  ];
  const colDefMenus = [
    { headerName: '메뉴ID', field: 'menuId', width: 100 },
    { headerName: '메뉴명', field: 'menuNm', width: 200 },
  ];

  async function onSearch() {
    setLoading(true);

    setLoading(false);
  }
  
  async function onSave() {
    setLoading(true);

    setLoading(false);
  }

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
            />
          </div>
          <div className="h-[600px] flex flex-col gap-1">
            <P2GridButtonBar title="메뉴 목록" count={countMenu}/>
            <P2AgGrid ref={gridMenu}
              columnDefs={colDefMenus}
              showStatusColumn={true}
              showCheckedColumn={true}
              onGridReady={onGridReadyMenu}
            />
          </div>
        </SplitterLayout>
      </div>
    </P2Page>
  );
}

export default AuthGrpMenuMng;
