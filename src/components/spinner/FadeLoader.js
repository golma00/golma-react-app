import { useState, CSSProperties } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import "../../css/spinner.css";

const override = {
  display: "flex",
  margin: "0 auto",
  borderColor: "black"
};

const ProgressBar = ({loading}) => {
  return (
    <div className="spinnerContainer" hidden={!loading}>
      <FadeLoader className="spinner"
        loading={loading}
        cssOverride={override}
      />
    </div>
  );
};

export default ProgressBar;