import React, { useEffect, useState } from "react";
import { P2PageButtonBar } from 'components/index';

function P2Page(props) {

  const [showButtonBar, setShowButtonBar] = useState(true);

  if (props.showButtonBar === false) {
    setShowButtonBar(false);
  }

  const [menuNm, setMenuNm] = useState("");
  const [saveUseYn, setSaveUseYn] = useState(false);

  const [extUseYn1, setExtUseYn1] = useState(false);
  const [extBtnNm1, setExtBtnNm1] = useState("");
  const [extBtnIconVal1, setExtBtnIconVal1] = useState("");

  const [extUseYn2, setExtUseYn2] = useState(false);
  const [extBtnNm2, setExtBtnNm2] = useState("");
  const [extBtnIconVal2, setExtBtnIconVal2] = useState("");

  const [extUseYn3, setExtUseYn3] = useState(false);
  const [extBtnNm3, setExtBtnNm3] = useState("");
  const [extBtnIconVal3, setExtBtnIconVal3] = useState("");

  const [extUseYn4, setExtUseYn4] = useState(false);
  const [extBtnNm4, setExtBtnNm4] = useState("");
  const [extBtnIconVal4, setExtBtnIconVal4] = useState("");

  const [extUseYn5, setExtUseYn5] = useState(false);
  const [extBtnNm5, setExtBtnNm5] = useState("");
  const [extBtnIconVal5, setExtBtnIconVal5] = useState("");

  const [extUseYn6, setExtUseYn6] = useState(false);
  const [extBtnNm6, setExtBtnNm6] = useState("");
  const [extBtnIconVal6, setExtBtnIconVal6] = useState("");

  useEffect(() => {
    setMenuNm("테스트");
    setSaveUseYn(true);
    setExtUseYn1(true);
    setExtBtnNm1("기타1");
    setExtUseYn2(true);
    setExtBtnNm2("기타2");
    setExtUseYn3(true);
  }, []);

  return (
    <div className="flex flex-col w-full h-full gap-1 px-2 py-1">
      {showButtonBar && (
        <P2PageButtonBar 
          menuNm={menuNm} 
          saveUseYn={saveUseYn}
          onSearch={props.onSearch}
          onSave={props.onSave}
          onExtBtn1={props.onExtBtn1}
          onExtBtn2={props.onExtBtn2}
          onExtBtn3={props.onExtBtn3}
          onExtBtn4={props.onExtBtn4}
          onExtBtn5={props.onExtBtn5}
          onExtBtn6={props.onExtBtn6}
          extBtnNm1={extBtnNm1}
          extBtnNm2={extBtnNm2}
          extBtnNm3={extBtnNm3}
          extBtnNm4={extBtnNm4}
          extBtnNm5={extBtnNm5}
          extBtnNm6={extBtnNm6}
          extUseYn1={extUseYn1}
          extUseYn2={extUseYn2}
          extUseYn3={extUseYn3}
          extUseYn4={extUseYn4}
          extUseYn5={extUseYn5}
          extUseYn6={extUseYn6}
          extBtnIconVal1={extBtnIconVal1}
          extBtnIconVal2={extBtnIconVal2}
          extBtnIconVal3={extBtnIconVal3}
          extBtnIconVal4={extBtnIconVal4}
          extBtnIconVal5={extBtnIconVal5}
          extBtnIconVal6={extBtnIconVal6}
        />
      )}
      {props.children}
    </div>
  );
}

export default P2Page;
