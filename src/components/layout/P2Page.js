import React, { useState, useEffect } from "react";
import { P2PageButtonBar } from 'components/layout/index';
import { Spin } from 'antd';

function P2Page(props) {
  const [loading, setLoading] = useState(false);
  const [showButtonBar, setShowButtonBar] = useState(true);

  if (props.showButtonBar === false) {
    setShowButtonBar(false);
  }

  useEffect(() => {
    setLoading(props.loading || false);
  }, [props.loading]);

  return (
    <Spin size="large" className="w-full h-full" spinning={loading}>
      <div className="p2-page">
        {showButtonBar && (
          <P2PageButtonBar 
            menuNm={props.menuProps.menuNm} 
            onSearch={props.onSearch}
            onSave={props.onSave}
            onExtBtn1={props.onExtBtn1}
            onExtBtn2={props.onExtBtn2}
            onExtBtn3={props.onExtBtn3}
            onExtBtn4={props.onExtBtn4}
            onExtBtn5={props.onExtBtn5}
            saveUseYn={props.menuProps.saveUseYn}
            extUseYn1={props.menuProps.extUseYn1}
            extUseYn2={props.menuProps.extUseYn2}
            extUseYn3={props.menuProps.extUseYn3}
            extUseYn4={props.menuProps.extUseYn4}
            extUseYn5={props.menuProps.extUseYn5}
            extBtnNm1={props.menuProps.extBtnNm1}
            extBtnNm2={props.menuProps.extBtnNm2}
            extBtnNm3={props.menuProps.extBtnNm3}
            extBtnNm4={props.menuProps.extBtnNm4}
            extBtnNm5={props.menuProps.extBtnNm5}
            extBtnNm6={props.menuProps.extBtnNm6}
            extBtnIconVal1={props.menuProps.extBtnIconVal1}
            extBtnIconVal2={props.menuProps.extBtnIconVal2}
            extBtnIconVal3={props.menuProps.extBtnIconVal3}
            extBtnIconVal4={props.menuProps.extBtnIconVal4}
            extBtnIconVal5={props.menuProps.extBtnIconVal5}
            manualUrl={props.menuProps.manualUrl}
          />
        )}
        {props.children}
      </div>
    </Spin>
  );
}

export default P2Page;
