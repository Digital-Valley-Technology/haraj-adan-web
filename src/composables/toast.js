import { useToast } from "primevue/usetoast";
import { useI18n } from "vue-i18n";

export function useCustomToast() {
  const { t } = useI18n();
  const toast = useToast();
  const life = 3000; // Duration for which the toast will be visible

  function showSuccess(message) {
    toast.add({
      severity: "success",
      summary: t("generic.success"),
      detail: message,
      life,
    });
  }

  function showError(message) {
    toast.add({
      severity: "error",
      summary: t("generic.error"),
      detail: message,
      life,
    });
  }

  function showMutual(message) {
    toast.add({
      severity: "secondary",
      detail: message,
      life,
    });
  }

  return {
    showSuccess,
    showError,
    showMutual,
  };
}
