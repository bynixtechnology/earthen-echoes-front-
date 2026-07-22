import {
  configureStore,
} from "@reduxjs/toolkit";

import adminAuthReducer
  from "./slices/adminAuthSlice";

import userAuthReducer
  from "./slices/userAuthSlice";

import productReducer
  from "./slices/productSlice";

import categoryReducer
  from "./slices/categorySlice";


export const store =
  configureStore({

    reducer: {

      /*
      | Admin
      */

      adminAuth:
        adminAuthReducer,


      /*
      | Customer / User
      */

      userAuth:
        userAuthReducer,


      /*
      | Products
      */

      products:
        productReducer,


      /*
      | Categories
      */

      categories:
        categoryReducer,

    },

  });