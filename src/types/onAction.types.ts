export type TOnAction<T> = (args: T) => void;

type OnActionArgs<T, U> = {
  type: T;
  data: U;
};

export type IOnActionProductCreationArgs =
  | OnActionArgs<ProductCreationActionType.TITLE_UPDATE, string>
  | OnActionArgs<ProductCreationActionType.PRICE_UPDATE, number>;

export enum ProductCreationActionType {
  INFO = "info",
  TITLE_UPDATE = "title/update",
  PRICE_UPDATE = "price/update",
}
