import { defineStore } from "pinia";

export const useLocationStore = defineStore("location", {
  state: () => ({
    latitude: null, // store plain numbers
    longitude: null,
    locationLoaded: false,
  }),
  getters: {
    getLatitude: (state) => state.latitude,
    getLongitude: (state) => state.longitude,
    isLocationLoaded: (state) => state.locationLoaded,
  },
  actions: {
    setLocation(lat, lng) {
      this.latitude = lat;
      this.longitude = lng;
      this.locationLoaded = true;
    },

    async detectLocation() {
      try {
        // Try HTML5 geolocation first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setLocation(
                position.coords.latitude,
                position.coords.longitude
              );
              // Save to localStorage for next visits
              localStorage.setItem("latitude", position.coords.latitude);
              localStorage.setItem("longitude", position.coords.longitude);
            },
            async (err) => {
              console.warn("Geolocation error, falling back to IP lookup", err);
              await this.getLocationFromIP();
            }
          );
        } else {
          // fallback if geolocation not supported
          await this.getLocationFromIP();
        }
      } catch (error) {
        console.error("Error detecting location:", error);
        await this.getLocationFromIP();
      }
    },

    async getLocationFromIP() {
      try {
        const res = await fetch("https://ipapi.co/json/"); // or any IP geolocation API
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          this.setLocation(data.latitude, data.longitude);
          localStorage.setItem("latitude", data.latitude);
          localStorage.setItem("longitude", data.longitude);
        }
      } catch (error) {
        console.error("IP location lookup failed", error);
      }
    },

    loadLocationFromStorage() {
      const lat = parseFloat(localStorage.getItem("latitude"));
      const lng = parseFloat(localStorage.getItem("longitude"));
      if (!isNaN(lat) && !isNaN(lng)) {
        this.setLocation(lat, lng);
      }
    },
  },
});
