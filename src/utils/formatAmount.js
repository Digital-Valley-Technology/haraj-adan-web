export const formatAmount = (amount, options = {}) => {
  const {
    currencySymbol = "$",
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const num = Number(amount);

  if (isNaN(num)) {
    return "__";
  }

  return `${currencySymbol}${num.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  })}`;
};
