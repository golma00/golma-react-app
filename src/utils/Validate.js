
import * as Utils from 'utils/Utils';

export function validateRequired(value) {
  return Utils.isEmpty(value) ? "필수 입력 항목입니다." : "";
}

export function validateMaxByte(value, max) {
  return Utils.getByteLength(value) <= max ? "최대 " + max + "자까지 입력 가능합니다." : "";
}

export function validateMinByte(value, min) {
  return Utils.getByteLength(value) >= min ? "최소 " + min + "자 이상 입력 필요합니다." : "";
}

export function validateMaxLength(value, max) {
  return value.length <= max ? "최대 " + max + "자까지 입력 가능합니다." : "";
}

export function validateMinLength(value, min) {
  return value.length >= min ? "최소 " + min + "자 이상 입력 필요합니다." : "";
}

export function validateEmail(value) {
  return value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? "이메일 형식으로 입력 해주세요." : "";
}

export function validatePhone(value) {
  return value.match(/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/) ? "전화번호 형식으로 입력 해주세요." : "";
}

export function validateNumber(value) {
  return value.match(/^[-]?[0-9]+$/) ? "숫자만 입력해주세요." : "";
}

export function validateDecimal(value) {
  return value.match(/^[-]?[0-9]+(\.[0-9]+)?$/) ? "숫자만 입력해주세요." : "";
}

export function validateDate(value) {
  return value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) ? "날짜 형식으로 입력해주세요." : "";
}

export function validateTime(value) {
  return value.match(/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/) ? "시간 형식으로 입력해주세요." : "";
}

export function validateUrl(value) {
  return value.match(/^(http|https):\/\/[^\s]+$/) ? "URL 형식으로 입력해주세요." : "";
}
