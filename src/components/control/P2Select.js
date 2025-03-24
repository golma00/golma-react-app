import React, { useState, useRef, useEffect, useImperativeHandle, useCallback, forwardRef } from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import * as Utils from 'utils/Utils';
function P2Select(props, ref) {
  const {valueField, labelField, datas, defaultOption, changeAfterSearch, ...rest} = props;
  const [value, setValue] = useState(props.value);
  const [options, setOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();
  const [customClassName, setCustomClassName] = useState("");

  useEffect(() => {
    setCustomClassName(`${props.className||''} ${Utils.isNotEmpty(props.menuWidth) ? "menu-width-auth" : ""}`);
  }, [props.className, props.menuWidth]);

  const checkboxOption = (props) => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    );
  };

  const valueContainer = ({ children, getValue, ...props }) => {
    var length = getValue().length;
    return (
      <components.ValueContainer {...props}>
          {!props.selectProps.inputValue && length === 1 && `${getValue()[0]["label"]}`}
          {!props.selectProps.inputValue && length > 1 && `${getValue()[0]["label"]} 외 ${length - 1}건`}
              
          {React.Children.map(children, child => {
            try {
              if (child.key === null || child.key === "placeholder") {
                return child;
              }
            } catch (error) {
            }
          })}
      </components.ValueContainer>
    );
  };

  const menuList = (props) => {
    const onAllChecked = () => {
      const values = datas.map((item) => item[valueField || "cd"]);
      setValue(values);
    }
    const onAllUnchecked = () => {
      setValue([]);
    }
    return (
      <components.MenuList {...props}>
        <div className="flex flex-row gap-3 justify-center items-center border-b border-gray-200 p-1">
          <div className="flex flex-row gap-1 items-center">
            <Icon type="check" className="cursor-pointer" onClick={onAllChecked} />
            <button className="text-sm hover:text-primary-600" onClick={onAllChecked}>전체 선택</button>
          </div>
          <div className="w-[1px] h-[12px] bg-gray-200"></div>
          <div className="flex flex-row gap-1 items-center">
            <Icon type="close" className="cursor-pointer" onClick={onAllUnchecked} />
            <button className="text-sm hover:text-primary-600" onClick={onAllUnchecked}>전체 해제</button>
          </div>
        </div>
        {props.children}
      </components.MenuList>
    );
  };

  const menu = (props) => {
    const menuWidth = props.selectProps.menuWidth;
    const menuHeight = props.selectProps.menuHeight;

    return (
      <components.Menu {...props}>
        {(menuWidth || menuHeight) && (
          <div style={{width: menuWidth, height: menuHeight}}>
            {props.children}
          </div>
        )}
        {(menuWidth === undefined && menuHeight === undefined) && (
          <div>
            {props.children}
          </div>
        )}
      </components.Menu>
    );
  };

  useImperativeHandle(ref, () => ({
    api: {
      getSelectedData: () => {
        if (datas.length > 0) {
          if (defaultOption) {
            switch (defaultOption.toUpperCase()) {
              case "ALL":
              case "BLANK":
                return selectedIndex - 1 >= 0 ? datas[selectedIndex - 1] : {};
              default:
                return datas[selectedIndex];
            }
          }
          else {
            return datas[selectedIndex];
          }
        }
        return {};
      },
      getSelectedIndex: () => {
        return selectedIndex;
      },
      setSelectedIndex: (index) => {
        setSelectedIndex(index);

        if (options.length - 1 >= index) {
          setValue(options[index].value);
        }
        else {
          setValue(undefined);
        }
      }
    }
  }));

  const datasToOptions = useCallback(() => {
    let optionArray = [];
    if (defaultOption) {
      switch (defaultOption.toUpperCase()) {
        case "ALL":
          optionArray.push({
            value: "",
            label: "전체",
          });
          break;
        case "BLANK":
          optionArray.push({
            value: "",
            label: "\u00A0",
          });
          break;
        default:
          break;
      }
    }
    if (datas && datas.length > 0) {
      optionArray.push(...datas.map((item) => ({
        value: item[valueField || "cd"],
        label: item[labelField || "cdNm"],
        isSelected: item.isSelected,
      })));
      setOptions(optionArray);
    }
    else {
      setOptions([]);
    }
  }, [datas, defaultOption, valueField, labelField]);

  const optionFindValue = (value) => {
    if (value === undefined || value === null) {
      if (selectedIndex !== -1) {
        setSelectedIndex(-1);
      }
      return undefined;
    }

    let values = [];
    if (value instanceof Array) {
      values = value;
    }
    else if (value instanceof String && value.includes(",")) {
      values = value.split(",");
    }
    else {
      values.push(value);
    }

    let result = [];
    options.forEach((item, index) => {
      if (values.includes(item.value)) {
        result.push(item);
      }
    });
    
    return result;
  }

  useEffect(() => {
    datasToOptions();
  }, [props.datas]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    if (props.optionValue !== undefined) {
      setValue(props.optionValue);
    }
  }, [props.optionValue]);

  return (
    <Select {...rest} 
      options={options}
      classNamePrefix="P2Select" 
      className={`text-sm bg-white rounded-md self-center w-full ${customClassName}`}
      value={optionFindValue(value)}
      onChange={(e) => {
        if (props.onChange) {
          props.onChange(e);
        }
        setValue(e.value);
      }}
      closeMenuOnSelect={props.isMulti ? props.closeMenuOnSelect || false : props.closeMenuOnSelect || true}
      hideSelectedOptions={false}
      {
        ...(props.isMulti && {
          components: {
            Option: checkboxOption,
            ValueContainer: valueContainer,
            MenuList: menuList,
            Menu: menu,
          }
        })
      }
    />
  )
}

P2Select.propTypes = {
  defaultOption: PropTypes.string,
  optionValue: PropTypes.string,
  valueField: PropTypes.string,
  labelField: PropTypes.string,
  datas: PropTypes.array,
  value: PropTypes.string,
  changeAfterSearch: PropTypes.bool,
  dropdownWidth: PropTypes.number,
  dropdownHeight: PropTypes.number,
  onChange: PropTypes.func,
};

export default forwardRef(P2Select);
