let toastInstance = null;

// Set the toast instance
export const setToastInstance = (instance) => (toastInstance = instance);

// Generic function to show a toast
const showToast = (severity, message) =>
  !toastInstance
    ? console.error(
        "No PrimeVue Toast instance is set. Make sure to initialize it in the root component."
      )
    : toastInstance.add({
        severity,
        summary: "",
        detail: message,
        life: 3000,
      });

// Helper methods
export const showSuccess = (message) => showToast("success", message);

export const showError = (message) => showToast("error", message);

export const showInfo = (message) => showToast("info", message);

export const showWarning = (message) => showToast("warn", message);
