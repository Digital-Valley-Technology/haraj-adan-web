import { createWebHashHistory, createRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

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
    meta: {
      requiresAuth: true,
      permissions: ["profile.read", "profile.write"],
    },
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
    redirect: "/dashboard/analytics",
    children: [
      {
        name: "analytics",
        path: "analytics",
        component: () => import("../dashboard/analytics/AnalyticsPage.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.read", "dashboard.write"],
        },
      },
      {
        name: "profile",
        path: "profile",
        component: () => import("../dashboard/ProfilePage.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.profile.read", "dashboard.profile.write"],
        },
      },
      {
        name: "categories",
        path: "categories",
        component: () => import("../dashboard/categories/CategoriesPage.vue"),
        meta: {
          requiresAuth: true,
          permissions: [
            "dashboard.categories.read",
            "dashboard.categories.write",
          ],
        },
      },
      {
        name: "banners",
        path: "banners",
        component: () => import("../dashboard/banners/BannersPage.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.banners.read", "dashboard.banners.write"],
        },
      },
      {
        name: "ads",
        path: "ads",
        component: () => import("../dashboard/ads/AdsPage.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.ads.read", "dashboard.ads.write"],
        },
      },
      {
        name: "transactions",
        path: "transactions",
        component: () =>
          import("../dashboard/transactions/TransactionsPage.vue"),
        meta: {
          requiresAuth: true,
          permissions: [
            "dashboard.transactions.read",
            "dashboard.transactions.write",
          ],
        },
      },
      {
        name: "users",
        path: "users",
        component: () => import("../dashboard/users/UsersPage.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.users.read", "dashboard.users.write"],
        },
      },

      // add and edit
      {
        name: "add-category",
        path: "categories/add-category",
        component: () => import("../dashboard/categories/add/index.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.categories.write"],
        },
      },
      {
        path: "/categories/edit-category/:categoryId",
        name: "edit-category",
        component: () => import("../dashboard/categories/edit/index.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.categories.write"],
        },
      },
      {
        path: "/categories/attributes/:categoryId",
        name: "category-attributes",
        component: () =>
          import("../dashboard/categories/attributes/CategoryAttributes.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.categories.write"],
        },
      },

            {
        name: "add-banner",
        path: "banners/add-banner",
        component: () => import("../dashboard/banners/add/index.vue"),
        meta: {
          requiresAuth: true,
          permissions: ["dashboard.banners.write"],
        },
      },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    name: "unauthorized",
    path: "/unauthorized",
    component: () => import("../pages/UnauthorizedPage.vue"),
  },
  {
    path: "/oauth-success",
    name: "OAuthSuccess",
    component: () => import("../pages/OAuthSuccess.vue"),
  },
    {
    path: "/verify-otp",
    name: "verify-otp",
    component: () => import("../pages/VerifyOtp.vue"),
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");

  if (token && !authStore.user) {
    await authStore.getMe();
  }

  const user = authStore.user;
  const isAuthenticated = !!user;

  // Not logged in
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }

  // Admin role check
  if (to.meta.requiresAdmin) {
    const isAdmin = user?.user_roles?.some((ur) =>
      ["MANAGER", "ADMIN"].includes(ur.roles?.code)
    );

    if (!isAdmin) {
      return next({ name: "unauthorized" }); // or redirect to 403
    }
  }

  // Permission check (based on `meta.permissions`)
  if (to.meta.permissions) {
    // Get all permission codes from all user roles
    const userPermissions = user.user_roles.flatMap(
      (ur) =>
        ur.roles?.role_permissions?.map((rp) => rp.permissions?.code) || []
    );

    // Check if user has every required permission
    const hasPermissions = to.meta.permissions.every((requiredCode) =>
      userPermissions.includes(requiredCode)
    );

    if (!hasPermissions) {
      return next({ name: "unauthorized" }); // or redirect to 403
    }
  }

  return next();
});
