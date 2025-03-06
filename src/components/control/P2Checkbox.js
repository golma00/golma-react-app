import React, { useState, useEffect } from "react";
import { Checkbox, Switch } from "antd";
import PropTypes from "prop-types";
export function P2Checkbox(props) {
  const [value, setValue] = useState(props.value || false);

  useEffect(() => {
    setValue(props.value || false);
  }, [props.value]);

  const onChange = (e) => {
    setValue(e.target.checked);

    if (props.onChange) {
      props.onChange(e.target.checked);
    }
  }

  return (
    <Checkbox {...props} checked={value} onChange={onChange} />
  );
}
P2Checkbox.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2Switch(props) {
  const [value, setValue] = useState(props.value || false);

  useEffect(() => {
    setValue(props.value || false);
  }, [props.value]);

  const onChange = (checked) => {
    setValue(checked);
    if (props.onChange) {
      props.onChange(checked);
    }
  }

  return (
    <Switch {...props} checked={value} onChange={onChange} />
  );
}
P2Switch.propTypes = {
  changeAfterSearch: PropTypes.bool,
};
