export function CurrencyFormatter(value, currency = "HUF") {
  if (!value && value !== 0) return null;
  let formatCode = "hu-HU";
  let fractionDigits = 0;
  switch (currency) {
    case "HUF": {
      formatCode = "hu-HU";
      fractionDigits = 0;
      break;
    }
  }
  return Intl.NumberFormat(formatCode, {
    style: "currency",
    currency: currency,
    useGrouping: true,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
