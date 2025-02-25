import { Component, PopupComponent, AgCheckboxSelector, AgSelectSelector, _getActiveDomElement, _missing, _warn } from 'ag-grid-community';

export class P2CheckboxCellEditor extends PopupComponent {
  constructor() {
    super(
      `
        <div class="ag-cell-wrapper ag-cell-edit-wrapper ag-checkbox-edit">
            <ag-checkbox role="presentation" data-ref="eCheckbox"></ag-checkbox>
        </div>
      `,
      [AgCheckboxSelector]
    );
    this.eCheckbox = null;
  }
  init(params) {
    this.params = params;
    const isSelected = params.value === "Y";
    const eCheckbox = this.eCheckbox;
    eCheckbox.setValue(isSelected);
    const inputEl = eCheckbox.getInputElement();
    inputEl.setAttribute("tabindex", "-1");
    this.setAriaLabel(isSelected);
    this.addManagedListeners(eCheckbox, {
      fieldValueChanged: (event) => this.setAriaLabel(event.selected)
    });
  }
  getValue() {
    return this.eCheckbox.getValue();
  }
  focusIn() {
    this.eCheckbox.getFocusableElement().focus();
  }
  afterGuiAttached() {
    if (this.params.cellStartedEdit) {
      this.focusIn();
    }
  }
  isPopup() {
    return false;
  }
  setAriaLabel(isSelected) {
    const translate = this.getLocaleTextFunc();
    const stateName = _getAriaCheckboxStateName(translate, isSelected);
    const ariaLabel = translate("ariaToggleCellValue", "Press SPACE to toggle cell value");
    this.eCheckbox.setInputAriaLabel(`${ariaLabel} (${stateName})`);
  }
}

export class P2CheckboxCellRenderer extends Component {
  constructor() {
    super(
      `
        <div class="ag-cell-wrapper ag-checkbox-cell" role="presentation">
            <ag-checkbox role="presentation" data-ref="eCheckbox"></ag-checkbox>
        </div>
      `,
      [AgCheckboxSelector]
    );
    this.eCheckbox = null;
    this.registerCSS(`.ag-checkbox-cell{height:100%}`);
  }
  init(params) {
    this.refresh(params);
    const { eCheckbox, beans } = this;
    const inputEl = eCheckbox.getInputElement();
    inputEl.setAttribute("tabindex", "-1");
    _setAriaLive(inputEl, "polite");
    this.addManagedListeners(inputEl, {
      click: (event) => {
        _stopPropagationForAgGrid(event);
        if (eCheckbox.isDisabled()) {
          return;
        }
        const isSelected = eCheckbox.getValue();
        this.onCheckboxChanged(isSelected);
      },
      dblclick: (event) => {
        _stopPropagationForAgGrid(event);
      }
    });
    this.addManagedElementListeners(params.eGridCell, {
      keydown: (event) => {
        if (event.key === ' ' && !eCheckbox.isDisabled()) {
          if (params.eGridCell === _getActiveDomElement(beans)) {
            eCheckbox.toggle();
          }
          const isSelected = eCheckbox.getValue();
          this.onCheckboxChanged(isSelected);
          event.preventDefault();
        }
      }
    });
  }
  refresh(params) {
    this.params = params;
    this.updateCheckbox(params);
    return true;
  }
  updateCheckbox(params) {
    let isSelected;
    let displayed = true;
    const { value, column, node } = params;
    if (node.group && column) {
      if (typeof value === "boolean") {
        isSelected = value;
      } else {
        const colId = column.getColId();
        if (colId.startsWith("ag-Grid-AutoColumn")) {
          isSelected = value == null || value === "" ? void 0 : value === "true" || value === "Y";
        } else if (node.aggData && node.aggData[colId] !== void 0) {
          isSelected = value === "Y";
        } else {
          displayed = false;
        }
      }
    } else {
      isSelected = value === "Y";
    }
    const { eCheckbox } = this;
    if (!displayed) {
      eCheckbox.setDisplayed(false);
      return;
    }
    eCheckbox.setValue(isSelected);
    const disabled = params.disabled ?? !column?.isCellEditable(node);
    eCheckbox.setDisabled(disabled);
    const translate = this.getLocaleTextFunc();
    const stateName = _getAriaCheckboxStateName(translate, isSelected);
    const ariaLabel = disabled ? stateName : `${translate("ariaToggleCellValue", "Press SPACE to toggle cell value")} (${stateName})`;
    eCheckbox.setInputAriaLabel(ariaLabel);
  }
  onCheckboxChanged(isSelected) {
    const { eventSvc, params } = this;
    const { column, node, value } = params;
    const sharedEventParams = {
      column,
      colDef: column.getColDef(),
      data: node.data,
      node,
      rowIndex: node.rowIndex,
      rowPinned: node.rowPinned,
      value
    };
    eventSvc.dispatchEvent({
      type: "cellEditingStarted",
      ...sharedEventParams
    });
    const valueChanged = node.setDataValue(column, isSelected ? "Y" : "N", "edit");
    eventSvc.dispatchEvent({
      type: "cellEditingStopped",
      ...sharedEventParams,
      oldValue: value,
      newValue: isSelected,
      valueChanged
    });
    if (!valueChanged) {
      this.updateCheckbox(params);
    }
  }
}

export class P2ComboboxCellEditor extends PopupComponent {
  constructor() {
    super(
      /* html */
      `<div class="ag-cell-edit-wrapper">
          <ag-select class="ag-cell-editor" data-ref="eSelect"></ag-select>
      </div>`,
      [AgSelectSelector]
    );
    this.eSelect = null;
    this.startedByEnter = false;
  }
  wireBeans(beans) {
    this.valueSvc = beans.valueSvc;
  }
  init(params) {
    this.focusAfterAttached = params.cellStartedEdit;
    const { eSelect, valueSvc, gos } = this;
    const { values, value, eventKey, valueField, displayField } = params;
    if (_missing(values)) {
      _warn(58);
      return;
    }
    this.startedByEnter = eventKey != null ? eventKey === KeyCode.ENTER : false;
    let hasValue = false;
    values.forEach((currentValue) => {
      const option = { value: currentValue[valueField || "value"] };
      const valueFormatted = valueSvc.formatValue(params.column, null, currentValue[valueField || "value"]);
      const valueFormattedExits = valueFormatted !== null && valueFormatted !== void 0;
      option.text = valueFormattedExits ? valueFormatted : currentValue[displayField || "text"];
      eSelect.addOption(option);
      hasValue = hasValue || value === currentValue[valueField || "value"];
    });
    if (hasValue) {
      eSelect.setValue(params.value, true);
    } 
    else if (params.values.length) {
      eSelect.setValue(params.values[0], true);
    }
    const { valueListGap, valueListMaxWidth, valueListMaxHeight } = params;
    if (valueListGap != null) {
      eSelect.setPickerGap(valueListGap);
    }
    if (valueListMaxHeight != null) {
      eSelect.setPickerMaxHeight(valueListMaxHeight);
    }
    if (valueListMaxWidth != null) {
      eSelect.setPickerMaxWidth(valueListMaxWidth);
    }
    if (gos.get("editType") !== "fullRow") {
      this.addManagedListeners(this.eSelect, { selectedItem: () => params.stopEditing() });
    }
  }
  afterGuiAttached() {
    if (this.focusAfterAttached) {
      this.eSelect.getFocusableElement().focus();
    }
    if (this.startedByEnter) {
      setTimeout(() => {
        if (this.isAlive()) {
          this.eSelect.showPicker();
        }
      });
    }
  }
  focusIn() {
    this.eSelect.getFocusableElement().focus();
  }
  getValue() {
    return this.eSelect.getValue();
  }
  isPopup() {
    return false;
  }
};

export class P2AjaxComboboxCellEditor extends P2ComboboxCellEditor {
  async init(params) {
    this.focusAfterAttached = params.cellStartedEdit;
    const { eSelect, valueSvc, gos } = this;
    const { ajax, value, eventKey, valueField, displayField } = params;
    if (!ajax) {
      console.warn("P2AjaxComboboxCellEditor: no ajax");
      return;
    }

    const values = await ajax(params);

    if (_missing(values)) {
      _warn(58);
      return;
    }
    this.startedByEnter = eventKey != null ? eventKey === KeyCode.ENTER : false;
    let hasValue = false;
    values.forEach((currentValue) => {
      const option = { value: currentValue[valueField || "value"] };
      const valueFormatted = valueSvc.formatValue(params.column, null, currentValue[valueField || "value"]);
      const valueFormattedExits = valueFormatted !== null && valueFormatted !== void 0;
      option.text = valueFormattedExits ? valueFormatted : currentValue[displayField || "text"];
      eSelect.addOption(option);
      hasValue = hasValue || value === currentValue[valueField || "value"];
    });
    if (hasValue) {
      eSelect.setValue(params.value, true);
    } 
    else if (params.values.length) {
      eSelect.setValue(params.values[0], true);
    }
    const { valueListGap, valueListMaxWidth, valueListMaxHeight } = params;
    if (valueListGap != null) {
      eSelect.setPickerGap(valueListGap);
    }
    if (valueListMaxHeight != null) {
      eSelect.setPickerMaxHeight(valueListMaxHeight);
    }
    if (valueListMaxWidth != null) {
      eSelect.setPickerMaxWidth(valueListMaxWidth);
    }
    if (gos.get("editType") !== "fullRow") {
      this.addManagedListeners(this.eSelect, { selectedItem: () => params.stopEditing() });
    }
  }
}

//------------------ checked 컬럼 관련 ----------------------//

export class CommonHeaderCheckedComponet {
  init(params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.className = "ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper";

    this.eCheckbox = document.createElement('input');
    this.eCheckbox.type = "checkbox";
    this.eCheckbox.className = "ag-input-field-input ag-checkbox-input";
    this.eCheckbox.addEventListener("change", (e) => {
        this.eGui.classList.toggle("ag-checked");
        if (e.target.checked) {
            this.params.api.allCheckedRows();
        }
        else {
            this.params.api.allUncheckedRows();
        }
    });

    this.eGui.appendChild(this.eCheckbox);
  }
  getGui() {
    return this.eGui;
  }
  refresh(params) {
    return false;
  }
  destroy() {
  }
}

export class CommonCheckedEditor extends P2CheckboxCellEditor {
  init(params) {
    this.params = params;
    const isSelected = params.node.isChecked === true;
    const eCheckbox = this.eCheckbox;
    eCheckbox.setValue(isSelected);
    const inputEl = eCheckbox.getInputElement();
    inputEl.setAttribute("tabindex", "-1");
    this.setAriaLabel(isSelected);
    this.addManagedListeners(eCheckbox, {
      fieldValueChanged: (event) => this.setAriaLabel(event.selected)
    });
  }
  getValue() {
    return this.params.isChecked;
  }
}

export class CommonCheckedRenderer extends P2CheckboxCellRenderer {
  updateCheckbox(params) {
    let isSelected;
    let displayed = true;
    const { column, node } = params;
    if (params.node) {
      isSelected = params.node.isChecked === true;
    }
    const { eCheckbox } = this;
    if (!displayed) {
      eCheckbox.setDisplayed(false);
      return;
    }
    eCheckbox.setValue(isSelected);
    const disabled = params.disabled ?? !column?.isCellEditable(node);
    eCheckbox.setDisabled(disabled);
    const translate = this.getLocaleTextFunc();
    const stateName = _getAriaCheckboxStateName(translate, isSelected);
    const ariaLabel = disabled ? stateName : `${translate("ariaToggleCellValue", "Press SPACE to toggle cell value")} (${stateName})`;
    eCheckbox.setInputAriaLabel(ariaLabel);
  }
  onCheckboxChanged(isSelected) {
    const { params } = this;
    const { column, node } = params;
    const valueChanged = node.setDataValue(column, isSelected, "edit");
    if (!valueChanged) {
      this.updateCheckbox(params);
    }
    params.node.isChecked = isSelected;
  }
}

function _getAriaCheckboxStateName(translate, state) {
  return state === void 0 ? translate("ariaIndeterminate", "indeterminate") : state === true ? translate("ariaChecked", "checked") : translate("ariaUnchecked", "unchecked");
}
function _setAriaLive(element, live) {
  _toggleAriaAttribute(element, "live", live);
}
function _toggleAriaAttribute(element, attribute, value) {
  if (value == null || (typeof value === "string" && value === "")) {
    _removeAriaAttribute(element, attribute);
  } else {
    _setAriaAttribute(element, attribute, value);
  }
}
function _setAriaAttribute(element, attribute, value) {
  element.setAttribute(_ariaAttributeName(attribute), value.toString());
}
function _removeAriaAttribute(element, attribute) {
  element.removeAttribute(_ariaAttributeName(attribute));
}
function _ariaAttributeName(attribute) {
  return `aria-${attribute}`;
}
var AG_GRID_STOP_PROPAGATION = "__ag_Grid_Stop_Propagation";
function _stopPropagationForAgGrid(event) {
  event[AG_GRID_STOP_PROPAGATION] = true;
}

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