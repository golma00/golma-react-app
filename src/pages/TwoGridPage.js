import React, { useState, useRef, useEffect } from 'react'
import { P2SearchArea } from 'components/layout/index';
import { P2Select } from 'components/control/index';
import { P2AgGrid } from 'components/grid/index';
import Modal from '../components/modal/Modal';
import ProgressBar from '../components/spinner/FadeLoader';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import SplitterLayout from 'react-splitter-layout';
import "react-splitter-layout/lib/index.css";
import "../css/splitter.css";

function TwoGridPage(params) {
  console.log("params => ", params);
  const searchArea = useRef(null);
  const selectCeGroup = useRef(null);
  const selectCeGroup2 = useRef(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridApi2, setGridApi2] = useState(null);

  const [textValue, setTextValue] = useState("test");

  const [codeList, setCodeList] = useState([]);
  
  // modal 팝업
  const [modalOpen, setModalOpen] = useState(false);
  // new window 팝업
  const [searchParams, setSearchParams] = useSearchParams();

  // Spinner - Clip Loader
  let [loadingStatus, setLoadingStatus] = useState(false);

  const lngs = [ // 2. 언어 구분을 위한 lng 객체 생성
    { value: "ko", label: "한국어" },
    { value: "en", label: "English" },
  ];
  const [language, setLanguage] = useState("ko");

  const { t, i18n } = useTranslation();

  const rowData = [
      { make: "Tesla",  model: "Model Y", price: 64950, electric: "Y", controller: "1A" },
      { make: "Ford",   model: "F-Series", price: 33850, electric: "N", controller: "2A" },
      { make: "Toyota", model: "Corolla", price: 29600, electric: "Y", controller: "3A" },
  ];

  const controllerData = [
    { cd: "1A", cdNm: "일A" },
    { cd: "2A", cdNm: "둘A" },
    { cd: "3A", cdNm: "셋A" },
  ]

  const colDefs = [
      { field: "make", headerName: "Make", editable: true, },
      { field: "model", headerName: "Model", editable: true, },
      { field: "price", headerName: "Price", editable: true, cellDataType: "number" },
      { field: "electric", headerName: "Electric", editable: true, cellDataType: "checkbox" },
      { field: "controller", headerName: "Controller", editable: true, cellDataType: "combo", 
        cellEditorParams: { valueField: "cd", displayField: "cdNm", values: controllerData } }
  ];

  useEffect(() => {
    getCodeList();
    hasLanguageCd();
  }, []);

  useEffect(() => {
    console.log(selectCeGroup.current);
  }, [selectCeGroup.current]);

  const getCodeList = async () => {
    try {
      const res = await axios.get("/api/v1/login/langCd?sysId=ADMIN&grpCd=LANG_CD");
      setCodeList(res.data.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadData() {
    await openClipLoader();
    gridApi.refresh();
    gridApi.setGridOption("rowData", rowData);
    gridApi2.refresh();
    gridApi2.setGridOption("rowData", rowData);

    await setTimeout(() => closeClipLoader(), 1500);
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openClipLoader = () => {
    setLoadingStatus(true);
  };

  const closeClipLoader = () => {
    setLoadingStatus(false);
  };
  
  const openWindowPop = async () => {
    const url = '../two' + '?' + 'languageId=en';
    const date = new Date();
    const popupId = "popup" + String(date.getHours()).padStart(2, "0")
                            + String(date.getMinutes()).padStart(2, "0")
                            + String(date.getSeconds()).padStart(2, "0");

    const width = 1200; 
    const height = 800; 
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;

    window.open(url, popupId, windowFeatures);
  };

  function addData() {
    gridApi.addRow({
      make: "123",
      model: "RED",
      price: 30000,
      electric: false
    });
    gridApi2.addRow({
      make: "123",
      model: "RED",
      price: 30000,
      electric: false
    });
  }

  async function allRowNodes() {
    console.log(await gridApi.getAllRowNodes());
  }

  async function insertedRowNodes() {
    console.log(await gridApi.getInsertedRowNodes());
    console.log(selectCeGroup.current.api.setSelectedIndex(2));
  }

  function onSearch(searchData) {
    console.log(searchData);
  }

  async function search() {
    await searchArea.current.api.set("test", "Eeeee");
    console.log(await searchArea.current.api.get());
  }

  const changeLanguageCd = (param) => {
    var languageCd = "";
    if (param.value) {
      languageCd = param.value;
    }
    else {
      languageCd = param;
    }
    setLanguage(languageCd);
    i18n.changeLanguage(languageCd);
  };

  const hasLanguageCd = () => {
    var languageId = searchParams.get("languageId");
    if (languageId) {
      changeLanguageCd(languageId);
    }
  }
  
  return (
    <div className="flex flex-col w-full gap-1 px-2 py-1">
      <div className="flex flex-row w-full h-8 gap-1 justify-end">
        <P2Select name="lngSelect" className="w-24 text-sm"
          value={language} 
          isMulti={false}
          valueField="value"
          labelField="label"
          datas={lngs}
          onChange={changeLanguageCd}
        />
        <button className="common-btn" onClick={openModal}>{t(`top-buttons.modalPop`)}</button>
        <button className="common-btn" onClick={openWindowPop}>{t(`top-buttons.winPop`)}</button>
        <button className="common-btn" onClick={loadData}>{t(`top-buttons.loadData`)}</button>
        <button className="common-btn" onClick={addData}>{t(`top-buttons.addData`)}</button>
        <button className="common-btn" onClick={allRowNodes}>{t(`top-buttons.allData`)}</button>
        <button className="common-btn" onClick={insertedRowNodes}>{t(`top-buttons.insertData`)}</button>
        <button className="common-btn" onClick={search}>{t(`top-buttons.searchData`)}</button>
        <P2Select name="ceGroup1" className="w-40 text-sm" 
          defaultOption="ALL"
          isMulti={true}
          value={["KR"]}
          datas={codeList}
        />
      </div>
      <P2SearchArea onSearch={onSearch} ref={searchArea}>
        <label className="text-xl">계획연도2</label>
        <input type="text" name="planYear" className="text-sm bg-white border border-gray-200 rounded-md" value={textValue} onChange={(e) => setTextValue(e.target.value)}/>
        <label>제목</label>
        <input type="text" name="title" className="text-sm bg-white border border-gray-200 rounded-md"/>
        <label>기간</label>
        <input type="checkbox" name="period" className="text-sm bg-white border border-gray-200 rounded-md" changeaftersearch="true" checked={true}/>
        <label>C/E 그룹</label>
        <P2Select name="ceGroup" className="w-40 text-sm" ref={selectCeGroup}
          defaultOption="ALL"
          value=""
          datas={codeList}
        />
        <label>C/E 그룹2</label>
        <P2Select name="ceGroup2" className="w-40 text-sm" ref={selectCeGroup2}
          value={["KR"]}
          isMulti={true}
          datas={codeList}
        />
        <label>테스트</label>
        <input type="text" name="test" className="text-sm bg-white border border-gray-200 rounded-md"/>
      </P2SearchArea>
      <div className="w-full h-[500px]">
        <SplitterLayout split="vertical" primaryMinSize={300} secondaryMinSize={300}>
          <P2AgGrid 
            debug={true}
            columnDefs={colDefs}
            showStatusColumn={true}
            showCheckedColumn={true}
            api={setGridApi}
          />
          <P2AgGrid 
            debug={true}
            columnDefs={colDefs}
            showStatusColumn={true}
            showCheckedColumn={true}
            api={setGridApi2}
          />
        </SplitterLayout>
      </div>
      <Modal open={modalOpen} close={closeModal} header="Modal 헤더">
        Modal 내용
      </Modal>
      <ProgressBar loading={loadingStatus} />
    </div>
  )
}

export default TwoGridPage;
