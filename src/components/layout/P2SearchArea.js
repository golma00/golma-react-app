import React, { Children, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
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
  P2RadioGroup,
  P2MessageBox
} from "components/control/index";
import { Tooltip } from "antd";

function P2SearchArea(props, ref) {
  const className = props.className || "p2-search-area";

  const [searchData, setSearchData] = useState({});
  const [changeAfterSearch, setChangeAfterSearch] = useState(false);
  const [valid, setValid] = useState({});
  const [errors, setErrors] = useState({});
  const [lables, setLables] = useState({});
  const [formHidden, setFormHidden] = useState({});
  const [formDisabled, setFormDisabled] = useState({});
  useImperativeHandle(ref, () => ({
    api: {
      get() {
        return searchData;
      },
      set(name, value) {
        setSearchData((prev) => ({
          ...prev,
          [name]: value,
        })); 
      },
      hidden(name, hidden) {
        setFormHidden((prev) => ({
          ...prev,
          [name]: hidden,
        }));
      },
      allHidden(hidden) {
        Object.keys(searchData).forEach((key) => {
          setFormHidden((prev) => ({
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
        Object.keys(searchData).forEach((key) => {
          setFormDisabled((prev) => ({
            ...prev,
            [key]: disabled,
          }));
        });
      },
      clear() {
        Object.keys(searchData).forEach((key) => {
          setSearchData((prev) => ({
            ...prev,
            [key]: undefined,
          }));
        });
      },
      setValid(valid) {
        Object.keys(valid).forEach((key) => {
          if (valid[key]) {
            setValid((prev) => ({
              ...prev,
              [key]: valid[key],
            }));
          }
        });
      },
      async validate() {
        let newErrors = {};
        let errorMessages = [];
        Object.keys(valid).forEach((key) => {
          const validationFunction = valid[key];
          if (typeof validationFunction === "function") {
            const errorMessage = validationFunction({ value: searchData[key], data: searchData, key: key });
            if (errorMessage) {
              const label = lables[key] ? `[${lables[key]}]: ` : "";
              newErrors[key] = errorMessage;
              errorMessages.push(`${label}${errorMessage}`);
            }
          }
        });
        setErrors(newErrors);
        if (errorMessages.length > 0) {
          const message = errorMessages.join("\n");
          P2MessageBox.warn(message);
          return message;
        }
        return "";
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
                }
                break;
              case "number":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || 0;
                  initHide[child.props.name] = child.props.hide || false;
                  initDisabled[child.props.name] = child.props.disabled || false;
                }
                break;
              case "checkbox":
                if (child.props.name) {
                  initData[child.props.name] = child.props.checked || false;
                  initHide[child.props.name] = child.props.hide || false;
                  initDisabled[child.props.name] = child.props.disabled || false;

                  if (child.props.children) {
                    setLables(prev => ({ ...prev, [child.props.name]: child.props.children }));
                  }
                }
                break;
              case "radio":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || "";
                  initHide[child.props.name] = child.props.hide || false;
                  initDisabled[child.props.name] = child.props.disabled || false;
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
            }
          }
          else if (child.type === P2Select) {
            if (child.props.name) {
              initData[child.props.name] = child.props.value || [];
              initHide[child.props.name] = child.props.hide || false;
              initDisabled[child.props.name] = child.props.disabled || false;
            }
          }
          else if (child.type === "label") {
            if (child.props.htmlFor) {
              setLables(prev => ({ ...prev, [child.props.htmlFor]: child.props.children }));
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
          }
          else if (child.type === P2InputNumber) {
            initData[child.props.name] = child.props.value || 0;
            initHide[child.props.name] = child.props.hide || false;
            initDisabled[child.props.name] = child.props.disabled || false;
          }
          else if (child.type === P2Checkbox || child.type === P2Switch) {
            initData[child.props.name] = child.props.checked || false;
            initHide[child.props.name] = child.props.hide || false;
            initDisabled[child.props.name] = child.props.disabled || false;
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
    setSearchData(initData);
  }, [])

  useEffect(() => {
    if (changeAfterSearch) {
      props.onSearch(searchData);
    }
    return () => {
      setChangeAfterSearch(false);
    };
  }, [changeAfterSearch]);

  function recursiveRender(child, index) {

    const name = child.props.name;

    const errorClass = errors[name] && (
      child.type === P2Checkbox
        ? "ant-checkbox-status-error"
        : child.type === P2RadioGroup
        ? "ant-radio-status-error"
        : "ant-status-error"
    );

    const tooltipText = errors[name] || child.props.tooltip; //메세지

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
          return formHidden[child.props.name] !== true && (
            <React.Fragment key={index}>
              <Tooltip key={index} title={tooltipText} placement="bottom">
                {React.cloneElement(child, {
                  className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
                  value: searchData[child.props.name] || "",
                  hidden: formHidden[child.props.name] || false,
                  disabled: formDisabled[child.props.name] || false,
                  onChange: (e) => {
                    if (child.props.onChange) {
                      child.props.onChange(e);
                    }
                    const targetValue = e.target && e.target.value;
                    setSearchData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                  },
                  onKeyDown: (e) => {
                    if (child.props.onKeyDown) {
                      child.props.onKeyDown(e);
                    }
                    const targetValue = e.target && e.target.value;
                    setSearchData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                    if (e.key === "Enter") {
                      setChangeAfterSearch(true);
                    }
                  },
                })}
              </Tooltip>
            </React.Fragment>
          );
        case "number":
          return formHidden[child.props.name] !== true && (
            <React.Fragment key={index}>
              <Tooltip key={index} title={tooltipText} placement="bottom">
                {React.cloneElement(child, {
                  className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
                  value: searchData[child.props.name] || 0,
                  hidden: formHidden[child.props.name] || false,
                  disabled: formDisabled[child.props.name] || false,
                  onChange: (e) => {
                    if (child.props.onChange) {
                      child.props.onChange(e);
                    }
                    const targetValue = e.target && e.target.value;
                    setSearchData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                  },
                  onKeyDown: (e) => {
                    if (child.props.onKeyDown) {
                      child.props.onKeyDown(e);
                    }
                    const targetValue = e.target && e.target.value;
                    setSearchData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                    if (e.key === "Enter") {
                      setChangeAfterSearch(true);
                    }
                  },
                })}
              </Tooltip>
            </React.Fragment>
          );
        case "checkbox":
          return formHidden[child.props.name] !== true && (
            <React.Fragment key={index}>
              <Tooltip key={index} title={tooltipText} placement="bottom">
                {React.cloneElement(child, {
                  className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
                  checked: searchData[child.props.name] || false,
                  hidden: formHidden[child.props.name] || false,
                  disabled: formDisabled[child.props.name] || false,
                  onChange: (e) => {
                    if (child.props.onChange) {
                      child.props.onChange(e);
                    }
                    const targetValue = e.target && e.target.checked;
                    setSearchData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                    if (child.props.changeAfterSearch) {
                      setChangeAfterSearch(true);
                    }
                  },
                })}
              </Tooltip>
            </React.Fragment>
          );
        case "radio":
          return formHidden[child.props.name] !== true && (
            <React.Fragment key={index}>
              <Tooltip key={index} title={tooltipText} placement="bottom">
                {React.cloneElement(child, {
                  className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
                  value: searchData[child.props.name] || "",
                  hidden: formHidden[child.props.name] || false,
                  disabled: formDisabled[child.props.name] || false,
                  onChange: (e) => {
                    if (child.props.onChange) {
                      child.props.onChange(e);
                    }
                    const targetValue = e.target && e.target.value;
                    setSearchData((prev) => ({
                      ...prev,
                      [child.props.name]: targetValue,
                    }));
                    if (child.props.changeAfterSearch) {
                      setChangeAfterSearch(true);
                    }
                  },
                })}
              </Tooltip>
            </React.Fragment>
          );
        default:
          return <React.Fragment key={index}>{child}</React.Fragment>;
      }
    }
    else if (child.type === "textarea" || child.type === P2InputTextArea) {
      return formHidden[child.props.name] !== true && (
        <React.Fragment key={index}>
          <Tooltip key={index} title={tooltipText} placement="bottom">
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
              value: searchData[child.props.name] || "",
              hidden: formHidden[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e) => {
                if (child.props.onChange) {
                  child.props.onChange(e);
                }
                const targetValue = e.target && e.target.value;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (child.props.changeAfterSearch) {
                  setChangeAfterSearch(true);
                }
              },
            })}
          </Tooltip>
        </React.Fragment>
      );
    }
    else if (child.type === P2Select) {
      return formHidden[child.props.name] !== true && (
        <React.Fragment key={index}>
          <Tooltip key={index} title={tooltipText} placement="bottom">
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
              optionValue: searchData[child.props.name] || [],
              hidden: formHidden[child.props.name] || false,
              isDisabled: formDisabled[child.props.name] || false,
              onChange: (e) => {
                if (child.props.onChange) {
                  child.props.onChange(e);
                }
                const targetValue = child.props.isMulti ? e.map(item => item.value) : e.value;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (child.props.changeAfterSearch) {
                  setChangeAfterSearch(true);
                }
              },
            })}
          </Tooltip>
        </React.Fragment>
      );
    }
    else if (child.type === P2Input) {
      return formHidden[child.props.name] !== true && (
        <React.Fragment key={index}>
          <Tooltip key={index} title={tooltipText} placement="bottom">
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
              value: searchData[child.props.name] || "",
              hidden: formHidden[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e) => {
                if (child.props.onChange) {
                  child.props.onChange(e);
                }
                const targetValue = e.target && e.target.value;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
              },
              onKeyDown: (e) => {
                if (child.props.onKeyDown) {
                  child.props.onKeyDown(e);
                }
                const targetValue = e.target && e.target.value;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (e.key === "Enter") {
                  setChangeAfterSearch(true);
                }
              },
            })}
          </Tooltip>
        </React.Fragment>
      );
    }
    else if (child.type === P2DatePicker || child.type === P2MonthPicker || child.type === P2TimePicker) {
      return formHidden[child.props.name] !== true && (
        <React.Fragment key={index}>
          <Tooltip key={index} title={tooltipText} placement="bottom">
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
              value: searchData[child.props.name] || "",
              hidden: formHidden[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e, formatString) => {
                if (child.props.onChange) {
                  child.props.onChange(e, formatString);
                }
                const targetValue = formatString;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (child.props.changeAfterSearch) {
                  setChangeAfterSearch(true);
                }
              }
            })}
          </Tooltip>
        </React.Fragment>
      );
    }
    else if (child.type === P2RangePicker) {
      return formHidden[child.props.name] !== true && (
        <React.Fragment key={index}>
          <Tooltip key={index} title={tooltipText} placement="bottom">
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
              value: searchData[child.props.name] || [null, null],
              hidden: formHidden[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e, formatStrings) => {
                if (child.props.onChange) {
                  child.props.onChange(e, formatStrings);
                }
                const targetValue = formatStrings;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (child.props.changeAfterSearch) {
                  setChangeAfterSearch(true);
                }
              }
            })}
          </Tooltip>
        </React.Fragment>
      );
    }
    else if (child.type === P2InputNumber) {
      return formHidden[child.props.name] !== true && (
        <React.Fragment key={index}>
          <Tooltip key={index} title={tooltipText} placement="bottom">
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
              value: searchData[child.props.name] || 0,
              hidden: formHidden[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (value) => {
                if (child.props.onChange) {
                  child.props.onChange(value);
                }
                const targetValue = value;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
              },
            })}
          </Tooltip>
        </React.Fragment>
      );
    }
    else if (child.type === P2Checkbox || child.type === P2Switch) {
      return formHidden[child.props.name] !== true && (
        <React.Fragment key={index}>
          <Tooltip key={index} title={tooltipText} placement="bottom">
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
              checked: searchData[child.props.name] || false,
              hidden: formHidden[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (checked) => {
                if (child.props.onChange) {
                  child.props.onChange(checked);
                }
                const targetValue = checked;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (child.props.changeAfterSearch) {
                  setChangeAfterSearch(true);
                }
              },
            })}
          </Tooltip>
        </React.Fragment>
      );
    }
    else if (child.type === P2RadioGroup) {
      return formHidden[child.props.name] !== true && (
        <React.Fragment key={index}>
          <Tooltip key={index} title={tooltipText} placement="bottom">
            {React.cloneElement(child, {
              className: `${child.props.className || ""} ${errorClass || ""}`.trim(),
              value: searchData[child.props.name] || "",
              hidden: formHidden[child.props.name] || false,
              disabled: formDisabled[child.props.name] || false,
              onChange: (e) => {
                if (child.props.onChange) {
                  child.props.onChange(e);
                }
                const targetValue = e.target && e.target.value;
                setSearchData((prev) => ({
                  ...prev,
                  [child.props.name]: targetValue,
                }));
                if (child.props.changeAfterSearch) {
                  setChangeAfterSearch(true);
                }
              },
            })}
          </Tooltip>
        </React.Fragment>
      );
    }
    else {
      return <React.Fragment key={index}>{child.props.children}</React.Fragment>;
    }
  }

  return (
    <div className={className}>
      {Children.map(props.children, (child, index) => {
        return recursiveRender(child, index);
      })}
    </div>
  );
}

P2SearchArea.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onSearch: PropTypes.func,
  ref: PropTypes.object,
};

export default forwardRef(P2SearchArea);
