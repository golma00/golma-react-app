import React, {useEffect, useState, useRef } from 'react'
import { P2Page, P2SearchArea, P2GridButtonBar, P2FormArea } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import SplitterLayout from 'react-splitter-layout';
import axios from 'axios';


function FourGridPage(props) {

    const searchArea = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [msgst, setMsgst] = useState(0); // JSON 데이터 저장
    const grid = useRef(null);
    const formArea = useRef(null);
    const [codeList, setCodeList] = useState([]);
    const [rowNode, setRowNode] = useState();
    const [rowData, setRowData] = useState();
    const [msg, setMsg] = useState([]); // JSON 데이터 저장
    const [modifiedRows, setModifiedRows] = useState([]);  

    useEffect(() => {
      if (msgst === 1) {
          grid.current.api.refresh();
          grid.current.api.setGridOption("rowData", structuredClone(rowData));
          setCount(grid.current.api.getDisplayedRowCount());          
          grid.current.api.firstRowSelected();
          setIsModalOpen(true);
          setMsgst(0);
      }
    }, [msgst]);  // msg가 변경될 때마다 실행  

    const colDefs = [
      { field: "empno", headerName: "사원번호", editable: true, },
      { field: "name", headerName: "이름", editable: true, },
      { field: "hpno", headerName: "휴대폰번호", editable: true, },
      { field: "email", headerName: "EMAIL", editable: true, },
    ];

    const [count, setCount] = useState(0);


    const inqApi = async() => 
    {
            try {
              let iempno = await searchArea.current.api.get('inputEmpno').inputEmpno;
              if (iempno === undefined ) {iempno=""};
              console.log('1111');
              let responce = await axios.get(`http://192.168.0.247:8080/list?id=${iempno}`);
              console.log('responce=',responce.data);
              await setRowData(responce.data?responce.data:[]);
              await setMsg({msg:'조회되었습니다.'});
              // console.log("사원번호 : ", $('#inputEmpno').val());
              setMsgst(1);
            } catch(e) {
              alert('error=>',e);
            }
    }

    async function onSearch() {
        await inqApi();
    }

    // 저장 버튼 클릭 시 서버로 전송
    const onSave = async () => {
      try {
        console.log('modifiedRows)',modifiedRows);
        const response = await axios.post("http://192.168.0.247:8080/insert", modifiedRows);
        console.log("서버 응답:", response.data);
        alert("저장 완료!");
      } catch (err) {
        console.error("저장 오류:", err);
        alert("저장 실패!");
      }
    };

    async function onSelectionChanged(event) {
        setRowNode(await event.api.getSelectedNode());
    }

    // 셀 값 변경 시 수정된 행 저장
    const onCellValueChanged = (params) => {
      console.log('onCellValueChanged=',params);
      const updatedRow = params.data;
      setModifiedRows((prev) => {
        const exists = prev.find((row) => row.id === updatedRow.id);
        return exists
          ? prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
          : [...prev, updatedRow];
      });
    };

    const Modal = ({ isOpen, onClose, children }) => {
      if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링하지 않음

      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">처리결과</h2>
            <div>{children}</div>
            <button
              onClick={onClose}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      );
    };

    return (

      <P2Page menuProps={props.menuProps} onSearch={onSearch} onSave={onSave}>
        <P2SearchArea onSearch={onSearch} ref={searchArea}>
          <div className="flex flex-row gap-2 justify-center">
            <label htmlFor='inputEmpno'>사원번호</label>
            <input type="text" id="inputEmpno" name="inputEmpno" className="text-sm bg-white border border-gray-200 rounded-md" />
          </div>
        </P2SearchArea>
        <div className="w-full">
          <SplitterLayout split="vertical" customClassName="w-full h-[600px]">
            <div className="h-[550px]">
              <P2GridButtonBar title="그리드" count={count}/>
              <P2AgGrid 
                debug={true}
                ref={grid}
                columnDefs={colDefs}
                showStatusColumn={true}
                showCheckedColumn={true}
                onSelectionChanged={onSelectionChanged}
                cellValueChanged={onCellValueChanged}
              />
            </div>
            <div className="h-[550px]">
              <P2GridButtonBar title="그리드 상세"/>
              <P2FormArea ref={formArea} className="p2-form-area h-[550px]" rowNode={rowNode} gridRef={grid}>
                <div className="flex flex-row gap-2">
                  <label htmlFor='empno' className="w-20">사원번호</label>
                  <input type="text" id="empno" name="empno" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
                <div className="flex flex-row gap-2">
                  <label htmlFor='name' className="w-20">이름</label>
                  <input type="text" id="name" name="name" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
                <div className="flex flex-row gap-2">
                  <label htmlFor='hpno' className="w-20">휴대폰번호</label>
                  <input type="text" id="hpno" name="hpno" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
                <div className="flex flex-row gap-2">
                  <label htmlFor='email' className="w-20">Email ID</label>
                  <input type="text" id="email" name="email" className="text-sm bg-white border border-gray-200 rounded-md" />
                </div>
              </P2FormArea>
            </div>
          </SplitterLayout>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <p>{msg.msg}</p>
        </Modal>
      </P2Page>
    )
}

export default FourGridPage;
