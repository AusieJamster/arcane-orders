import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICart, TProduct } from "@src/types/product.types";

const initialState: ICart = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<TProduct>) => {
      const existingProduct = state.products.find(
        (item) =>
          item.product.productIdentifier === action.payload.productIdentifier
      );
      if (existingProduct) existingProduct.quantity++;
      else state.products.push({ product: action.payload, quantity: 1 });
    },
    adjustQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const index = state.products.findIndex(
        (item) => item.product.productIdentifier === action.payload.id
      );
      if (action.payload.quantity < 1) {
        removeFromCart(state.products[index].product.productIdentifier);
      } else if (index >= 0) {
        state.products[index].quantity = action.payload.quantity;
      } else {
        console.error("Product you wish to adjust wasn't found in the cart");
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = state.products.findIndex(
        (item) => item.product.productIdentifier === action.payload
      );
      if (index >= 0) {
        state.products.splice(index, 1);
      } else {
        console.error("Product you wish to remove wasn't found in the cart");
      }
    },
  },
});

export const cartReducer = cartSlice.reducer;

export const { addToCart, adjustQuantity, removeFromCart } = cartSlice.actions;
