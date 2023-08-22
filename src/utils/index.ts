export const convertCentValueToCurrency = (num: number) => {
  return convertDollarValueToCurrency(num / 100);
};

export const convertDollarValueToCurrency = (num: number) => {
  return num.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
};
