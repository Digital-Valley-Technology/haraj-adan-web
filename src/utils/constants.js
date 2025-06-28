export const MODE = "DEV";

export const PROD_BASE_URL = "https://unityhelp.net/idps/api/v1";

export const DEV_BASE_URL = "http://localhost:3059/api/v1";

export const DEV_MEDIA_URL = "http://localhost:3059/uploads/";

export const PROD_MEDIA_URL = "https://unityhelp.net/uploads/";

export const DashboardBreadCrumbBase = {
  icon: "pi pi-home",
  route: "/dashboard/analytics",
};

export const heroSlides = [
  {
    src: "/images/slides/1.png",
    alt: "hero-slide-1",
    position: "object-top",
  },
  {
    src: "/images/slides/2.jpg",
    alt: "hero-slide-2",
    position: "object-center",
  },
];

export const sidebarItems = [
  {
    items: [
      {
        label: "sidebar.analytics",
        icon: "pi pi-chart-pie",
        link: "/dashboard/analytics",
        permissions: ["dashboard.read", "dashboard.write"],
      },
      {
        label: "sidebar.profile",
        icon: "pi pi-user",
        link: "/dashboard/profile",
        permissions: ["dashboard.profile.read", "dashboard.profile.write"],
      },
      {
        label: "sidebar.banners",
        icon: "pi pi-bookmark",
        link: "/dashboard/banners",
        permissions: [
          "dashboard.categories.read",
          "dashboard.categories.write",
        ],
      },
      {
        label: "sidebar.categories",
        icon: "pi pi-objects-column",
        link: "/dashboard/categories",
        permissions: [
          "dashboard.categories.read",
          "dashboard.categories.write",
        ],
      },
      {
        label: "sidebar.ads",
        icon: "pi pi-tags",
        link: "/dashboard/ads",
        permissions: [
          "dashboard.categories.read",
          "dashboard.categories.write",
        ],
      },
      {
        label: "sidebar.transactions",
        icon: "pi pi-money-bill",
        link: "/dashboard/transactions",
        permissions: [
          "dashboard.categories.read",
          "dashboard.categories.write",
        ],
      },
      {
        label: "sidebar.users",
        icon: "pi pi-users",
        link: "/dashboard/users",
        permissions: [
          "dashboard.categories.read",
          "dashboard.categories.write",
        ],
      },
    ],
  },
];

export const dashboardProfileItems = [
  {
    items: [
      {
        label: "header.back-home",
        icon: "pi pi-home",
        link: "/",
      },
      {
        label: "header.logout",
        icon: "pi pi-sign-out",
      },
    ],
  },
];

export const websiteProfileItems = [
  {
    items: [
      {
        label: "header.dashboard",
        icon: "pi pi-desktop",
        link: "/dashboard",
        permissions: ["dashboard.read", "dashboard.write"],
      },
      {
        label: "header.profile",
        icon: "pi pi-user-edit",
        link: "/dashboard/profile",
        permissions: ["dashboard.profile.read", "dashboard.profile.write"],
      },
      {
        label: "header.profile",
        icon: "pi pi-user-edit",
        link: "/user-profile",
        permissions: ["profile.read", "profile.write"],
      },
      {
        label: "header.logout",
        icon: "pi pi-sign-out",
      },
    ],
  },
];

export const navbarItems = [
  {
    label: "header.home",
    icon: "pi pi-home",
    link: "/",
  },
  {
    label: "header.about",
    icon: "pi pi-home",
    link: "/about",
  },
  {
    label: "header.contact",
    icon: "pi pi-home",
    link: "/contact",
  },
  {
    label: "header.register",
    icon: "pi pi-home",
    link: "/register",
    class: "hide-lg",
  },
  {
    label: "header.login",
    icon: "pi pi-home",
    link: "/login",
    class: "hide-lg",
  },
  {
    label: "header.en",
    icon: "pi-language",
    code: "en",
  },
  {
    label: "header.ar",
    icon: "pi-language",
    code: "ar",
  },
];

export const topNavbarItems = [
  {
    label: "topheader.register",
    icon: "/icons/profile.svg",
    link: "/login",
  },
  {
    label: "topheader.favoured",
    icon: "/icons/heartFilled.svg",
    link: "/favoured",
  },
  {
    label: "topheader.my-orders",
    icon: "/icons/navOrders.svg",
    link: "/my-orders",
  },
  {
    label: "topheader.home",
    icon: "/icons/apps.svg",
    link: "/",
  },
  {
    label: "topheader.help",
    icon: "/icons/help.svg",
    link: "/help",
  },
  {
    label: "topheader.partners",
    icon: "/icons/partners.svg",
  },
  {
    label: "topheader.ksa",
    icon: "/icons/saudi.svg",
  },
  {
    label: "topheader.en",
    icon: "pi-language",
    code: "en",
  },
];

export const footerContactItems = [
  {
    icon: "pi-whatsapp",
    label: "+966505636509",
  },
  {
    icon: "pi-mobile",
    label: "+966505636509",
  },
  {
    icon: "pi-phone",
    label: "0505636509",
  },
  {
    icon: "pi-envelope",
    label: "KSDADK@GMAIL.COM",
  },
];

export const footerImportantLinks = [
  {
    label: "footer.about",
    link: "/about",
  },
  {
    label: "footer.terms",
    link: "/terms",
  },
  {
    label: "footer.return-policy",
    link: "/return-policy",
  },
  {
    label: "footer.policy",
    link: "/policy",
  },
];

export const footerSocials = [
  {
    link: "https://x.com",
    icon: "pi-twitter",
  },
  {
    link: "https://youtube.com",
    icon: "pi-youtube",
  },
  {
    link: "https://facebook.com",
    icon: "pi-facebook",
  },
];

export const countries = [
  { name: "topheader.ksa-delivery", code: "ksa", flag: "/icons/saudi.svg" },
];
