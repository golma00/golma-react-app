import React, { Children, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { 
  P2Select, 
  P2DatePicker, 
  P2MonthPicker, 
  P2RangePicker, 
  P2TimePicker, 
  P2Input,
  P2InputNumber,
  P2InputPassword,
  P2InputTextArea,
  P2Checkbox,
  P2Switch,
  P2RadioGroup 
} from "components/control/index";
import { statusField, insertStatus, updateStatus, deleteStatus } from "components/grid/P2AgGrid";

function P2FormArea(props, ref) {

  const [formData, setFormData] = useState({});
  const [formHide, setFormHide] = useState({});
  const [formDisabled, setFormDisabled] = useState({});
  const [childrenMap, setChildrenMap] = useState({});

  useEffect(() => {
    if (props.rowNode) {
      Object.keys(props.rowNode.data).forEach((key) => {
        if (childrenMap.hasOwnProperty(key)) {
          setFormData(prev => ({ ...prev, [key]: props.rowNode.data[key] }));
        }
      });
    }
  }, [props.rowNode, childrenMap]);

  useEffect(() => {
    if (props.treeNode) {
      Object.keys(props.treeNode.props.dataRef).forEach((key) => {
        if (childrenMap.hasOwnProperty(key)) {
          setFormData(prev => ({ ...prev, [key]: props.treeNode.props.dataRef[key] }));
        }

      });
    }
  }, [props.treeNode, childrenMap]);

  useImperativeHandle(ref, () => ({
    api: {
      get() {
        return formData;
      },
      set(name, value) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        })); 
      },
      hidden(name, hidden) {
        setFormHide((prev) => ({
          ...prev,
          [name]: hidden,
        }));
      },
      allHidden(hidden) {
        Object.keys(formData).forEach((key) => {
          setFormHide((prev) => ({
            ...prev,
            [key]: hidden,
          }));
        });
      },
      disabled(name, disabled) {
        setFormDisabled((prev) => ({
          ...prev,
          [name]: disabled,
        }));
      },
      allDisabled(disabled) {
        Object.keys(formData).forEach((key) => {
          setFormDisabled((prev) => ({
            ...prev,
            [key]: disabled,
          }));
        });
      },
      clear() {
        Object.keys(formData).forEach((key) => {
          setFormData((prev) => ({
            ...prev,
            [key]: undefined,
          }));
        });
      },
    }
  }));

  useEffect(() => {
    let initData = {};
    let initHide = {};
    let initDisabled = {};
    function recursiveSearch(children) {
      if (children) {
        children.forEach((child) => {
          if (child.type === "input") {
            switch (child.props.type) {
              case "text":
              case "email":
              case "password":
              case "color":
              case "date":
              case "datetime-local":
              case "month":
              case "search":
              case "tel":
              case "time":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || "";
                  initHide[child.props.name] = child.props.hide || false;
                  initDisabled[child.props.name] = child.props.disabled || false;
                  setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
                }
                break;
              case "number":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || 0;
                  initHide[child.props.name] = child.props.hide || false;
                  initDisabled[child.props.name] = child.props.disabled || false;
                  setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
                }
                break;
              case "checkbox":
                if (child.props.name) {
                  initData[child.props.name] = child.props.checked || false;
                  initHide[child.props.name] = child.props.hide || false;
                  initDisabled[child.props.name] = child.props.disabled || false;
                  setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
                }
                break;
              case "radio":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || "";
                  initHide[child.props.name] = child.props.hide || false;
                  initDisabled[child.props.name] = child.props.disabled || false;
                  setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
                }
                break;
              default:
                break;
            }
          }
          else if (child.type === "textarea" || child.type === P2InputTextArea) {
            if (child.props.name) {
              initData[child.props.name] = child.props.value || "";
              initHide[child.props.name] = child.props.hide || false;
              initDisabled[child.props.name] = child.props.disabled || false;
              setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
            }
          }
          else if (child.type === P2Select) {
            if (child.props.name) {
              initData[child.props.name] = child.props.value || "";
              initHide[child.props.name] = child.props.hide || false;
              initDisabled[child.props.name] = child.props.disabled || false;
              setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
            }
          }
          else if (child.type === P2Input
            || child.type === P2InputPassword
            || child.type === P2DatePicker
            || child.type === P2MonthPicker
            || child.type === P2TimePicker
            || child.type === P2RadioGroup
          ) {
            initData[child.props.name] = child.props.value || "";
            initHide[child.props.name] = child.props.hide || false;
            initDisabled[child.props.name] = child.props.disabled || false;
            setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
          }
          else if (child.type === P2InputNumber) {
            initData[child.props.name] = child.props.value || 0;
            initHide[child.props.name] = child.props.hide || false;
            initDisabled[child.props.name] = child.props.disabled || false;
            setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
          }
          else if (child.type === P2Checkbox || child.type === P2Switch) {
            initData[child.props.name] = child.props.checked;
            initHide[child.props.name] = child.props.hide || false;
            initDisabled[child.props.name] = child.props.disabled || false;
            setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
          }

          if (child.props.children && child.props.children instanceof Array) {
            recursiveSearch(child.props.children);
          }
          else if (child.type === "div" && child.props.children instanceof Object) {
            recursiveSearch([child.props.children]);
          }
        });
      }
    }

    if (props.children && props.children.length > 0) {
      recursiveSearch(props.children);
    }
    setFormData(initData);
  }, [])

  function recursiveRender(child, index) {
    if (child.props.children && (child.props.children instanceof Object || child.props.children instanceof Array)) {
      const children = [...Children.map(child.props.children, (child, index) => {
        return recursiveRender(child, index);
      })];

      if (child.type === "div") {
        return <div key={index} {...child.props}>{children}</div>;
      }
    }

    if (child.type === "label") {
      return <label key={index} {...child.props}>{child.props.children}</label>;
    }
    else if (child.type === "div") {
      return <div key={index}>{child.props.children}</div>;
    }
    else if (child.type === "input") {
      switch (child.props.type) {
        case "text":
        case "email":
        case "password":
        case "color":
        case "date":
        case "datetime-local":
        case "month":
        case "search":
        case "tel":
        case "time":
          return (
            <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
              <React.Fragment key={index}>
                {React.cloneElement(child, {
                  value: formData[child.props.name] || "",
                  hidden: formHide[child.props.name] || false,
                  disabled: formDisabled[child.props.name] || false,
                  onChange: (e) => {
                    if (child.props.onChange) {
                      child.props.onChange(e);
                    }
                    const targetValue = e.target && e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                    if (props.rowNode) {
                      updateRowData(child.props.name, targetValue);
                    }
                    if (props.treeNode) {
                      updateTreeNodeData(child.props.name, targetValue);
                    }
                  },
                  onKeyDown: (e) => {
                    if (child.props.onKeyDown) {
                      child.props.onKeyDown(e);
                    }
                    const targetValue = e.target && e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                    if (props.rowNode) {
                      updateRowData(child.props.name, targetValue);
                    }
                    if (props.treeNode) {
                      updateTreeNodeData(child.props.name, targetValue);
                    }
                  },
                })}
              </React.Fragment>
            </div>
          );
          case "number":
            return (
              <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
                <React.Fragment key={index}>
                  {React.cloneElement(child, {
                    value: formData[child.props.name] || 0,
                    hidden: formHide[child.props.name] || false,
                    disabled: formDisabled[child.props.name] || false,
                    onChange: (e) => {
                      if (child.props.onChange) {
                        child.props.onChange(e);
                      }
                      const targetValue = e.target && e.target.value;
                      formData((prev) => ({
                        ...prev,
                        [child.props.name]: targetValue,
                      }));
                      if (props.rowNode) {
                        updateRowData(child.props.name, targetValue);
                      }
                      if (props.treeNode) {
                        updateTreeNodeData(child.props.name, targetValue);
                      }
                    },
                    onKeyDown: (e) => {
                      if (child.props.onKeyDown) {
                        child.props.onKeyDown(e);
                      }
                      const targetValue = e.target && e.target.value;
                      formData((prev) => ({
                        ...prev,
                        [child.props.name]: targetValue,
                      }));
                      if (props.rowNode) {
                        updateRowData(child.props.name, targetValue);
                      }
                      if (props.treeNode) {
                        updateTreeNodeData(child.props.name, targetValue);
                      }
                    },
                  })}
                </React.Fragment>
              </div>
            );
        case "checkbox":
          return (
            <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
              <React.Fragment key={index}>
                {React.cloneElement(child, {
                  checked: formData[child.props.name] === "Y" || false,
                  onChange: (e) => {
                    if (child.props.onChange) {
                      child.props.onChange(e);
                    }
                    const targetValue = e.target && e.target.checked ? "Y" : "N";
                    setFormData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                    if (props.rowNode) {
                      updateRowData(child.props.name, targetValue);
                    }
                    if (props.treeNode) {
                      updateTreeNodeData(child.props.name, targetValue);
                    }
                  },
                })}
              </React.Fragment>
            </div>
          );
        case "radio":
          return (
            <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
              <React.Fragment key={index}>
                {React.cloneElement(child, {
                  value: formData[child.props.name] || "",
                  hidden: formHide[child.props.name] || false,
                  disabled: formDisabled[child.props.name] || false,
                  onChange: (e) => {
                    if (child.props.onChange) {
                      child.props.onChange(e);
                    }
                    const targetValue = e.target && e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                    if (props.rowNode) {
                      updateRowData(child.props.name, targetValue);
                    }
                    if (props.treeNode) {
                      updateTreeNodeData(child.props.name, targetValue);
                    }
                  },
                })}
              </React.Fragment>
            </div>
          );
        default:
          return <React.Fragment key={index}>{child}</React.Fragment>;
      }
    }
    else if (child.type === "textarea" || child.type === P2InputTextArea) {
      return (
        <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
          <React.Fragment key={index}>v
            {React.cloneElement(child, {
              value: formData[child.props.name] || "",
              hidden: formHide[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e) => {
                if (child.props.onChange) {
                  child.props.onChange(e);
                }
                const targetValue = e.target && e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (props.rowNode) {
                  updateRowData(child.props.name, targetValue);
                }
                if (props.treeNode) {
                  updateTreeNodeData(child.props.name, targetValue);
                }
              },
            })}
          </React.Fragment>
        </div>
      );
    }
    else if (child.type === P2Select) {
      return (
        <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
          <React.Fragment key={index}>
            {React.cloneElement(child, {
              optionValue: formData[child.props.name] || "",
              hidden: formHide[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e) => {
                if (child.props.onChange) {
                  child.props.onChange(e);
                }
                const targetValue = child.props.isMulti ? e.map(item => item.value) : e.value;
                setFormData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (props.rowNode) {
                  updateRowData(child.props.name, targetValue);
                }
                if (props.treeNode) {
                  updateTreeNodeData(child.props.name, targetValue);
                }
              },
            })}
          </React.Fragment>
        </div>
      );
    }
    else if (child.type === P2Input) {
      return (
        <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
          <React.Fragment key={index}>
            {React.cloneElement(child, {
              value: formData[child.props.name] || "",
              hidden: formHide[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e) => {
                if (child.props.onChange) {
                  child.props.onChange(e);
                }
                const targetValue = e.target && e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (props.rowNode) {
                  updateRowData(child.props.name, targetValue);
                }
                if (props.treeNode) {
                  updateTreeNodeData(child.props.name, targetValue);
                }
              },
              
            })}
          </React.Fragment>
        </div>
      );
    }
    else if (child.type === P2DatePicker || child.type === P2MonthPicker || child.type === P2TimePicker) {
      return (
        <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
          <React.Fragment key={index}>
            {React.cloneElement(child, {
              value: formData[child.props.name] || "",
              hidden: formHide[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e, formatString) => {
                if (child.props.onChange) {
                  child.props.onChange(e, formatString);
                }
                const targetValue = formatString;
                setFormData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (props.rowNode) {
                  updateRowData(child.props.name, targetValue);
                }
                if (props.treeNode) {
                  updateTreeNodeData(child.props.name, targetValue);
                }
              }
            })}
          </React.Fragment>
        </div>
      );
    }
    else if (child.type === P2RangePicker) {
      return (
        <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
          <React.Fragment key={index}>
            {React.cloneElement(child, {
              value: formData[child.props.name] || [null, null],
              hidden: formHide[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e, formatStrings) => {
                if (child.props.onChange) {
                  child.props.onChange(e, formatStrings);
                }
                const targetValue = formatStrings;
                setFormData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (props.rowNode) {
                  updateRowData(child.props.name, targetValue);
                }
                if (props.treeNode) {
                  updateTreeNodeData(child.props.name, targetValue);
                }
              }
            })}
          </React.Fragment>
        </div>
      );
    }
    else if (child.type === P2InputNumber) {
      return (
        <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
          <React.Fragment key={index}>
            {React.cloneElement(child, {
              value: formData[child.props.name] || 0,
              hidden: formHide[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (value) => {
                if (child.props.onChange) {
                  child.props.onChange(value);
                }
                const targetValue = value;
                setFormData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (props.rowNode) {
                  updateRowData(child.props.name, targetValue);
                }
                if (props.treeNode) {
                  updateTreeNodeData(child.props.name, targetValue);
                }
              },
            })}
          </React.Fragment>
        </div>
      );
    }
    else if (child.type === P2Checkbox || child.type === P2Switch) {
      return (
        <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
          <React.Fragment key={index}>
            {React.cloneElement(child, {
              value: formData[child.props.name] || child.props.falseValue,
              hidden: formHide[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (checked) => {
                if (child.props.onChange) {
                  child.props.onChange(checked);
                }
                const targetValue = checked ? child.props.trueValue : child.props.falseValue;
                setFormData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (props.rowNode) {
                  updateRowData(child.props.name, targetValue);
                }
                if (props.treeNode) {
                  updateTreeNodeData(child.props.name, targetValue);
                }
              },
            })}
          </React.Fragment>
        </div>
      );
    }
    else if (child.type === P2RadioGroup) {
      return (
        <div style={{ display: formHide[child.props.name] ? "none" : "block" }}>
          <React.Fragment key={index}>
            {React.cloneElement(child, {
              value: formData[child.props.name] || "",
              hidden: formHide[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e) => {
                if (child.props.onChange) {
                  child.props.onChange(e);
                }
                const targetValue = e.target && e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (props.rowNode) {
                  updateRowData(child.props.name, targetValue);
                }
                if (props.treeNode) {
                  updateTreeNodeData(child.props.name, targetValue);
                }
              },
            })}
          </React.Fragment>
        </div>
      );
    }
    else {
      return <React.Fragment key={index}>{child}</React.Fragment>;
    }
  }

  function updateRowData(key, value) {
    if (props.rowNode) {

      const result = props.rowNode.setDataValue(key, value);

      if (!result) {
        props.rowNode.data[key] = value;

        switch (props.rowNode.data[statusField]) {
          case insertStatus:
          case updateStatus:
          case deleteStatus:
            break;
          default:
            props.rowNode.setDataValue(statusField, updateStatus);
            break;
        }
      }
    }
  }

  function updateTreeNodeData(key, value) {
    if (props.treeNode) {
      props.treeNode.props.dataRef[key] = value;
      if (props.treeNode.props.dataRef["_status"] === "") {
        props.treeNode.props.dataRef["_status"] = "U";
      }
      props.treeNode.props.update();
    }
  }

  return (
    <div className={props.className || "p2-form-area"}>
      {Children.map(props.children, (child, index) => {
        return recursiveRender(child, index);
      })}
    </div>
  )
}

export default forwardRef(P2FormArea);
