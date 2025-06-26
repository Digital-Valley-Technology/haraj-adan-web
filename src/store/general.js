import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    sidebarVisible: false,
    disktopSidebarVisible: true,
    lang: localStorage.raheed_lang || "ar",
  }),
  getters: {
    getSidebarVisible: (state) => state.sidebarVisible,
    getDesktopSidebarVisible: (state) => state.disktopSidebarVisible,
    getLang: (state) => state.lang,
  },
  actions: {
    setSidebarVisible(payload) {
      this.sidebarVisible = payload;
    },
    toggleSidebarVisible() {
      this.sidebarVisible = !this.sidebarVisible;
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
      localStorage.raheed_lang = selectedLang;
      // change the state lang
      this.lang = selectedLang;
    },
  },
});
