import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./router";
import { i18n } from "./locale/i18";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Aura from "@primevue/themes/aura";
import "./style.css";
import "primeicons/primeicons.css";
import App from "./App.vue";

const pinia = createPinia();

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        prefix: "my",
        darkModeSelector: ".dark",
        cssLayer: false,
      },
    },
  })
  .use(pinia)
  .use(router)
  .use(i18n)
  .use(ToastService)
  .mount("#app");
