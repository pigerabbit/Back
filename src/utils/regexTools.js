// 특수 문자 제거 함수
function regExp(str) {
  var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
  if (reg.test(str)) {
    return str.replace(reg, "");
  } else {
    
    return str;
  }
}

export { regExp }; 