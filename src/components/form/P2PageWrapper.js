import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function P2PageWrapper(props) {
  const location = useLocation();
  const [success, setSuccess] = useState(false);
  const [menuProps, setMenuProps] = useState({});

  useEffect(() => {
    setMenuProps({
      menuNm: "테스트",
      auth: {
        saveUseYn: "Y",
        extUseYn1: "Y",
        extBtnNm1: "기타1",
        extUseYn2: "Y",
        extBtnNm2: "기타2",
      }
    });
    setSuccess(true);
  }, []);

  function loadMenu() {
    return React.cloneElement(props.children, {
      menuProps,
    });
  }

  return (
    <>
      { success && loadMenu() }
    </>
  )
}

export default P2PageWrapper;
