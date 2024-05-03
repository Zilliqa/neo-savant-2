export const smartTruncate = (
  string: string,
  length: number,
  {
    mark = '\u2026', // ellipsis = …
    position = length - 1,
  } = {}
) => {
  if (typeof mark !== 'string') return string;

  const markOffset = mark.length;
  const minLength = 4;

  let str = string;

  if (typeof str === 'string') {
    str = str.trim();
  }

  const invalid =
    typeof str !== 'string' ||
    str.length < minLength ||
    typeof length !== 'number' ||
    length <= minLength ||
    length >= str.length - markOffset;

  if (invalid) return string;

  if (position >= length - markOffset) {
    const start = str.substring(0, length - markOffset);
    return `${start}${mark}`;
  }

  const start = str.substring(0, position);
  const end = str.slice(position + markOffset - length);

  return `${start}${mark}${end}`;
};
