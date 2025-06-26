import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  { name: "home", path: "/", component: () => import("../pages/HomePage.vue") },
  {
    name: "about",
    path: "/about",
    component: () => import("../pages/AboutPage.vue"),
  },
  {
    name: "user-profile",
    path: "/user-profile",
    component: () => import("../pages/ProfilePage.vue"),
  },
  {
    name: "register",
    path: "/register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    name: "favoured",
    path: "/favoured",
    component: () => import("../pages/FavouredPage.vue"),
  },
  {
    name: "my-orders",
    path: "/my-orders",
    component: () => import("../pages/MyOrdersPage.vue"),
  },
  {
    name: "help",
    path: "/help",
    component: () => import("../pages/HelpPage.vue"),
  },
  {
    name: "cart",
    path: "/cart",
    component: () => import("../pages/CartPage.vue"),
  },
  {
    name: "checkout",
    path: "/checkout",
    component: () => import("../pages/CheckoutPage.vue"),
  },
  {
    name: "return-policy",
    path: "/return-policy",
    component: () => import("../pages/ReturnPage.vue"),
  },
  {
    name: "login",
    path: "/login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    name: "policy",
    path: "/policy",
    component: () => import("../pages/PolicyPage.vue"),
  },
  {
    name: "terms",
    path: "/terms",
    component: () => import("../pages/TermsPage.vue"),
  },
  {
    name: "faq",
    path: "/faq",
    component: () => import("../pages/FAQPage.vue"),
  },
  {
    name: "contact",
    path: "/contact",
    component: () => import("../pages/ContactPage.vue"),
  },
  {
    name: "product-details",
    path: "/products/:productId",
    component: () => import("../pages/ProductDetailsPage.vue"),
  },
  {
    name: "category-products",
    path: "/category-products/:categoryId",
    component: () => import("../pages/CategoryProductsPage.vue"),
  },
  {
    name: "dashboard",
    path: "/dashboard",
    redirect: "/dashboard/profile",
    children: [
      {
        name: "profile",
        path: "profile",
        component: () => import("../dashboard/ProfilePage.vue"),
      },
      {
        name: "categories",
        path: "categories",
        component: () => import("../dashboard/categories/CategoriesPage.vue"),
      },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    name: "404",
    path: "/:pathMatch(.*)*",
    component: () => import("../pages/Error404.vue"),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Check if there's a hash in the target route
    if (to.hash) {
      // Return a smooth scroll behavior to the element with the specified ID
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    if (to.name === "product-details") {
      // If the route is product details, scroll to the top of the page
      return { top: 0, behavior: "smooth" };
    }
    // If no hash and the route is not product details, return to top of the page or saved position
    else return savedPosition || { top: 0 };
  },
});
