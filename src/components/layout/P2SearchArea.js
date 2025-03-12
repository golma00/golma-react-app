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
  P2RadioGroup 
} from "components/control/index";

function P2SearchArea(props, ref) {
  const className = props.className || "p2-search-area";

  const [searchData, setSearchData] = useState({});
  const [changeAfterSearch, setChangeAfterSearch] = useState(false);

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
      clear() {
        Object.keys(searchData).forEach((key) => {
          setSearchData((prev) => ({
            ...prev,
            [key]: undefined,
          }));
        });
      }
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
                }
                break;
              case "number":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || 0;
                }
                break;
              case "checkbox":
                if (child.props.name) {
                  initData[child.props.name] = child.props.checked || false;
                }
                break;
              case "radio":
                if (child.props.name) {
                  initData[child.props.name] = child.props.value || "";
                }
                break;
              default:
                break;
            }
          }
          else if (child.type === "textarea" || child.type === P2InputTextArea) {
            if (child.props.name) {
              initData[child.props.name] = child.props.value || "";
            }
          }
          else if (child.type === P2Select) {
            if (child.props.name) {
              initData[child.props.name] = child.props.value || "";
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
          }
          else if (child.type === P2InputNumber) {
            initData[child.props.name] = child.props.value || 0;
          }
          else if (child.type === P2Checkbox || child.type === P2Switch) {
            initData[child.props.name] = child.props.checked || false;
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
            <React.Fragment key={index}>
              {React.cloneElement(child, {
                value: searchData[child.props.name] || "",
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
            </React.Fragment>
          );
        case "number":
          return (
            <React.Fragment key={index}>
              {React.cloneElement(child, {
                value: searchData[child.props.name] || 0,
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
            </React.Fragment>
          );
        case "checkbox":
          return (
            <React.Fragment key={index}>
              {React.cloneElement(child, {
                checked: searchData[child.props.name] || false,
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
            </React.Fragment>
          );
        case "radio":
          return (
            <React.Fragment key={index}>
              {React.cloneElement(child, {
                value: searchData[child.props.name] || "",
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
            value: searchData[child.props.name] || "",
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
        </React.Fragment>
      );
    }
    else if (child.type === P2Select) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            optionValue: searchData[child.props.name] || "",
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
        </React.Fragment>
      );
    }
    else if (child.type === P2Input) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: searchData[child.props.name] || "",
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
        </React.Fragment>
      );
    }
    else if (child.type === P2DatePicker || child.type === P2MonthPicker || child.type === P2TimePicker) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: searchData[child.props.name] || "",
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
        </React.Fragment>
      );
    }
    else if (child.type === P2RangePicker) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: searchData[child.props.name] || [null, null],
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
        </React.Fragment>
      );
    }
    else if (child.type === P2InputNumber) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: searchData[child.props.name] || 0,
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
        </React.Fragment>
      );
    }
    else if (child.type === P2Checkbox || child.type === P2Switch) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            checked: searchData[child.props.name] || false,
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
        </React.Fragment>
      );
    }
    else if (child.type === P2RadioGroup) {
      return (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            value: searchData[child.props.name] || "",
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
