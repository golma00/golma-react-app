import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
import { P2Select } from "components/index";

function P2SearchArea(props, ref) {
  const className = props.className || "border border-gray-200 rounded-md p-2 bg-gray-100 flex flex-row gap-5";

  const [searchData, setSearchData] = useState({});
  const [changeAfterSearch, setChangeAfterSearch] = useState(false);

  useImperativeHandle(ref, () => ({
    api: {
      get() {
        return searchData;
      },
      setValue(name, value) {
        setSearchData((prev) => ({
          ...prev,
          [name]: { ...prev[name], value: value },
        })); 
      },
      setValueByKey(name, key, value) {
        setSearchData((prev) => ({
          ...prev,
          [name]: { ...prev[name], [key]: value },
        }));
      }
    }
  }));

  useEffect(() => {
    let initData = {};
    if (props.children) {
      props.children.forEach((child) => {
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
              initData[child.props.name] = child.props.value || "";
              break;
            case "number":
              initData[child.props.name] = child.props.value || 0;
              break;
            case "checkbox":
              initData[child.props.name] = child.props.checked || false;
              break;
            case "radio":
              if (child.props.checked) {
                initData[child.props.name] = child.props.value || "";
              }
              break;
            default:
              break;
          }
        }
        else if (child.type === "textarea") {
          initData[child.props.name] = child.props.value || "";
        }
        else if (child.type === P2Select) {
          initData[child.props.name] = child.props.value || "";
        }
      });
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

  function renderChild(child, index) {
    if (child.type === "label") {
      return <label key={index}>{child.props.children}</label>;
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
        case "number":
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
                  if (child.props.changeaftersearch) {
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
                  if (child.props.changeaftersearch) {
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
    else if (child.type === "textarea") {
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
              if (child.props.changeaftersearch) {
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
              if (child.props.changeaftersearch) {
                setChangeAfterSearch(true);
              }
            },
          })}
        </React.Fragment>
      );
    }
  }

  return (
    <div className={className}>
      {props.children.map((child, index) => {
        return renderChild(child, index);
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
