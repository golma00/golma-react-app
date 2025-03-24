import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Utils from 'utils/Utils';
import { P2MessageBox } from 'components/control/index';
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import { ReactComponent as SaveIcon } from "assets/icons/edit.svg";
import { ReactComponent as CheckIcon } from "assets/icons/check.svg";
import { ReactComponent as BugIcon } from "assets/icons/bug.svg";
import { ReactComponent as ManualIcon } from "assets/icons/question.svg";


function P2PageButtonBar(props) {

  function onManualClick() {
    window.open(props.manualUrl, '_blank');
  }

  function onBugClick() {
    P2MessageBox.info("버그 신고 기능은 아직 준비중입니다.");
  }

  return (
    <div className="flex flex-row w-full justify-between">
      {props.menuNm && (
        <div className="flex flex-row w-full h-8 gap-1 justify-start">
          <FontAwesomeIcon icon="fa-circle" className="self-center pr-1" size="xs"/>
          <span className="text-xl self-center font-medium text-ellipsis whitespace-nowrap">{props.menuNm}</span>
        </div>
      )}
      <div className="flex flex-row w-full h-8 gap-1 justify-end">
        <button className="common-btn" onClick={props.onSearch}>
          <div className="flex flex-row items-center">
            <SearchIcon width={22} height={22} fill="#4B5359"/>
            <span className="tracking-wider">조회</span>
          </div>
        </button>
        <button className={`common-btn ${props.saveUseYn === "Y" ? "" : "hidden"}`} onClick={props.onSave}>
          <div className="flex flex-row items-center">
            <SaveIcon width={22} height={22} fill="#4B5359"/>
            <span className="tracking-wider">저장</span>
          </div>
        </button>
        <button className={`common-btn ${props.extUseYn1 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn1}>
          <div className="flex flex-row items-center">
            <CheckIcon width={22} height={22} fill="#4B5359"/>
            <span className="tracking-wider">{props.extBtnNm1 || "기타1"}</span>
          </div>
        </button>
        <button className={`common-btn ${props.extUseYn2 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn2}>
          <div className="flex flex-row items-center">
            <CheckIcon width={22} height={22} fill="#4B5359"/>
            <span className="tracking-wider">{props.extBtnNm2 || "기타2"}</span>
          </div>
        </button>
        <button className={`common-btn ${props.extUseYn3 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn3}>
          <div className="flex flex-row items-center">
            <CheckIcon width={22} height={22} fill="#4B5359"/>
            <span className="tracking-wider">{props.extBtnNm3 || "기타3"}</span>
          </div>
        </button>
        <button className={`common-btn ${props.extUseYn4 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn4}>
          <div className="flex flex-row items-center">
            <CheckIcon width={22} height={22} fill="#4B5359"/>
            <span className="tracking-wider">{props.extBtnNm4 || "기타4"}</span>
          </div>
        </button>
        <button className={`common-btn ${props.extUseYn5 === "Y" ? "" : "hidden"}`} onClick={props.onExtBtn5}>
          <div className="flex flex-row items-center">
            <CheckIcon width={22} height={22} fill="#4B5359"/>
            <span className="tracking-wider">{props.extBtnNm5 || "기타5"}</span> 
          </div>
        </button>
        <button className={"bug-btn"} onClick={onBugClick}>
          <div className="flex flex-row items-center">
            <BugIcon width={22} height={22} fill="#4B5359"/>
          </div>
        </button>
        <button className={`manual-btn ${Utils.isEmpty(props.manualUrl) ? "hidden" : ""}`} onClick={onManualClick}>
          <div className="flex flex-row items-center">
            <ManualIcon width={20} height={20} fill="#4B5359"/>
          </div>
        </button>
      </div>
    </div>
  );
};

export default P2PageButtonBar;


