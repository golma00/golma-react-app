import { Component, PopupComponent, AgCheckboxSelector, _getActiveDomElement } from 'ag-grid-community';

class P2CheckboxCellEditor extends PopupComponent {
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

class P2CheckboxCellRenderer extends Component {
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

export { P2CheckboxCellEditor, P2CheckboxCellRenderer };

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
