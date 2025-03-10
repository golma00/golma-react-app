/**
 * 값이 비어있는지 확인
 * @param {*} value 
 * @returns 
 */
export function isEmpty(value) {
  return value === "" || value === null || value === undefined;
}

/**
 * 값이 비어있지 않은지 확인
 * @param {*} value 
 * @returns 
 */
export function isNotEmpty(value) {
  return !isEmpty(value);
}

/**
 * 숫자 값인지 확인
 * @param {*} value 
 * @returns 
 */
export function isNumber(value) {
  return !isNaN(value);
}

/**
 * 문자열 값인지 확인
 * @param {*} value 
 * @returns 
 */
export function isString(value) {
  return typeof value === "string";
}

/**
 * 불리언 값인지 확인
 * @param {*} value 
 * @returns 
 */
export function isBoolean(value) {
  return typeof value === "boolean";
}

/**
 * 배열 값인지 확인
 * @param {*} value 
 * @returns 
 */
export function isArray(value) {
  return Array.isArray(value);
}




