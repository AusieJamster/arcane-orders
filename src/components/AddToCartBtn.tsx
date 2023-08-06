import { Button, ButtonTypeMap } from "@mui/material";
import { addToCart } from "src/redux/cart.slice";
import { useDispatch } from "react-redux";
import { IProduct } from "~/types/product.types";

interface IAddToCartBtn extends Partial<Pick<ButtonTypeMap, "props">> {
  product: IProduct;
  quantity?: number;
  [key: string]: unknown;
}

export const AddToCartBtn: React.FC<IAddToCartBtn> = ({
  product,
  quantity = 1,
  ...rest
}) => {
  const dispatch = useDispatch();
  return (
    <Button
      onClick={() => dispatch(addToCart({ ...product, quantity }))}
      variant="contained"
      {...rest}
    >
      Add to Cart
    </Button>
  );
};
