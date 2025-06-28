import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    sidebarVisible: false,
    disktopSidebarVisible: true,
    lang: localStorage.haraj_lang || "ar",
    isLoading: false,
  }),
  getters: {
    getSidebarVisible: (state) => state.sidebarVisible,
    getDesktopSidebarVisible: (state) => state.disktopSidebarVisible,
    getLang: (state) => state.lang,
    getIsLoading: (state) => state.isLoading,
  },
  actions: {
    setSidebarVisible(payload) {
      this.sidebarVisible = payload;
    },
    toggleSidebarVisible() {
      this.sidebarVisible = !this.sidebarVisible;
    },
    setLoading(value) {
      this.isLoading = value;
    },
    toggleDesktopSidebarVisibility() {
      this.disktopSidebarVisible = !this.disktopSidebarVisible;
    },
    toggleLang(t, selectedLang) {
      // toggle html direction
      document.documentElement?.setAttribute("lang", selectedLang);
      document.documentElement?.setAttribute(
        "dir",
        selectedLang == "en" ? "ltr" : "rtl"
      );
      // toggle locale
      t.locale.value = selectedLang;
      // toggle body ar class
      if (selectedLang == "en") {
        document.body.classList.remove("ar");
      } else {
        document.body.classList.add("ar");
      }
      // save to localStorage
      localStorage.haraj_lang = selectedLang;
      // change the state lang
      this.lang = selectedLang;
    },
  },
});
