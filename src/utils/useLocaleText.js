import { useI18n } from "vue-i18n";

export function useLocaleText() {
  const { locale } = useI18n();
  return (arText, enText) => (locale.value === "ar" ? arText : enText);
}
