import React, { useState, useEffect, useImperativeHandle, useCallback, forwardRef } from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

function P2Select(props, ref) {
  const { valueField, labelField, datas, defaultOption } = props;
  const [value, setValue] = useState(props.value);
  const [options, setOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();

  const groupOption = (props) => {
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

  const valueContainer = ({ children, getValue, ...props }) => {
    var length = getValue().length;
    return (
      <components.ValueContainer {...props}>
          {!props.selectProps.inputValue && length === 1 && `${getValue()[0]["label"]}`}
          {!props.selectProps.inputValue && length > 1 && `${getValue()[0]["label"]} 외 ${length - 1}건`}
              
          {React.Children.map(children, child => {
            if (child.key === null || child.key === "placeholder") {
              return child;
            }
          })}
      </components.ValueContainer>
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
            value: " ",
            label: "\u00A0",
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
    <Select {...props} classNamePrefix="P2Select" options={options} 
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
  changeAfterSearch: PropTypes.bool,
};

export default forwardRef(P2Select);
