const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 0,
});

export function toIDR(
  v: number,
  symbol = true,
  negativeFormat: "minus" | "parentheses" = "minus",
) {
  if (isNaN(v)) return v?.toString();

  const absValue = Math.abs(v);
  const stringArr = absValue.toString().split(".");
  const integerPart = +stringArr[0];
  const fractionalPart = stringArr[1];

  let formattedValue = symbol
    ? stringArr.length > 1
      ? currencyFormatter.format(absValue)
      : `Rp${numberFormatter.format(integerPart)}`
    : fractionalPart
      ? `${numberFormatter.format(integerPart)},${fractionalPart}`
      : numberFormatter.format(absValue);

  if (v < 0) {
    formattedValue =
      negativeFormat === "parentheses"
        ? `(${formattedValue})`
        : `- ${formattedValue}`;
  }

  return formattedValue;
}

export const formatIDR = (
  numStr: string,
  prefix = "Rp",
  negativeFormat: "minus" | "parentheses" = "minus",
) => {
  if (numStr === "") return "";
  const num = Number(numStr);
  if (isNaN(num)) return numStr;

  let formattedValue = `${prefix}${numberFormatter.format(Math.abs(num))}`;

  if (num < 0) {
    formattedValue =
      negativeFormat === "parentheses"
        ? `(${formattedValue})`
        : `- ${formattedValue}`;
  }

  return formattedValue;
};
