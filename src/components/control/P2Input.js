import React, { useState, useEffect, useCallback } from "react";
import { Input, InputNumber } from "antd";
import PropTypes from "prop-types";
export function P2Input(props) {
  const [value, setValue] = useState(props.value || "");
  const {changeAfterSearch, ...rest} = props;

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (e) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  }

  return (
    <Input {...rest} value={value} onChange={onChange} className={`text-sm bg-white border border-gray-200 rounded-md ${props.className||''}`}/>
  );
}
P2Input.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2InputNumber(props) {
  const [value, setValue] = useState(props.value || "");
  const {changeAfterSearch, ...rest} = props;

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (value) => {
    setValue(value);
    if (props.onChange) {
      props.onChange(value);
    }
  }

  const formatter = useCallback((value) => {
    return (value === undefined || value === null || value === "") ? "" : parseFloat(value).toLocaleString();
  }, []);

  return (
    <InputNumber formatter={formatter} {...rest} value={value} onChange={onChange} className={`text-sm bg-white border border-gray-200 rounded-md ${props.className||''}`}/>
  );
}
P2InputNumber.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2InputPassword(props) {
  const [value, setValue] = useState(props.value || "");
  const {changeAfterSearch, ...rest} = props;

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (e) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  } 

  return (
    <Input.Password {...rest} value={value} onChange={onChange} className={`text-sm bg-white border border-gray-200 rounded-md ${props.className||''}`}/>
  );
} 
P2InputPassword.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2InputTextArea(props) {
  const [value, setValue] = useState(props.value || "");
  const {changeAfterSearch, ...rest} = props;

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (e) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  }

  return (
    <Input.TextArea {...rest} value={value} onChange={onChange} className={`text-sm bg-white border border-gray-200 rounded-md ${props.className||''}`}/>
  );
}
P2InputTextArea.propTypes = {
  changeAfterSearch: PropTypes.bool,
};
