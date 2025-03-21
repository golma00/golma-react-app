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

/**
 * 문자열 바이트 길이 반환
 * @param {string} str 
 * @returns {number}
 */
export function getByteLength(str) {
  if (isEmpty(str)) {
    return 0;
  }

  let size = 0;

  for (let i = 0; i < str.length; i++ ) {
    size += charByteSize(str.charAt(i));
  }
  return size;
}
function charByteSize(char) {
  if (isEmpty(char)) {
    return 0;
  }

  let charCode = char.charCodeAt( 0 );

  if (charCode <= 0x00007F) {
    return 1;
  } 
  else if (charCode <= 0x0007FF) {
    return 2;
  }
  else if( charCode <= 0x00FFFF) {
    return 3;
  }
  else {
    return 4;
  }
}

/**
 * 값을 문자열로 변환
 * @param {*} value 
 * @returns {string}
 */
export function toString(value) {
  if (isEmpty(value)) {
    return "";
  }
  else if (isString(value)) {
    return value;
  }
  return value.toString();  
}
