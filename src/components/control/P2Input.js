import React, { useState, useEffect } from "react";
import { Input, InputNumber } from "antd";
import PropTypes from "prop-types";
export function P2Input(props) {
  const [value, setValue] = useState(props.value || "");

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
    <Input {...props} value={value} onChange={onChange} />
  );
}
P2Input.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2InputNumber(props) {
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (value) => {
    setValue(value);
    if (props.onChange) {
      props.onChange(value);
    }
  }

  return (
    <InputNumber {...props} value={value} onChange={onChange}/>
  );
}
P2InputNumber.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2InputPassword(props) {
  const [value, setValue] = useState(props.value || "");

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
    <Input.Password {...props} value={value} onChange={onChange} />
  );
} 
P2InputPassword.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2InputTextArea(props) {
  const [value, setValue] = useState(props.value || "");

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
    <Input.TextArea {...props} value={value} onChange={onChange} />
  );
}
P2InputTextArea.propTypes = {
  changeAfterSearch: PropTypes.bool,
};
