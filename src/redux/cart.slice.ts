import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IProduct,
  IProductWithQuantity,
  IStripeCart,
} from "~/types/product.types";

const initialState: IStripeCart = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadExistingState: (state, action: PayloadAction<IStripeCart>) => {
      state = action.payload;
    },
    addToCart: (state, action: PayloadAction<IProductWithQuantity>) => {
      const itemExists = state.products.find(
        (item) => item.id === action.payload.id
      );
      if (itemExists) {
        itemExists.quantity++;
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }
    },
    adjustQuantity: (state, action: PayloadAction<IProductWithQuantity>) => {
      if (action.payload.quantity < 1) {
        removeFromCart(action.payload);
        return;
      }

      const itemExists = state.products.find(
        (item) => item.id === action.payload.id
      );
      if (itemExists) {
        itemExists.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<IProduct>) => {
      const index = state.products.findIndex(
        (item) => item.id === action.payload.id
      );
      state.products.splice(index, 1);
    },
  },
});

export const cartReducer = cartSlice.reducer;

export const { addToCart, removeFromCart, loadExistingState } =
  cartSlice.actions;
