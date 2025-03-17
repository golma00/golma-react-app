import React, { useMemo, useState, useCallback, useImperativeHandle, forwardRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { themeQuartz } from "ag-grid-community";
import { 
  P2CheckboxCellEditor, 
  P2CheckboxCellRenderer, 
  P2ComboboxCellEditor, 
  P2AjaxComboboxCellEditor,
  CommonHeaderCheckedComponet,
  CommonCheckedEditor,
  CommonCheckedRenderer
} from "components/grid/renderer/renderer";

import P2AgGridModule from "components/grid/P2AgGridModule";
import * as Utils from "utils/Utils";

export const insertStatus = "I"
export const updateStatus = "U"
export const deleteStatus = "D"
export const statusField = "_status" 
export const rowNumField = "_rowNum"
export const checkedField = "_checked"

function P2AgGrid(props, ref) {
  const [columnDefs, setColumnDefs] = useState(props.columnDefs || []);
  const [defaultColDef] = useState(props.defaultColDef || {
    sortable: true,
    filter: true,
  });
  const [rowData] = useState(props.rowData || []);
  const [gridApi, setGridApi] = useState();
  const [defaultHeaderHeight, setDefaultHeaderHeight] = useState(props.headerHeight || 35);
  const [oldSelectedRowIndex, setOldSelectedRowIndex] = useState(-1);

  useImperativeHandle(ref, () => ({
    api: gridApi,
    rowDataChanged : false
  }));

  const showRowNumColumn = props.showRowNumColumn || true;
  const showCheckedColumn = props.showCheckedColumn;
  const showStatusColumn = props.showStatusColumn;

  useEffect(() => {

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
          pinned: "left",
          cellClass: "text-center",
        };

        setColumnDefs((prev) => [statusColumn, ...prev]);
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
          editable: true,
          pinned: "left",
          cellRenderer: CommonCheckedRenderer,
          cellEditor: CommonCheckedEditor,
          headerComponent: CommonHeaderCheckedComponet,
        };

        setColumnDefs((prev) => [checkColumn, ...prev]);
      }
    }

    if (showRowNumColumn) {
      const columns = columnDefs.filter((c) => c.field === rowNumField);

      if (!columns.length) {
        let rowNumColumn = {
          headerName: "No.",
          field: rowNumField,
          width: 60,
          sortable: false,
          filter: false,
          editable: false,
          pinned: "left",
          cellClass: "text-center",
          valueFormatter: (params) => {
            return `${parseInt(params.node.childIndex) + 1}`;
          },
        };

        setColumnDefs((prev) => [rowNumColumn, ...prev]);
      }
    }

    const required = {
      'error-cell': (params) => !params.value
    };

    columnDefs.forEach((c) => {
      if (c.headerName.includes("\n")) {
        setDefaultHeaderHeight(undefined);
      }
      c.headerClass = "justify-center";

      if (c.align) {
        switch (c.align) {
          case "center":
            c.cellClass = `${c.cellClass} text-center`;
            break;
          case "right":
            c.cellClass = `${c.cellClass} text-right`;
            break;
          default:
            break;
        }
      }
      if (c.cellDataType === "checkbox") {
        c.cellRenderer = P2CheckboxCellRenderer;
        c.cellEditor = P2CheckboxCellEditor;
        c.suppressKeyboardEvent = (params) => !!params.colDef.editable && params.event.key === ' ';
        c.cellClass = "text-center";
      }
      else if (c.cellDataType === "combo") {
        c.cellEditor = P2ComboboxCellEditor;
        if (!c.cellEditorParams) {
          c.cellEditorParams = {
            valueField: "cd",
            displayField: "cdNm",
            values: [],
          };
        }
        c.valueFormatter = function (params) {
          const editorParams = params.colDef.cellEditorParams;
          const matchDatas = editorParams.values.filter(
            (v) => v[editorParams.valueField || "cd"] === params.value
          );
          if (matchDatas.length) {
            return matchDatas[0][editorParams.displayField || "cdNm"];
          }
        };
      }
      else if (c.cellDataType === "ajaxCombo") {
        c.cellEditor = P2AjaxComboboxCellEditor;
        if (!c.cellEditorParams) {
          c.cellEditorParams = {
            valueField: "cd",
            displayField: "cdNm",
            values: [],
          };
        }
        c.valueFormatter = function (params) {
          const editorParams = params.colDef.cellEditorParams;
          if (editorParams.values) {
            const matchDatas = editorParams.values.filter(
              (v) => v[editorParams.valueField || "cd"] === params.value
            );
            if (matchDatas.length) {
              return matchDatas[0][editorParams.displayField || "cdNm"];
            }
          }
        };
      }
      else if (c.cellDataType === "number") {
        c.cellClass = c.cellClass || "text-right";
      }

      if (c.required === true) {
        if (c.headerName) {
          c.headerName = "* " + c.headerName;
          c.cellClassRules = required;
          c.tooltipValueGetter = (params) => Utils.isEmpty(params.value) ? "필수입력" : "";
        }
      }
      
    });
  }, []);

  const rowSelection = useMemo(() => { 
    return {
          mode: 'singleRow',
          checkboxes: false,
          enableClickSelection: true,
      };
  }, []);

  const dataTypeDefinitions = useMemo(() => { 
    return {
      number: {
        baseDataType: 'number',
        extendsDataType: 'number',
        valueFormatter: params => {
          return params.value ? params.value.toLocaleString() : undefined;
        },
      },
      checkbox: {
        baseDataType: 'object',
        extendsDataType: 'object',
      },
      combo: {
        baseDataType: 'object',
        extendsDataType: 'object',
      },
      ajaxCombo: {
        baseDataType: 'object',
        extendsDataType: 'object',
      }
    };
  }, []);

  const onGridReady = useCallback((params) => {
    if (props.api) {
      props.api(params.api);
    }
    if (ref) {
      setGridApi(params.api);
    }
    
    Object.keys(P2AgGridModule.apiFunctions).forEach((key) => {
      params.api[key] = P2AgGridModule.apiFunctions[key].bind(this, params.api);
    });
    
    if (props.onGridReady) {
      props.onGridReady(params);
    }
  }, []);

  const onCellValueChanged = useCallback((params) => {
    if (props.onCellValueChanged) {
      props.onCellValueChanged(params);
    }
    if (showStatusColumn && params.oldValue !== params.newValue) {
      if (
        params.data[statusField] !== insertStatus &&
        params.data[statusField] !== deleteStatus
      ) {
        params.node.setDataValue(statusField, updateStatus);
      }
    }
  }, []);

  const onSelectionChanged = useCallback(async (params) => {
    const selectedNode = await params.api.getSelectedNode();

    if (props.onBeforeRowSelected && oldSelectedRowIndex !== selectedNode.rowIndex) {
      const result = props.onBeforeRowSelected({
        api: params.api,
        node: params.api.getDisplayedRowAtIndex(oldSelectedRowIndex),
      });
      if (!result) {
        params.api.getDisplayedRowAtIndex(oldSelectedRowIndex).setSelected(false);
        return;
      }
      setOldSelectedRowIndex(selectedNode.rowIndex);
    }

    if (props.onSelectionChanged) {
      props.onSelectionChanged(params);
    }
  }, []);

  return (
    <AgGridReact
      {...props}
      animateRows={false}
      theme={themeQuartz}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowData={rowData}
      rowHeight={props.rowHeight || 35}
      headerHeight={defaultHeaderHeight}
      rowSelection={props.rowSelection || rowSelection}
      singleClickEdit={props.singleClickEdit || true}
      tooltipShowDelay={props.tooltipShowDelay || 500}
      stopEditingWhenCellsLoseFocus={props.stopEditingWhenCellsLoseFocus || true}
      dataTypeDefinitions={dataTypeDefinitions}
      onGridReady={onGridReady}
      onCellValueChanged={onCellValueChanged}
      onSelectionChanged={onSelectionChanged}
    />
  );
}

export default forwardRef(P2AgGrid);

