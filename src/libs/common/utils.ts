export function colorToHex(color: string) {
  var hexadecimal = parseInt(color).toString(16);
  return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}

export function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) {
    return '';
  }

  return phoneNumber
    .replace(/[^0-9]/g, '')
    .replace(/(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, '$1-$2-$3');
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
