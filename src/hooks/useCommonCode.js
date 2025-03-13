import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCommonCode = () => {
  const [code, setCode] = useState({});
  
  async function getCodeDatas(params) {
    const res = await axios.post("/api/v1/code/getCodeDatas", {
      commonCodeParams: params,
    });
    setCode(res.data.data.result);
  }
  return {
    code,
    getCodeDatas
  }
};