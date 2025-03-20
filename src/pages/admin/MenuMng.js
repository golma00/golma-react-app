import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar, P2FormArea } from 'components/layout/index';
import { P2Input, P2Checkbox, P2Tree, P2DatePicker, P2MessageBox } from 'components/control/index';
import { Divider } from 'antd';
import * as Utils from 'utils/Utils';
import SplitterLayout from 'react-splitter-layout';
import axios from 'axios';

function MenuMng(props) {
  const searchArea = useRef(null);
  const formArea = useRef(null);
  const tree = useRef(null);

  const [loading, setLoading] = useState(false);
  const [treeNode, setTreeNode] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    onSearch();
  }, []);

  async function onSearch() {
    try {
      setLoading(true);
      tree.current.api.clear();
      formArea.current.api.clear();

      const searchData = searchArea.current.api.get(); 
      const res = await axios.post("/api/v1/menu/list", searchData);

      setLoading(false);
      if (res.data.code === "00") {
        setRowData(res.data.data.result);
        setCount(res.data.data.result.length);
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
  function onValid() {
    formArea.current.api.setValid({
      menuNm: (params) => {
        if (Utils.isEmpty(params.value)) {
          return "메뉴명은 필수적으로 기입하여야 합니다.";
        }
      },
      menuUrl: (params) => {
        if (Utils.isEmpty(params.value)) {
          return "메뉴 Path 는 필수적으로 기입하여야 합니다.";
        }
      },
      menuCd: (params) => {
        if (Utils.isEmpty(params.value)) {
          return "메뉴 코드는 필수적으로 기입하여야 합니다.";
        }
      },
      extUseYn1: (params) => {
        if (params.value === "Y" && Utils.isEmpty(params.menuProps?.extBtnNm1)) {
          return "기타 버튼을 사용할 경우 버튼명을 입력해야 합니다.";
        }
        if (params.value === "N" && params.menuProps?.extBtnNm1 !== "" ) {
          return "버튼명을 입력한 경우, 기타 버튼1을 체크해야 합니다.";
        }
      },
    });
    return "";
  }
  async function onSave() {
    
    console.log(formArea.current.api.get());
    const saveDatas = await tree.current.api.getModifiedRows();

    if (saveDatas.length === 0) {
      P2MessageBox.warn({ content: "저장할 데이터가 없습니다." });
      return;
    }

    onValid();
    const validateResult = formArea.current.api.validate();
    if (validateResult) {
      P2MessageBox.warn({ content: validateResult });
      return;
    }
    if (!validateResult) {
      return; // 유효성 검사 실패 시 저장 진행 X
    }
  
    //console.log(onValid(),'ㅇㅇ');
    // saveDatas.forEach((item) => {
    //   if (Utils.isEmpty(item["menuNm"])) {
    //     item["menuId"] = null;
    //   }
    // });

    P2MessageBox.confirm({
      content: '저장 하시겠습니까?',
      onOk: () => onSaveAction(saveDatas),
      onCancel() {},
    });
  }

  async function onSaveAction(saveDatas) {
    setLoading(true);
    try {
      const res = await axios.put("/api/v1/menu/save", {
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

  function onAddTreeNode(action) {
    const newNode = {
      menuNm: "신규 메뉴",
      menuCd: "",
      menuUrl: "",
      menuIcon: "",
      menuDesc: "",
      menuType: "",
      menuIconVal: "",
      useYn: "Y",
      expoPeriodYn: "N",
      expoStarDt: "",
      expoEndDt: "",
      saveUseYn: "Y",
      extUseYn1: "N",
      extUseYn2: "N",
      extUseYn3: "N",
      extUseYn4: "N",
      extUseYn5: "N",
      extUseYn6: "N",
      extBtnNm1: "",
      extBtnNm2: "",
      extBtnNm3: "",
      extBtnNm4: "",
      extBtnNm5: "",
      extBtnNm6: "",
      extBtnIconVal1: "",
      extBtnIconVal2: "",
      extBtnIconVal3: "",
      extBtnIconVal4: "",
      extBtnIconVal5: "",
      extBtnIconVal6: "",
      menualUrl: "",
    }
    if (action === "after") {
      tree.current.api.addAfterTreeNode(newNode);
    }
    else if (action === "child") {
      tree.current.api.addChildTreeNode(newNode);
    }
  }

  function onDeleteTreeNode() {
    tree.current.api.deleteTreeNode(tree.current.api.getSelectedTreeNodeKey());
  }

  function nodeTitleFunc(item) {
    return (item) => `${item["menuNm"]} (${item["menuId"]})`;
  }

  function onBeforeTreeSelect(selectedNode) {
    let errorMessage = "";
    if (Utils.isEmpty(selectedNode.props.dataRef["menuNm"])) {
      errorMessage += "메뉴명을 입력 하세요.\n";
    }

    if (Utils.isNotEmpty(errorMessage)) {
      P2MessageBox.error(errorMessage);
      return false;
    }
    return true;
  }

  function onTreeSelect(selectedRow, e) {
    setTreeNode(e.node);
    formArea.current.api.clear();
    formArea.current.api.allDisabled(e.node.props.dataRef.menuId === 1);
    //handleFieldVisibility(e.node.props.dataRef.menuId); // 숨길 키 값 받는 코드
  }

  //
  //  function handleFieldVisibility(menuId) {
  //     숨길 필드 목록을 정의 ( 키 , name 값)
  //    const hiddenFieldsMap = {
  //      1: "aaa",  // menuId가 1일 때 숨길 필드
  //      2: "saveUseYn1",         // menuId가 2일 때 숨길 필드
  //    };
  
  //     //모든 필드 숨김 해제 (초기화 , 다른 key 눌렀을 때 )
  //    formArea.current.api.allHidden(false);
  
  //    // 선택된 menuId에 해당하는 필드 숨기기
  //    if (hiddenFieldsMap[menuId]) {
  //      formArea.current.api.hidden(hiddenFieldsMap[menuId], true);
  //    }
  //  }
  
  return (
    <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
      </P2SearchArea>
      <div className="w-full">
        <SplitterLayout split="vertical" customClassName="w-full h-[600px]">
          <div className="h-[600px] flex flex-col gap-1">
            <P2GridButtonBar title="메뉴 목록" count={count} menuProps={props.menuProps}>
              <button className="grid-btn" onClick={onAddTreeNode.bind(this, "after")} auth={"saveUseYn"}>
                메뉴 추가
              </button>
              <button className="grid-btn" onClick={onAddTreeNode.bind(this, "child")} auth={"saveUseYn"}>
                자식 추가
              </button>
              <button className="grid-btn" onClick={onDeleteTreeNode} auth={"saveUseYn"}>
                메뉴 삭제
              </button>
            </P2GridButtonBar>
            <P2Tree ref={tree} 
              rowData={rowData}
              nodeKeyField={"menuId"}
              parentKeyField={"upperMenuId"}
              nodeTitleField={nodeTitleFunc}
              onSelect={onTreeSelect}
              onBeforeSelect={onBeforeTreeSelect}
              defaultExpandedKeys={['1']}
            />
          </div>
          <div className="h-[600px] flex flex-col gap-1">
            <P2GridButtonBar title="메뉴 상세"/>
            <P2FormArea ref={formArea} className="p2-form-area h-[550px] overflow-y-auto" treeNode={treeNode} >
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='menuNm' className="w-28 self-center text-right">메뉴명</label>
                  <P2Input id="menuNm" name="menuNm" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
                <div className="flex flex-row gap-2 w-2/3">
                  <label htmlFor='menuUrl' className="w-28 self-center text-right">메뉴PATH</label>
                  <P2Input id="menuUrl" name="menuUrl" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='menuCd' className="w-28 self-center text-right">메뉴코드</label>
                  <P2Input id="menuCd" name="menuCd" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
                <div className="flex flex-row gap-2 w-2/3">
                  <label htmlFor='menuIconVal' className="w-28 self-center text-right">메뉴ICON</label>
                  <P2Input id="menuIconVal" name="menuIconVal" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='useYn' className="w-28 self-center text-right">사용여부</label>
                  <P2Checkbox id="useYn" name="useYn" className="text-sm self-center w-full" trueValue="Y" falseValue="N" />
                </div>
                <div className="flex flex-row gap-2 w-2/3">
                  <label htmlFor='manualUrl' className="w-28 self-center text-right">매뉴얼URL</label>
                  <P2Input id="manualUrl" name="manualUrl" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
              </div>
              <Divider orientation="left" className="text-xs">공통 버튼</Divider>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-3/3">
                  <P2Checkbox id="saveUseYn" name="saveUseYn" className="text-sm self-center text-right" trueValue="Y" falseValue="N">저장 버튼</P2Checkbox>
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn1" name="extUseYn1" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼1</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm1' className="w-28 self-center text-right">버튼명</label>
                  <P2Input id="extBtnNm1" name="extBtnNm1" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal1' className="w-28 self-center text-right">ICON</label>
                  <P2Input id="extBtnIconVal1" name="extBtnIconVal1" className="text-sm self-center w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn2" name="extUseYn2" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼2</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm2' className="w-28 self-center text-right">버튼명</label>
                  <P2Input id="extBtnNm2" name="extBtnNm2" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal2' className="w-28 self-center text-right">ICON</label>
                  <P2Input id="extBtnIconVal2" name="extBtnIconVal2" className="text-sm self-center w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn3" name="extUseYn3" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼3</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm3' className="w-28 self-center text-right">버튼명</label>
                  <P2Input id="extBtnNm3" name="extBtnNm3" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal3' className="w-28 self-center text-right">ICON</label>
                  <P2Input id="extBtnIconVal3" name="extBtnIconVal3" className="text-sm self-center w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn4" name="extUseYn4" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼4</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm4' className="w-28 self-center text-right">버튼명</label>
                  <P2Input id="extBtnNm4" name="extBtnNm4" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal4' className="w-28 self-center text-right">ICON</label>
                  <P2Input id="extBtnIconVal4" name="extBtnIconVal4" className="text-sm self-center w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn5" name="extUseYn5" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼5</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm5' className="w-28 self-center text-right">버튼명</label>
                  <P2Input id="extBtnNm5" name="extBtnNm5" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal5' className="w-28 self-center text-right">ICON</label>
                  <P2Input id="extBtnIconVal5" name="extBtnIconVal5" className="text-sm self-center w-full" />
                </div>
              </div>
              <Divider orientation="left" className="text-xs">노출 조건</Divider>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="expoPeriodYn" name="expoPeriodYn" className="text-sm self-center" trueValue="Y" falseValue="N">노출기간 사용</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='expoStarDt' className="w-28 self-center text-right">시작일자</label>
                  <P2DatePicker id="expoStarDt" name="expoStarDt" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='expoEndDt' className="w-28 self-center text-right">종료일자</label>
                  <P2DatePicker id="expoEndDt" name="expoEndDt" className="text-sm self-center w-full" />
                </div>
              </div>
            </P2FormArea>
          </div>
        </SplitterLayout>
      </div>
    </P2Page>
  )
}

export default MenuMng;
