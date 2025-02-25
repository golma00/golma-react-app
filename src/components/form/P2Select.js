import React, { useState, useEffect, useImperativeHandle, useCallback, forwardRef } from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

function P2Select(props, ref) {
  const { valueField, labelField, datas, defaultOption, isMulti } = props;
  const [value, setValue] = useState(props.value);
  const [selectedIndex, setSelectedIndex] = useState();
  const [options, setOptions] = useState([]);

  const checkboxOption = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
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
            value: "ALL",
            label: "전체",
          });
          break;
        case "BLANK":
          optionArray.push({
            value: " ",
            label: " ",
          });
          break;
        default:
          break;
      }
    }
    if (datas.length > 0) {
      optionArray.push(...datas.map((item) => ({
        value: item[valueField || "cd"],
        label: item[labelField || "cdNm"],
      })));
      setOptions(optionArray);
    }
  }, [datas, defaultOption, valueField, labelField]);

  const optionFindValue = (value) => {
    if (value === undefined) {
      if (selectedIndex !== -1) {
        setSelectedIndex(-1);
      }
      return undefined;
    }
    return options.find((item, index) => {
      if (item.value === value) {
        if (selectedIndex !== index) {
          setSelectedIndex(index);
        }
      }
      return item.value === value;
    });
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
    <Select {...props} classNamePrefix="P2Select" options={options} 
      value={optionFindValue(value)}
      onChange={(e) => {
        if (props.onChange) {
          props.onChange(e);
        }
        setValue(e.value);
      }}
      closeMenuOnSelect={props.isMulti ? props.closeMenuOnSelect || false : props.closeMenuOnSelect || true}
      hideSelectedOptions={props.isMulti ? props.hideSelectedOptions || false : props.hideSelectedOptions || true}
      {
        ...(props.isMulti && {
          components: {
            Option: checkboxOption,
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
  onChange: PropTypes.func,
};

export default forwardRef(P2Select);
