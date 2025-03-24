import React, { useState, useEffect } from "react";
import { Checkbox, Switch } from "antd";
import PropTypes from "prop-types";
export function P2Checkbox(props) {
  const [value, setValue] = useState(props.value || false);
  const [trueValue, setTrueValue] = useState(props.trueValue || true);
  const [falseValue, setFalseValue] = useState(props.falseValue || false);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setTrueValue(props.trueValue || true);
  }, [props.trueValue]);

  useEffect(() => {
    setFalseValue(props.falseValue || false);
  }, [props.falseValue]);

  const onChange = (e) => {
    setValue(e.target.checked ? trueValue : falseValue);

    if (props.onChange) {
      props.onChange(e.target.checked ? trueValue : falseValue);
    }
  }

  return (
    <Checkbox {...props} checked={value === trueValue} onChange={onChange} className={`text-sm w-full self-center ${props.className||''}`}/>
  );
}
P2Checkbox.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2Switch(props) {
  const [value, setValue] = useState(props.value || false);
  const [trueValue, setTrueValue] = useState(props.trueValue || true);
  const [falseValue, setFalseValue] = useState(props.falseValue || false);


  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setTrueValue(props.trueValue || true);
  }, [props.trueValue]);

  useEffect(() => {
    setFalseValue(props.falseValue || false);
  }, [props.falseValue]);

  const onChange = (checked) => {
    setValue(checked ? trueValue : falseValue);
    if (props.onChange) {
      props.onChange(checked ? trueValue : falseValue);
    }
  }

  return (
    <Switch {...props} checked={value === trueValue} onChange={onChange} className={`text-sm w-full self-center ${props.className||''}`}/>
  );
}
P2Switch.propTypes = {
  changeAfterSearch: PropTypes.bool,
};
