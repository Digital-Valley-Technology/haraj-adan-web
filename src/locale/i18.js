import { createI18n } from "vue-i18n";
import ar from "./ar.json";
import en from "./en.json";

export const i18n = createI18n({
  locale: localStorage.raheed_lang || "ar",
  fallbackLocale: "ar",
  messages: { ar, en },
});
