import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const useCommonCode = () => { // useCodeData
  /**
   * 공통코드 데이터 조회
   * @param {Object} params 
   * @returns {} 공통코드 데이터 배열
   */
  async function getCodeDatas(params) { // getCommonCodeDatas
    const res = await axios.post("/api/v1/code/getCodeDatas", {
      commonCodeParams: params,
    });
    return res.data.data.result;
  }
  return {getCodeDatas}
};