import React, { useState, useEffect } from "react";
import { P2PageButtonBar } from 'components/layout/index';
import { useMenuAuth } from 'hooks/index';
import { Spin } from 'antd';

function P2Page(props) {
  const [loading, setLoading] = useState(false);
  const [showButtonBar, setShowButtonBar] = useState(true);
  const {menuProps} = useMenuAuth();

  useEffect(() => {
    if (props.showButtonBar === false) {
      setShowButtonBar(false);
    }
  }, [props.showButtonBar]);

  useEffect(() => {
    setLoading(props.loading || false);
  }, [props.loading]);

  return (
    <Spin size="large" className="w-full h-full" spinning={loading}>
      <div className={`p2-page ${props.className||''}`}>
        {showButtonBar && (
          <P2PageButtonBar 
            menuNm={menuProps.menuNm} 
            onSearch={props.onSearch}
            searchBtnNm={props.searchBtnNm||""}
            onSave={props.onSave}
            onExtBtn1={props.onExtBtn1}
            onExtBtn2={props.onExtBtn2}
            onExtBtn3={props.onExtBtn3}
            onExtBtn4={props.onExtBtn4}
            onExtBtn5={props.onExtBtn5}
            saveUseYn={menuProps.saveUseYn}
            saveBtnNm={props.saveBtnNm||""}
            extUseYn1={menuProps.extUseYn1}
            extUseYn2={menuProps.extUseYn2}
            extUseYn3={menuProps.extUseYn3}
            extUseYn4={menuProps.extUseYn4}
            extUseYn5={menuProps.extUseYn5}
            extBtnNm1={menuProps.extBtnNm1}
            extBtnNm2={menuProps.extBtnNm2}
            extBtnNm3={menuProps.extBtnNm3}
            extBtnNm4={menuProps.extBtnNm4}
            extBtnNm5={menuProps.extBtnNm5}
            extBtnNm6={menuProps.extBtnNm6}
            extBtnIconVal1={menuProps.extBtnIconVal1}
            extBtnIconVal2={menuProps.extBtnIconVal2}
            extBtnIconVal3={menuProps.extBtnIconVal3}
            extBtnIconVal4={menuProps.extBtnIconVal4}
            extBtnIconVal5={menuProps.extBtnIconVal5}
            manualUrl={menuProps.manualUrl}
          />
        )}
        {props.children}
      </div>
    </Spin>
  );
}

export default P2Page;
