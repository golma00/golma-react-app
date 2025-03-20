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
    setValue(formatString?.replace(/-/g, ""));
    if (props.onChange) {
      props.onChange(e, formatString?.replace(/-/g, ""));
    }
  }

  return (
    <DatePicker {...props} value={value === "" ? null : moment(value, "YYYYMMDD")} onChange={onChange} locale={locale} />
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
    setValue(formatString?.replace(/-/g, ""));
    if (props.onChange) {
      props.onChange(e, formatString?.replace(/-/g, ""));
    }
  }
  return (
    <DatePicker.MonthPicker {...props} value={value === "" ? null : moment(value, "YYYYMM")} onChange={onChange} locale={locale} />
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
    setValue(formatString?.map(item => item.replace(/-/g, "")));
    if (props.onChange) {
      props.onChange(e, formatString?.map(item => item.replace(/-/g, "")));
    }
  }
  return (
    <DatePicker.RangePicker {...props} value={value.length === 0 ? [null, null] : [moment(value[0], "YYYYMMDD"), moment(value[1], "YYYYMMDD")]} onChange={onChange} locale={locale} />
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
    setValue(formatString?.replace(/:/g, ""));
    if (props.onChange) {
      props.onChange(e, formatString?.replace(/:/g, ""));
    }
  }
  return (
    <TimePicker {...props} value={value === "" ? null : moment(value, "HHmmss")} onChange={onChange} locale={locale} />
  );
}
P2TimePicker.propTypes = {
  changeAfterSearch: PropTypes.bool,
};
