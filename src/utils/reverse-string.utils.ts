const reverseString = (inputStr: string) => {
  var stringArr = inputStr.split(" ");
  var reversedStr = "";

  var len = stringArr.length  -1;
  while(len >= 0) {
    reversedStr = reversedStr + " " + stringArr[len];
    len--;
  }
  return reversedStr;
}

export default reverseString;