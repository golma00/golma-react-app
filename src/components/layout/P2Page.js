import React, { useState } from "react";
import { P2PageButtonBar } from 'components/layout/index';

function P2Page(props) {

  const [showButtonBar, setShowButtonBar] = useState(true);

  if (props.showButtonBar === false) {
    setShowButtonBar(false);
  }

  return (
    <div className="flex flex-col w-full h-full gap-1 px-2 py-1">
      {showButtonBar && (
        <P2PageButtonBar 
          menuNm={props.menuProps.menuNm} 
          saveUseYn={props.menuProps.auth.saveUseYn}
          onSearch={props.onSearch}
          onSave={props.onSave}
          onExtBtn1={props.onExtBtn1}
          onExtBtn2={props.onExtBtn2}
          onExtBtn3={props.onExtBtn3}
          onExtBtn4={props.onExtBtn4}
          onExtBtn5={props.onExtBtn5}
          onExtBtn6={props.onExtBtn6}
          extBtnNm1={props.menuProps.auth.extBtnNm1}
          extBtnNm2={props.menuProps.auth.extBtnNm2}
          extBtnNm3={props.menuProps.auth.extBtnNm3}
          extBtnNm4={props.menuProps.auth.extBtnNm4}
          extBtnNm5={props.menuProps.auth.extBtnNm5}
          extBtnNm6={props.menuProps.auth.extBtnNm6}
          extUseYn1={props.menuProps.auth.extUseYn1}
          extUseYn2={props.menuProps.auth.extUseYn2}
          extUseYn3={props.menuProps.auth.extUseYn3}
          extUseYn4={props.menuProps.auth.extUseYn4}
          extUseYn5={props.menuProps.auth.extUseYn5}
          extUseYn6={props.menuProps.auth.extUseYn6}
          extBtnIconVal1={props.menuProps.auth.extBtnIconVal1}
          extBtnIconVal2={props.menuProps.auth.extBtnIconVal2}
          extBtnIconVal3={props.menuProps.auth.extBtnIconVal3}
          extBtnIconVal4={props.menuProps.auth.extBtnIconVal4}
          extBtnIconVal5={props.menuProps.auth.extBtnIconVal5}
          extBtnIconVal6={props.menuProps.auth.extBtnIconVal6}
        />
      )}
      {props.children}
    </div>
  );
}

export default P2Page;
