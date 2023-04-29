export function objectToArrWithSorting(
  object: any,
): {key: string; value: any}[] {
  return Object.keys(object)
    .map(key => {
      return {
        key,
        value: object[key],
      };
    })
    .sort((a, b) => b.value - a.value);
}

export function colorToHex(color: string) {
  var hexadecimal = parseInt(color).toString(16);
  return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal;
}

export function formatLengthLabel(length: string | number) {
  if (!length) {
    return '0';
  }

  if (typeof length === 'string') {
    length = parseInt(length);
  }

  if (length >= 10000) {
    return `${(Math.floor(length / 1000) + (length % 1000) / 1000).toPrecision(
      3,
    )}k`;
  }
  if (length >= 1000) {
    return `${(Math.floor(length / 1000) + (length % 1000) / 1000).toPrecision(
      2,
    )}k`;
  } else {
    return length;
  }
}

export function formatPhoneNumber(phoneNumber: string, divider?: string) {
  if (!phoneNumber) {
    return '';
  }

  return phoneNumber
    .replace(/[^0-9]/g, '')
    .replace(
      /(^02.{0}|^01.{1}|[0-9]{3})([0-9]{3,4})([0-9]{4})/g,
      `$1${divider || '-'}$2${divider || '-'}$3`,
    );
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
