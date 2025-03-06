import React, { useState, useEffect } from "react";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";
import locale from "antd/es/date-picker/locale/ko_KR";
import PropTypes from "prop-types";

export function P2DatePicker(props) {
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (e, formatString) => {
    setValue(formatString);
    if (props.onChange) {
      props.onChange(e, formatString);
    }
  }

  return (
    <DatePicker {...props} value={value === "" ? null : moment(value, "YYYY-MM-DD")} onChange={onChange} locale={locale} />
  );
}
P2DatePicker.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2MonthPicker(props) {
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (e, formatString) => {
    setValue(formatString);
    if (props.onChange) {
      props.onChange(e, formatString);
    }
  }
  return (
    <DatePicker.MonthPicker {...props} value={value === "" ? null : moment(value, "YYYY-MM")} onChange={onChange} locale={locale} />
  );
}
P2MonthPicker.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2RangePicker(props) {
  const [value, setValue] = useState(props.value || []);

  useEffect(() => {
    setValue(props.value || []);
  }, [props.value]);

  const onChange = (e, formatString) => {
    setValue(formatString);
    if (props.onChange) {
      props.onChange(e, formatString);
    }
  }
  return (
    <DatePicker.RangePicker {...props} value={value.length === 0 ? [null, null] : [moment(value[0], "YYYY-MM-DD"), moment(value[1], "YYYY-MM-DD")]} onChange={onChange} locale={locale} />
  );
}
P2RangePicker.propTypes = {
  changeAfterSearch: PropTypes.bool,
};

export function P2TimePicker(props) {
  const [value, setValue] = useState(props.value || "");

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  const onChange = (e, formatString) => {
    setValue(formatString);
    if (props.onChange) {
      props.onChange(e, formatString);
    }
  }
  return (
    <TimePicker {...props} value={value === "" ? null : moment(value, "HH:mm:ss")} onChange={onChange} locale={locale} />
  );
}
P2TimePicker.propTypes = {
  changeAfterSearch: PropTypes.bool,
};
