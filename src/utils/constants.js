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
        label: "sidebar.profile",
        icon: "pi pi-user",
        link: "/dashboard/profile",
      },
      {
        label: "sidebar.categories",
        icon: "pi pi-objects-column",
        link: "/dashboard/categories",
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
      },
      {
        label: "header.profile",
        icon: "pi pi-user-edit",
        link: "/user-profile",
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
