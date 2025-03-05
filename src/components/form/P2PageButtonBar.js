import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function P2PageButtonBar(props) {
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
        <button className={`common-btn ${props.saveUseYn ? "" : "hidden"}`} onClick={props.onSave}>
          <FontAwesomeIcon icon="fa-pen" className="pr-1" size="sm"/>
          <span>저장</span>
        </button>
        <button className={`common-btn ${props.extUseYn1 ? "" : "hidden"}`} onClick={props.onExtBtn1}>
          <FontAwesomeIcon icon={props.extBtnIconVal1 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm1 || "기타1"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn2 ? "" : "hidden"}`} onClick={props.onExtBtn2}>
          <FontAwesomeIcon icon={props.extBtnIconVal2 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm2 || "기타2"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn3 ? "" : "hidden"}`} onClick={props.onExtBtn3}>
          <FontAwesomeIcon icon={props.extBtnIconVal3 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm3 || "기타3"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn4 ? "" : "hidden"}`} onClick={props.onExtBtn4}>
          <FontAwesomeIcon icon={props.extBtnIconVal4 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm4 || "기타4"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn5 ? "" : "hidden"}`} onClick={props.onExtBtn5}>
          <FontAwesomeIcon icon={props.extBtnIconVal5 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm5 || "기타5"}</span>
        </button>
        <button className={`common-btn ${props.extUseYn6 ? "" : "hidden"}`} onClick={props.onExtBtn6}>
          <FontAwesomeIcon icon={props.extBtnIconVal6 || "fa-check"} className="pr-1" size="sm"/>
          <span>{props.extBtnNm6 || "기타6"}</span>
        </button>
        <button className="common-btn hidden">
          <i className="fa fa-edit"></i>
        </button>
      </div>
    </div>
  );
};

export default P2PageButtonBar;


