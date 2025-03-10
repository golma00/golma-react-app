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
    }
  }));

  useEffect(() => {
    let initData = {};
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
                  setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
                }
                break;
              case "number":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || 0;
                  setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
                }
                break;
              case "checkbox":
                if (child.props.name) {
                  initData[child.props.name] = child.props.checked || false;
                  setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
                }
                break;
              case "radio":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || "";
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
              setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
            }
          }
          else if (child.type === P2Select) {
            if (child.props.name) {
              initData[child.props.name] = child.props.value || "";
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
            setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
          }
          else if (child.type === P2InputNumber) {
            initData[child.props.name] = child.props.value || 0;
            setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
          }
          else if (child.type === P2Checkbox || child.type === P2Switch) {
            initData[child.props.name] = child.props.checked || false;
            setChildrenMap(prev => ({ ...prev, [child.props.name]: child }));
          }

          if (child.props.children && child.props.children instanceof Array && child.props.children.length > 0) {
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
    if (child.props.children && child.props.children instanceof Array && child.props.children.length > 0) {

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
            <React.Fragment key={index}>
              {React.cloneElement(child, {
                value: formData[child.props.name] || "",
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
          );
          case "number":
            return (
              <React.Fragment key={index}>
                {React.cloneElement(child, {
                  value: formData[child.props.name] || 0,
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
            );
        case "checkbox":
          return (
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
          );
        case "radio":
          return (
            <React.Fragment key={index}>
              {React.cloneElement(child, {
                value: formData[child.props.name] || "",
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
          );
        default:
          return <React.Fragment key={index}>{child}</React.Fragment>;
      }
    }
    else if (child.type === "textarea" || child.type === P2InputTextArea) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: formData[child.props.name] || "",
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
      );
    }
    else if (child.type === P2Select) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            optionValue: formData[child.props.name] || "",
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
      );
    }
    else if (child.type === P2Input) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: formData[child.props.name] || "",
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
      );
    }
    else if (child.type === P2DatePicker || child.type === P2MonthPicker || child.type === P2TimePicker) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: formData[child.props.name] || "",
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
      );
    }
    else if (child.type === P2RangePicker) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: formData[child.props.name] || [null, null],
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
      );
    }
    else if (child.type === P2InputNumber) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: formData[child.props.name] || 0,
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
      );
    }
    else if (child.type === P2Checkbox || child.type === P2Switch) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            checked: formData[child.props.name] || false,
            onChange: (checked) => {
              if (child.props.onChange) {
                child.props.onChange(checked);
              }
              const targetValue = checked;
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
      );
    }
    else if (child.type === P2RadioGroup) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: formData[child.props.name] || "",
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
      );
    }
    else {
      return <React.Fragment key={index}>{child.props.children}</React.Fragment>;
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
      if (props.treeNode.props.dataRef["_state"] === "") {
        props.treeNode.props.dataRef["_state"] = "U";
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
