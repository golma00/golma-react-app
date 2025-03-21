import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCommonCode = () => {
  async function getCodeDatas(params) {
    const res = await axios.post("/api/v1/code/getCodeDatas", {
      commonCodeParams: params,
    });
    return res.data.data.result;
  }
  return {getCodeDatas}
};