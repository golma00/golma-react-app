import { useState, useRef } from 'react';
import { Modal, Button } from 'antd';
import { P2Page, P2SearchArea, P2GridButtonBar } from 'components/layout/index';
import { P2AgGrid } from 'components/grid/index';
import { P2Input, P2MessageBox } from 'components/control/index';
import { useCommonCode } from 'hooks/useCommonCode';
import axios from 'axios';

const SearchUpperCodePopup = ({ props, visible, onOk, onClose, params }) => {
  const searchArea = useRef(null);
  const grid = useRef(0);
  
  const [selectedRow, setSelectedRow] = useState(null);

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {getCodeDatas} = useCommonCode();

  const colDefs = [
      { 
        field: "grpCd",
        headerName: "그룹코드", 
        width: 120,
        hide: true,
        align: "left",
        pinned: "left",
      },
      { 
        field: "grpNm",
        headerName: "그룹코드명", 
        align: "left",
        pinned: "left",
      },
      { 
        field: "cd",
        headerName: "코드",
        width: 120,
        align: "left",
        pinned: "left",
      },
      { 
        field: "cdNm",
        headerName: "코드명", 
        width: 150,
        align: "left",
        pinned: "left",
      },
      { 
        field: "cdDesc",
        headerName: "코드 설명", 
        width: 250,
        align: "left" 
      },
      { 
        field: "alignSeq",
        headerName: "순서", 
        width: 100,
        align: "right",
        cellDataType: "number"
      },
      { 
        field: "useYn",
        headerName: "사용유무", 
        width: 110,
        align: "center",
        cellDataType: "checkbox",
      },
      { 
        field: "upperGrpCd",
        headerName: "종속\n그룹", 
        width: 120,
        align: "left" 
      },
      { 
        field: "upperCd",
        headerName: "종속\n그룹코드", 
        width: 120,
        align: "left" 
      },
      { 
        field: "cdType",
        headerName: "종속 코드", 
        width: 110,
        align: "center",
        cellDataType: "combo",
      },
      { 
        field: "cdRefVal01",
        headerName: "비고 1", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal02",
        headerName: "비고 2", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal03",
        headerName: "비고 3", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal04",
        headerName: "비고 4", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal05",
        headerName: "비고 5", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal06",
        headerName: "비고 6", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal07",
        headerName: "비고 7", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal08",
        headerName: "비고 8", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal09",
        headerName: "비고 9", 
        width: 150,
        align: "left" 
      },
      { 
        field: "cdRefVal10",
        headerName: "비고 10", 
        width: 150,
        align: "left" 
      },
  ];

  async function getUpperCodeList() {
    try {
      setLoading(true);
      grid.current.api.refresh();
      const res = await axios.post("/api/v1/code/getCommonCodeList", params);

      setLoading(false);
      if (res.data.code === "00") {
        grid.current.api.setGridOption("rowData", structuredClone(res.data.data.result));
        setCount(grid.current.api.getDisplayedRowCount());
      }
    }
    catch (error) {
      setLoading(false);
      P2MessageBox.error('시스템 오류가 발생했습니다.');
      console.log(error);
    }
  }

  async function onGridReady() {
    getUpperCodeList();
  
    const commonCodeParams = {
      cdType: {
        grpCd : "ROOT",
        cd : "G001",
      },
    };
    const commonCodeCombo = await getCodeDatas(commonCodeParams);
    grid.current.api.setColumnComboDatas("cdType", commonCodeCombo.cdType, "cd", "cdNm");
  }

  const onRowClicked = (params) => {
    setSelectedRow(params.data);
  };

  const selectionConfirm = () => {
    if (selectedRow) {
      P2MessageBox.confirm({
        title: '아래 Row를 선택하시겠습니까?',
        content: '* 속성그룹명: ' + selectedRow.grpNm + '\n' + 
                 '* 속성그룹코드: ' + selectedRow.grpCd + '\n' + 
                 '* 속성명: ' + selectedRow.cdNm + '\n' + 
                 '* 속성코드: ' + selectedRow.cd,
        onOk: () => {
          onOk(selectedRow);
          onClose();
        },
        onCancel() {},
      });
    }
    else {
      P2MessageBox.warn('선택한 Row가 없습니다. \n Row 선택 후 다시 시도해주십시오.');
    }
  };

  return (
    visible && <Modal className="!w-[80%] p2-modal"
      title="상위 코드 검색"
      visible={visible}
      onCancel={onClose}
      params={params}
      footer={[
        <>
          <Button key="ok" onClick={selectionConfirm}>
            선택
          </Button>
          <Button key="close" onClick={onClose}>
            닫기
          </Button>
        </>
      ]}
    >
      <P2Page menuProps={props.menuProps} onSearch={getUpperCodeList} loading={loading}>
        <P2SearchArea onSearch={getUpperCodeList} ref={searchArea}>
          <div className="flex flex-row gap-1">
            <label className="text-xl" htmlFor='searchAttribGrpId'>속성그룹ID</label>
            <P2Input type="combo" id="searchAttribGrpId" name="searchAttribGrpId" className="text-sm bg-white border border-gray-200 rounded-md"/>
          </div>
        </P2SearchArea>
        <P2GridButtonBar title="상위 코드" count={count} />
        <div className="w-full h-[500px]">
          <P2AgGrid 
            debug={true}
            ref={grid}
            columnDefs={colDefs}
            onGridReady={onGridReady}
            onRowClicked={onRowClicked}
          />
        </div>
      </P2Page>
    </Modal>
  );
};

export default SearchUpperCodePopup;