const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});
const numberFormatter = Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 0,
});

export function toIDR(v: number, symbol = true) {
  if (isNaN(v)) return v.toString();

  const stringArr = v.toString().split(".");
  const integerPart = +stringArr[0];
  const fractionalPart = stringArr[1];

  if (symbol) {
    return stringArr.length > 1
      ? currencyFormatter.format(v)
      : `Rp${numberFormatter.format(integerPart)}`;
  }

  return fractionalPart
    ? `${numberFormatter.format(integerPart)},${fractionalPart}`
    : numberFormatter.format(v);
}

export const formatIDR = (numStr: string, prefix = "Rp") => {
  if (numStr === "") return "";
  if (prefix) return `${prefix}${numberFormatter.format(Number(numStr))}`;
  return numberFormatter.format(Number(numStr));
};
