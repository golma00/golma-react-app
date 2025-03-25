import React, { useState, useRef, useEffect } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar, P2FormArea, P2SplitterLayout } from 'components/layout/index';
import { P2Input, P2Checkbox, P2Tree, P2DatePicker, P2MessageBox, P2Select } from 'components/control/index';
import { useCodeData } from 'hooks/index'
import { Divider } from 'antd';
import * as Utils from 'utils/Utils';
import * as Validate from 'utils/Validate';
import axios from 'axios';

function MenuMng(props) {
  const searchArea = useRef(null);
  const formArea = useRef(null);
  const tree = useRef(null);

  const [loading, setLoading] = useState(false);
  const [treeNode, setTreeNode] = useState(null);
  const [count, setCount] = useState(0);

  const { getCommonCodeDatas } = useCodeData();
  const [menuTypeCodeList, setMenuTypeCodeList] = useState([]);

  useEffect(() => {
    async function getCommonCode() {
      const commonCodeParams = {
        menuType: {
          grpCd: "MENU_TYPE"
        }
      };
      const codeDatas = await getCommonCodeDatas(commonCodeParams);
      setMenuTypeCodeList(codeDatas.menuType);
    }
    getCommonCode();

    formArea.current.api.setValid({
      menuNm: (params) => Validate.validateRequired(params.value),
      extBtnNm1: (params) => {
        if (params.data.extUseYn1 === "Y" && Utils.isEmpty(params.value)) {
          return "기타 버튼1을 사용할 경우 버튼명1을 입력해야 합니다.";
        }
      },
      extBtnNm2: (params) => {
        if (params.data.extUseYn2 === "Y" && Utils.isEmpty(params.value)) {
          return "기타 버튼2을 사용할 경우 버튼명2을 입력해야 합니다.";
        }
      },
      extBtnNm3: (params) => {
        if (params.data.extUseYn3 === "Y" && Utils.isEmpty(params.value)) {
          return "기타 버튼3을 사용할 경우 버튼명3을 입력해야 합니다.";
        }
      },
      extBtnNm4: (params) => {
        if (params.data.extUseYn4 === "Y" && Utils.isEmpty(params.value)) {
          return "기타 버튼4을 사용할 경우 버튼명4을 입력해야 합니다.";
        }
      },
      extBtnNm5: (params) => {
        if (params.data.extUseYn5 === "Y" && Utils.isEmpty(params.value)) {
          return "기타 버튼5을 사용할 경우 버튼명5을 입력해야 합니다.";
        }
      },
    });

    formArea.current.api.allDisabled(true);

    onSearch();
  }, []);

  async function onSearch() {
    try {
      if (Utils.isNotEmpty(await searchArea.current.api.validate())) {
        return;
      }

      setLoading(true);
      tree.current.api.clear();
      formArea.current.api.clear();

      const searchData = searchArea.current.api.get(); 
      const res = await axios.post("/api/v1/menu/list", searchData);

      setLoading(false);
      if (res.data.code === "00") {
        tree.current.api.setRowData(res.data.data.result);
        tree.current.api.firstNodeSelected();
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
  
  async function onSave() {
    const saveDatas = await tree.current.api.getModifiedRows();

    if (saveDatas.length === 0) {
      P2MessageBox.warn({ content: "저장할 데이터가 없습니다." });
      return;
    }

    if (Utils.isNotEmpty(await formArea.current.api.validate())) {
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
      displayYn: "Y",
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

  async function onBeforeTreeSelect(selectedNode) {
    if (Utils.isNotEmpty(await formArea.current.api.validate())) {
      return false;
    }
    return true;
  }

  async function onTreeSelect(selectedRow, e) {
    formArea.current.api.clear();
    setTreeNode(e.node);
    formArea.current.api.allDisabled(e.node.props.dataRef.menuId === 1);
  }

  return (
    <P2Page onSearch={onSearch} onSave={onSave} loading={loading}>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
      </P2SearchArea>
      <div className="w-full h-full">
        <P2SplitterLayout split="vertical" customClassName="w-full h-full">
          <div className="h-full flex flex-col gap-1">
            <P2GridButtonBar title="메뉴 목록" count={count}>
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
              editable={true}
              nodeKeyField={"menuId"}
              parentKeyField={"upperMenuId"}
              nodeTitleField={nodeTitleFunc}
              onSelect={onTreeSelect}
              onBeforeSelect={onBeforeTreeSelect}
              draggable={true}
              expandDepth={2}
            />
          </div>
          <div className="h-full flex flex-col gap-1">
            <P2GridButtonBar title="메뉴 상세"/>
            <P2FormArea ref={formArea} className="p2-form-area h-full overflow-y-auto" treeNode={treeNode} >
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='menuNm' className="common-label required w-28">메뉴명</label>
                  <P2Input id="menuNm" name="menuNm" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
                <div className="flex flex-row gap-2 w-2/3">
                  <label htmlFor='menuUrl' className="common-label w-28">메뉴PATH</label>
                  <P2Input id="menuUrl" name="menuUrl" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='menuCd' className="common-label w-28">메뉴코드</label>
                  <P2Input id="menuCd" name="menuCd" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
                <div className="flex flex-row gap-2 w-2/3">
                  <label htmlFor='menuIconVal' className="common-label w-28">메뉴ICON</label>
                  <P2Input id="menuIconVal" name="menuIconVal" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='useYn' className="common-label w-28">사용여부</label>
                  <P2Checkbox id="useYn" name="useYn" className="text-sm self-center w-full" trueValue="Y" falseValue="N" />
                </div>
                <div className="flex flex-row gap-2 w-2/3">
                  <label htmlFor='menuType' className="common-label w-28">메뉴타입</label>
                  <P2Select id="menuType" name="menuType" datas={menuTypeCodeList} className="text-sm bg-white rounded-md w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='displayYn' className="common-label w-28">표시여부</label>
                  <P2Checkbox id="displayYn" name="displayYn" className="text-sm self-center w-full" trueValue="Y" falseValue="N" />
                </div>
                <div className="flex flex-row gap-2 w-2/3">
                  <label htmlFor='manualUrl' className="common-label w-28">매뉴얼URL</label>
                  <P2Input id="manualUrl" name="manualUrl" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
              </div>
              <Divider orientation="left" className="text-xs !my-2">공통 버튼</Divider>
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
                  <label htmlFor='extBtnNm1' className="common-label w-28">버튼명1</label>
                  <P2Input id="extBtnNm1" name="extBtnNm1" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal1' className="common-label w-28">ICON1</label>
                  <P2Input id="extBtnIconVal1" name="extBtnIconVal1" className="text-sm self-center w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn2" name="extUseYn2" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼2</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm2' className="common-label w-28">버튼명2</label>
                  <P2Input id="extBtnNm2" name="extBtnNm2" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal2' className="common-label w-28">ICON2</label>
                  <P2Input id="extBtnIconVal2" name="extBtnIconVal2" className="text-sm self-center w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn3" name="extUseYn3" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼3</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm3' className="common-label w-28">버튼명3</label>
                  <P2Input id="extBtnNm3" name="extBtnNm3" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal3' className="common-label w-28">ICON3</label>
                  <P2Input id="extBtnIconVal3" name="extBtnIconVal3" className="text-sm self-center w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn4" name="extUseYn4" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼4</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm4' className="common-label w-28">버튼명4</label>
                  <P2Input id="extBtnNm4" name="extBtnNm4" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal4' className="common-label w-28">ICON4</label>
                  <P2Input id="extBtnIconVal4" name="extBtnIconVal4" className="text-sm self-center w-full" />
                </div>
              </div>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="extUseYn5" name="extUseYn5" className="text-sm self-center" trueValue="Y" falseValue="N">기타 버튼5</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnNm5' className="common-label w-28">버튼명5</label>
                  <P2Input id="extBtnNm5" name="extBtnNm5" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='extBtnIconVal5' className="common-label w-28">ICON5</label>
                  <P2Input id="extBtnIconVal5" name="extBtnIconVal5" className="text-sm self-center w-full" />
                </div>
              </div>
              <Divider orientation="left" className="text-xs !my-2">노출 조건</Divider>
              <div className="flex flex-row justify-stretch gap-5">
                <div className="flex flex-row gap-2 w-1/3">
                  <P2Checkbox id="expoPeriodYn" name="expoPeriodYn" className="text-sm self-center" trueValue="Y" falseValue="N">노출기간 사용</P2Checkbox>
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='expoStarDt' className="common-label w-28">시작일자</label>
                  <P2DatePicker id="expoStarDt" name="expoStarDt" className="text-sm self-center w-full" />
                </div>
                <div className="flex flex-row gap-2 w-1/3">
                  <label htmlFor='expoEndDt' className="common-label w-28">종료일자</label>
                  <P2DatePicker id="expoEndDt" name="expoEndDt" className="text-sm self-center w-full" />
                </div>
              </div>
            </P2FormArea>
          </div>
        </P2SplitterLayout>
      </div>
    </P2Page>
  )
}

export default MenuMng;
