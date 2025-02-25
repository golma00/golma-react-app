import React from "react";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import { P2CheckboxCellRenderer, P2CheckboxCellEditor } from "components/index";

export const insertStatus = "I"
export const updateStatus = "U"
export const deleteStatus = "D"
export const statusField = "_status" 
export const rowNumField = "_rowNum"
export const checkedField = "_checked"

const P2AgGridModule = {
  moduleName: "P2AgGrid",
  version: "33.1.1",
  apiFunctions: {
    wait: (beans, timeToDelay) =>
      new Promise((resolve) => setTimeout(resolve, timeToDelay)),

    /**
     * 그리드 초기화
     */
    refresh: function (beans) {
      beans.setGridOption("rowData", []);
    },
    /**
     * 가장 마지막 행에 신규 행을 추가한다.
     * @param rowData
     * @param addIndex 추가하려는 행인덱스, 값이 없다면 가장 마지막에 추가
     * @param startEditingColId 신규 추가되는 행에서 cell editing 을 하려는 Column Id
     *
     * @return 신규 노드
     */
    addRow: function (beans, rowData, startEditingColId, addIndex) {
      let newRowIndex = addIndex || beans.getDisplayedRowCount();

      const transaction = beans.applyTransaction({
        add: [rowData],
        addIndex: newRowIndex,
      });
      let newRowNode = transaction.add[0];
      newRowNode.setSelected(true, true);
      beans.ensureIndexVisible(beans.getDisplayedRowCount() - 1);

      newRowNode.setDataValue(statusField, insertStatus);

      if (startEditingColId) {
        beans.startEditingCell({
          rowIndex: newRowIndex,
          colKey: startEditingColId,
        });
      }

      return newRowNode;
    },
    /**
     * 선택된 행 중 첫번째 행을 삭제한다.
     * 상태값이 I 라면 화면에서 제거, I 가 아니라면 D 로 상태값을 변경한다.
     */
    deleteRow: async function (beans,multiple) {
      await beans.wait(100);

      if (multiple) {
        let checkedNodes = await beans.getCheckedRowNodes();

        if (checkedNodes.length) {
          for (let node of checkedNodes) {
            if (beans.getStatus(node) === insertStatus) {
              beans.applyTransaction({ remove: [node.data] });
            }
            else {
              node.setDataValue(statusField, deleteStatus);
              beans.applyTransaction({ update: [node.data] });
            }
          }
          beans.firstRowSelected();
        }
      }
      else {
        let selectedNode = await beans.getSelectedNode();

        if (selectedNode != null) {
          if (selectedNode.data[statusField] === insertStatus) {
            const prevNode = beans.getDisplayedRowAtIndex(
              selectedNode.childIndex - 1
            );

            beans.applyTransaction({ remove: [selectedNode.data] });
            if (prevNode) {
              prevNode.setSelected(true, true);
            }
          }
          else {
            selectedNode.setDataValue(statusField, deleteStatus);
            beans.applyTransaction({ update: [selectedNode.data] });
          }
        }
      }
    },
    /**
     * RowNode 에서 상태값을 리턴한다.
     * @param rowNode RowNode
     * @return StatusField 의 상태값
     */
    getStatus: function (beans, rowNode) {
      return rowNode.data[statusField];
    },
    /**
     * RowNode 에서 상태값을 저장한다.
     * @param rowNode RowNode
     * @param status 변경할 상태값
     */
    setStatus: function (beans, rowNode, status) {
      if (
          status === updateStatus &&
          !(
              rowNode.data[statusField] === insertStatus ||
              rowNode.data[statusField] === deleteStatus
          )
      ) {
          rowNode.setDataValue(statusField, status);
      }
      else if (status === deleteStatus && rowNode.data[statusField] !== insertStatus) {
          rowNode.setDataValue(statusField, status);
      }
    },
    /**
     * 선택된 Row 중에서 첫번째 Row를 리턴한다.
     * @return RowData
     */
    getSelectedRow: async function (beans) {
      await beans.wait(100);

      const selectedRows = beans.getSelectedRows();
      if (selectedRows.length > 0) {
        return selectedRows[0];
      }
      return null;
    },
    /**
     * 선택된 Node 중에서 첫번째 Node를 리턴한다.
     * @return RowNode
     */
    getSelectedNode: async function (beans) {
      const selectedNodes = await beans.getSelectedNodes();
      if (selectedNodes.length > 0) {
        return selectedNodes[0];
      }
      return null;
    },
    /**
     * 첫번째 행을 선택한다.
     */
    firstRowSelected: function (beans) {
      const firstNode = beans.getDisplayedRowAtIndex(0);
      if (firstNode) {
        firstNode.setSelected(true, true);
      }
    },
    /**
     * 모든 Row 를 리턴한다.
     *
     * @return Array[RowData]
     */
    getAllRows: async function (beans) {
      let rows = [];
      const allNodes = await beans.getAllRowNodes();
      allNodes.forEach((node) => rows.push(node.data));

      return rows;
    },
    /**
     * 모든 Row 를 리턴한다.
     *
     * @return Array[RowData]
     */
    getAllRowNodes: async function (beans) {
      await beans.wait(100);

      let nodes = [];
      beans.forEachNode((node) => nodes.push(node));

      return nodes;
    },
    /**
     * 추가된 Row 를 리턴한다.
     *
     * @return Array[RowData]
     */
    getInsertedRows: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter(
          (node) => node.data[statusField] === insertStatus
      );
      let rows = [];
      filterNodes.forEach((node) => rows.push(node.data));

      return rows;
    },
    /**
     * 수정된 Row 를 리턴한다.
     *
     * @return Array[RowData]
     */
    getUpdatedRows: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter(
          (node) => node.data[statusField] === updateStatus
      );
      let rows = [];
      filterNodes.forEach((node) => rows.push(node.data));

      return rows;
    },
    /**
     * 삭제 처리된 Row 를 리턴한다.
     *
     * @return Array[RowData]
     */
    getDeletedRows: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter(
          (node) => node.data[statusField] === deleteStatus
      );
      let rows = [];
      filterNodes.forEach((node) => rows.push(node.data));

      return rows;
    },
    /**
     * 추가, 수정, 삭제 처리된 Row 를 리턴한다.
     *
     * @return Array[RowData]
     */
    getModifiedRows: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter(
          (node) =>
              node.data[statusField] === insertStatus ||
              node.data[statusField] === updateStatus ||
              node.data[statusField] === deleteStatus
      );
      let rows = [];
      filterNodes.forEach((node) => rows.push(node.data));

      return rows;
    },
    /**
     * 추가된 RowNode 를 리턴한다.
     *
     * @return Array[RowNode]
     */
    getInsertedRowNodes: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter(
          (node) => node.data[statusField] === insertStatus
      );
      return filterNodes;
    },
    /**
     * 수정된 RowNode 를 리턴한다.
     *
     * @return Array[RowNode]
     */
    getUpdatedRowNodes: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter(
        (node) => node.data[statusField] === updateStatus
      );
      return filterNodes;
    },
    /**
     * 삭제 처리된 RowNode 를 리턴한다.
     *
     * @return Array[RowNode]
     */
    getDeletedRowNodes: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter(
        (node) => node.data[statusField] === deleteStatus
      );
      return filterNodes;
    },
    /**
     * 추가, 수정, 삭제 처리된 RowNode 를 리턴한다.
     *
     * @return Array[RowNode]
     */
    getModifiedRowNodes: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter(
        (node) =>
          node.data[statusField] === insertStatus ||
          node.data[statusField] === updateStatus ||
          node.data[statusField] === deleteStatus
      );
      return filterNodes;
    },
    /**
     * RowNode에서 RowData 를 뽑아서 리턴한다.
     * @param nodes Array[RowNode]
     * @return Array[RowData]
     */
    getRowByNodes: async function (beans, nodes) {
      await beans.wait(100);

      let rows = [];
      nodes.forEach((node) => rows.push(node.data));

      return rows;
    },
    /**
     * 체크된 RowNode 를 리턴한다.
     *
     * @return Array[RowNode]
     */
    getCheckedRowNodes: async function (beans) {
      const allNodes = await beans.getAllRowNodes();
      let filterNodes = allNodes.filter((node) => node.isChecked === true);
      return filterNodes;
    },
    /**
     * 모든 행 체크
     */
    allCheckedRows: function(beans) {
      beans.forEachNode(
        (node) => node.isChecked = true
      );
      beans.redrawRows();
    },
    /**
     * 모든 행 언체크
     */
    allUncheckedRows: function(beans) {
      beans.forEachNode(
        (node) => node.isChecked = false
      );
      beans.redrawRows();
    },
    /**
     * 콤보박스 열에 데이터를 셋팅한다.
     * @param colId
     * @param data
     *
     */
    setColumComboDatas: function (beans, colId, datas, valueField, displayField) {
      const column = beans.getColumn(colId);
      if (column) {
          column.colDef.cellEditorParams = {
              values: datas,
              valueField: valueField || column.colDef.cellEditorParams.valueField || 'cd',
              displayField: displayField || column.colDef.cellEditorParams.displayField || 'cdNm'
          };
      }
    },
    /**
     * 콤보박스 셀의 선택된 데이터를 리턴한다.
     * @param rowNode
     * @param colId
     *
     * @return {} 선택된 콤보데이터
     */
    getSelectedComboData: function (beans, rowNode, colId) {
      const value = rowNode.value;
      const column = beans.getColumn(colId);
      if (column) {
          const editorParams = column.cellEditorParams;
          const comboDatas = editorParams.values || [];
          const selectedDatas = comboDatas.filter((d) => d[editorParams.valueField] === value);

          if (selectedDatas.length) {
              return selectedDatas[0];
          } 
          else {
              return null;
          }
      }
    },
  },
}; 

function P2AgGrid(props) {
  const showRowNumColumn = props.showRowNumColumn || true;
  const showCheckedColumn = props.showCheckedColumn;
  const showStatusColumn = props.showStatusColumn;

  let columnDefs = props.columnDefs || [];

  if (showStatusColumn) {
    const columns = columnDefs.filter((c) => c.field === statusField);

    if (!columns.length) {
      let statusColumn = {
        headerName: "상태",
        field: statusField,
        width: 70,
        editable: false,
        sortable: false,
        filter: false,
        cellClass: "text-center",
      };

      columnDefs = [statusColumn, ...props.columnDefs];
    }
  }

  if (showCheckedColumn) {
    const columns = columnDefs.filter((c) => c.key === checkedField);
    if (!columns.length) {
      let checkColumn = {
        key: checkedField,
        headerName: " ",
        width: 50,
        sortable: false,
        filter: false,
        // cellRenderer: CommonCheckedRenderer,
        // cellEditor: CommonCheckedEditor,
        // headerComponent: CommonHeaderCheckedComponet,
      };

      columnDefs = [checkColumn, ...columnDefs];
    }
  }

  if (showRowNumColumn) {
    const columns = columnDefs.filter((c) => c.field === rowNumField);

    if (!columns.length) {
      let rowNumColumn = {
        headerName: "No",
        field: rowNumField,
        width: 60,
        sortable: false,
        filter: false,
        editable: false,
        cellClass: "text-center",
        valueFormatter: (params) => {
          return `${parseInt(params.node.childIndex) + 1}`;
        },
      };

      columnDefs = [rowNumColumn, ...columnDefs];
    }
  }

  let defaultHeaderHeight = 35;
  let required = {
    'error-cell': (params) => !params.value
  };

  columnDefs.forEach((c) => {
    if (c.headerName.includes("\r\n")) {
      defaultHeaderHeight = undefined;
    }
    c.headerClass = "justify-center";
    if (c.cellDataType === "checkbox") {
      c.cellRenderer = P2CheckboxCellRenderer;
      c.cellEditor = P2CheckboxCellEditor;
      c.suppressKeyboardEvent = (params) => !!params.colDef.editable && params.event.key === KeyCode.SPACE;
    }
    // else if (c.cellDataType == "combo") {
    //   c.cellEditor = ComboboxCellEditor;
    //   if (!c.cellEditorParams) {
    //     c.cellEditorParams = {
    //       valueField: "cd",
    //       displayField: "cdNm",
    //       values: [],
    //     };
    //   }
    //   c.valueFormatter = function (params) {
    //     const editorParams = params.colDef.cellEditorParams;
    //     const matchDatas = editorParams.values.filter(
    //       (v) => v[editorParams.valueField || "cd"] === params.value
    //     );
    //     if (matchDatas.length) {
    //       return matchDatas[0][editorParams.displayField || "cdNm"];
    //     }
    //   };
    // }
    // else if (c.cellDataType == "ajaxCombo") {
    //   c.cellEditor = AjaxComboboxCellEditor;
    //   if (!c.cellEditorParams) {
    //     c.cellEditorParams = {
    //       valueField: "cd",
    //       displayField: "cdNm",
    //       values: [],
    //     };
    //   }
    //   c.valueFormatter = function (params) {
    //     const editorParams = params.colDef.cellEditorParams;
    //     if (editorParams.values) {
    //       const matchDatas = editorParams.values.filter(
    //         (v) => v[editorParams.valueField || "cd"] === params.value
    //       );
    //       if (matchDatas.length) {
    //         return matchDatas[0][editorParams.displayField || "cdNm"];
    //       }
    //     }
    //   };
    // }

    if (c.required === true) {
      if (c.headerName) {
        c.headerName = "* " + c.headerName;
        c.cellClassRules = required;
        c.tooltipValueGetter = (params) => !params.value ? "필수입력" : "";
      }
    }
  });

  let defaultColDef = props.defaultColDef || {
    sortable: false,
    filter: true,
  };

  const onGridReady = (params) => {
    if (props.api) {
      props.api(params.api);
    }
    
    Object.keys(P2AgGridModule.apiFunctions).forEach((key) => {
      params.api[key] = P2AgGridModule.apiFunctions[key].bind(this, params.api);
    });
    
    if (props.onGridReady) {
      props.onGridReady(params);
    }
  };

  const KeyCode = {
    BACKSPACE: 'Backspace',
    TAB: 'Tab',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    SPACE: ' ',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    DELETE: 'Delete',
    F2: 'F2',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
    PAGE_HOME: 'Home',
    PAGE_END: 'End',
    A: 'KeyA',
    C: 'KeyC',
    D: 'KeyD',
    V: 'KeyV',
    X: 'KeyX',
    Y: 'KeyY',
    Z: 'KeyZ',
  };

  return (
    <AgGridReact
      {...props}
      theme={themeQuartz}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowData={props.rowData || []}
      rowHeight={props.rowHeight || 35}
      headerHeight={props.headerHeight || defaultHeaderHeight}
      rowSelection={props.rowSelection || {mode: 'singleRow'}}
      singleClickEdit={props.singleClickEdit || true}
      tooltipShowDelay={props.tooltipShowDelay || 500}
      stopEditingWhenCellsLoseFocus={props.stopEditingWhenCellsLoseFocus || true}
      onGridReady={onGridReady}
    />
  );
}

export default P2AgGrid;

