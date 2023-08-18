import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, IProductWithQuantity, ICart } from "~/types/product.types";

const initialState: ICart = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadExistingState: (state, action: PayloadAction<ICart>) => {
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
        removeFromCart(action.payload.id);
        return;
      }

      const itemExists = state.products.find(
        (item) => item.id === action.payload.id
      );
      if (itemExists) {
        itemExists.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = state.products.findIndex(
        (item) => item.id === action.payload
      );
      state.products.splice(index, 1);
    },
  },
});

export const cartReducer = cartSlice.reducer;

export const { addToCart, adjustQuantity, removeFromCart, loadExistingState } =
  cartSlice.actions;
