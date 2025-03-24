import React, { useState, useEffect } from "react"; 
import { Radio } from "antd";
import PropTypes from "prop-types";

export function P2RadioGroup(props) {
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (e) => {
    setValue(e.target.value);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <Radio.Group {...props} value={value} onChange={onChange} className={`text-sm ${props.className||''}`}/>
  );
}

P2RadioGroup.propTypes = {
  changeAfterSearch: PropTypes.bool,
};
