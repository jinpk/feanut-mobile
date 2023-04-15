export function colorToHex(color: string) {
  var hexadecimal = parseInt(color).toString(16);
  return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}

const pattern = /([^가-힣a-z\x20])/i;

export function isValidKoreanName(str: string): boolean {
  if (pattern.test(str)) {
    return false;
  }
  return true;
}

export function convertRGBtoHex(rgb: string) {
  const [red, green, blue] = rgb.split(',');

  return (
    '#' +
    colorToHex(red.replace(/[^0-9]/g, '')) +
    colorToHex(green.replace(/[^0-9]/g, '')) +
    colorToHex(blue.replace(/[^0-9]/g, ''))
  );
}
