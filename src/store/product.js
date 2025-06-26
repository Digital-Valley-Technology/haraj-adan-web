import { defineStore } from "pinia";
import {
  allProducts,
  bestSellingProducts,
  homePageProducts,
  productsByCategory,
  specialOffers,
} from "../data";

export const useProductsStore = defineStore("products", {
  state: () => ({
    productsByCategory: productsByCategory,
    bestSellingProducts: bestSellingProducts,
    specialOffers: specialOffers,
    homePageProducts: homePageProducts,
    allProducts: allProducts,
    favouredProducts: [],
    cartProducts: [],
    page: 0,
    limit: 10,
    total: 10,
  }),
  getters: {
    getProductsByCategory: (state) => state.productsByCategory,
    getBestSellingProducts: (state) => state.bestSellingProducts,
    getSpecialOffers: (state) => state.specialOffers,
    getHomePageProducts: (state) => state.homePageProducts,
    getAllProducts: (state) => state.allProducts,
    getFavouredProducts: (state) => state.favouredProducts,
    getCartProducts: (state) => state.cartProducts,
    getPage: (state) => state.page,
    getLimit: (state) => state.limit,
    getTotal: (state) => state.total,
  },
  actions: {
    async fetchProducts() {
      // fetch the date and store the result in products (this.products = result)
    },
    toggleFavouredProduct(product) {
      const index = this.favouredProducts.findIndex(
        (item) => item?.id === product?.id
      );
      if (index !== -1) {
        this.favouredProducts.splice(index, 1);
      } else {
        this.favouredProducts.push(product);
      }
      this.copyFavouredToLocalStorage();
    },
    copyFavouredFromLocalStorage() {
      const favouredProducts = localStorage.getItem("favouredProducts");
      if (favouredProducts) {
        this.favouredProducts = JSON.parse(favouredProducts);
      }
    },
    copyFavouredToLocalStorage() {
      localStorage.setItem(
        "favouredProducts",
        JSON.stringify(this.favouredProducts)
      );
    },
    addToCart(cartItem) {
      const index = this.cartProducts.findIndex(
        (item) => item?.product?.id === cartItem?.product?.id
      );
      if (index === -1) {
        this.cartProducts.push(cartItem);
      } else {
        this.cartProducts[index].qty += 1;
      }
      this.copyCartToLocalStorage();
    },
    updateCartItemQty({ product, qty }) {
      const index = this.cartProducts.findIndex(
        (item) => item?.product?.id === product?.id
      );
      if (index !== -1) {
        this.cartProducts[index].qty = qty;
      } else {
        this.cartProducts.push({ product, qty });
      }
      this.copyCartToLocalStorage();
    },
    clearCart() {
      this.cartProducts = [];
      this.copyCartToLocalStorage();
    },
    removeFromCart(product) {
      const index = this.cartProducts.findIndex(
        (item) => item?.product?.id === product?.id
      );
      if (index !== -1) {
        this.cartProducts.splice(index, 1);
      }
      this.copyCartToLocalStorage();
    },
    copyCartFromLocalStorage() {
      const cartProducts = localStorage.getItem("cartProducts");
      if (cartProducts) {
        this.cartProducts = JSON.parse(cartProducts);
      }
    },
    copyCartToLocalStorage() {
      localStorage.setItem("cartProducts", JSON.stringify(this.cartProducts));
    },
  },
});
