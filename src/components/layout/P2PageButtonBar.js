import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Utils from 'utils/Utils';
import { P2MessageBox } from 'components/control/index';

function P2PageButtonBar(props) {

  function onManualClick() {
    window.open(props.manualUrl, '_blank');
  }

  function onBugClick() {
    P2MessageBox.info("버그 신고 기능은 아직 준비중입니다.");
  }

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="flex flex-row w-full h-8 gap-1 justify-start">
        <FontAwesomeIcon icon="fa-circle" className="self-center pr-1" size="xs"/>
        <span className="text-xl self-center font-bold text-ellipsis whitespace-nowrap">{props.menuNm}</span>
      </div>
      <div className="flex flex-row w-full h-8 gap-1 justify-end">
        <button className="common-btn" onClick={props.onSearch}>
          <FontAwesomeIcon icon="fa-magnifying-glass" className="pr-1" size="sm"/>
          <span>조회</span>
        </button>
        <button className={`common-btn ${props.saveUseYn === "Y" ? "" : "hidden"}`} onClick={props.onSave}>
          <FontAwesomeIcon icon="fa-pen" className="pr-1" size="sm"/>
          <span>저장</span>
        </button>
        <button className={`common-btn ${props.extUseYn1 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn1}>
          <FontAwesomeIcon icon={props.extBtnIconVal1 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm1 || "기타1"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn2 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn2}>
          <FontAwesomeIcon icon={props.extBtnIconVal2 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm2 || "기타2"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn3 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn3}>
          <FontAwesomeIcon icon={props.extBtnIconVal3 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm3 || "기타3"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn4 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn4}>
          <FontAwesomeIcon icon={props.extBtnIconVal4 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm4 || "기타4"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn5 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn5}>
          <FontAwesomeIcon icon={props.extBtnIconVal5 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm5 || "기타5"}</span> 
        </button>
        <button className={"bug-btn"} onClick={onBugClick}>
          <FontAwesomeIcon icon="fa-bug" />
        </button>
        <button className={`manual-btn ${Utils.isEmpty(props.manualUrl) ? "hidden" : ""}`} onClick={onManualClick}>
          <FontAwesomeIcon icon="fa-question" />
        </button>
      </div>
    </div>
  );
};

export default P2PageButtonBar;


