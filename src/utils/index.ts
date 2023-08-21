export const convertNumberToCurrency = (num: number) => {
  return num.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
};
