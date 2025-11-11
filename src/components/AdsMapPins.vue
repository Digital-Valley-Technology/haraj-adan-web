<template>
  <div class="map-container-wrapper">
    <div :id="mapId" class="map-container"></div>
    <div v-if="noPins" class="no-pins-overlay">
      {{ t("ads.no_locations_to_show") }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
// Ensure both MAP_ACCESS_TOKEN and MEDIA_URL are correctly imported
import { MAP_ACCESS_TOKEN } from "../utils/constants";
import { MEDIA_URL } from "../services/axios";

// --- Helper functions for Ad Details (Copied from main page) ---

const extractAndFormatCityAndCountry = (formattedAddress) => {
  if (
    !formattedAddress ||
    typeof formattedAddress !== "string" ||
    formattedAddress === "N/A"
  ) {
    return "N/A";
  }
  const parts = formattedAddress.split("،").map((part) => part.trim());
  const non_empty_parts = parts.filter((part) => part.length > 0);
  if (non_empty_parts.length < 2) {
    if (non_empty_parts.length === 1) {
      return non_empty_parts[0];
    }
    return "N/A";
  }
  const country = non_empty_parts[non_empty_parts.length - 1];
  let cityAndZip = non_empty_parts[non_empty_parts.length - 2];
  const city = cityAndZip.replace(/[0-9]/g, "").trim();
  return `${city}، ${country}`;
};

const getAdAddress = (ad) => {
  const fullAddress = ad.ad_attributes?.find((att) => att?.address)?.address;
  return fullAddress ? extractAndFormatCityAndCountry(fullAddress) : "N/A";
};

const mainImage = (img) => {
  // Use a fallback image if the URL is not valid
  return img ? `${MEDIA_URL}/${img}` : "fallback-image-url.jpg";
};

// --- Component Props and Setup ---
const props = defineProps({
  // The full ads array is required to access all data for the popup
  ads: {
    type: Array,
    default: () => [],
  },
  mapId: { type: String, default: "ads-map" },
  zoom: { type: Number, default: 6 },
});

const { t, locale } = useI18n();
const map = ref(null);
const markers = ref([]);
const noPins = computed(() => props.ads.length === 0);

// --- FIX: Declare a single, reusable popup instance ---
const adPopup = ref(null);

// --- Coordinate Extraction (Reused Logic) ---
const getAdCoordinates = (ad) => {
  const locationAttribute = ad.ad_attributes?.find(
    (att) => att?.lat && att?.lng
  );
  if (locationAttribute) {
    return {
      lat: +locationAttribute.lat,
      lng: +locationAttribute.lng,
    };
  }
  return null;
};

// Filter ads to get only those with valid coordinates
const adsWithCoords = computed(() => {
  return props.ads
    .map((ad) => ({
      ...ad,
      coords: getAdCoordinates(ad),
    }))
    .filter((ad) => ad.coords !== null);
});

const defaultCenter = { lat: 20, lng: 0 };

/* ------------------------------
    Mapbox Helper Functions 
-------------------------------- */

function initRTLPlugin() {
  if (!window._rtlPluginLoaded && window.mapboxgl.setRTLTextPlugin) {
    window.mapboxgl.setRTLTextPlugin(
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
      null,
      true
    );
    window._rtlPluginLoaded = true;
  }
}

function updateMapLanguage() {
  if (!map.value) return;
  const lang = locale.value === "ar" ? "name_ar" : "name_en";
  const style = map.value.getStyle();
  if (!style) return;

  style.layers.forEach((layer) => {
    if (layer.type === "symbol" && layer.layout?.["text-field"]) {
      const fieldAsString = JSON.stringify(layer.layout["text-field"]);
      if (fieldAsString.includes("name")) {
        map.value.setLayoutProperty(layer.id, "text-field", ["get", lang]);
      }
    }
  });
}

/* ------------------------------
    Marker Management with Popups
-------------------------------- */

function clearMarkers() {
  // Close the single popup before removing markers
  if (adPopup.value && adPopup.value.isOpen()) {
    adPopup.value.remove();
  }
  markers.value.forEach((marker) => marker.remove());
  markers.value = [];
}

/**
 * Generates the HTML content for the Mapbox Popup.
 * @param {Object} ad The full ad object.
 * @returns {string} The HTML string for the popup.
 */
function createPopupContent(ad) {
  const adTitle = locale.value === "ar" ? ad.title : ad.title_en;
  const adPrice =
    locale.value === "ar"
      ? `${ad.price} ${ad?.currencies?.name}`
      : `${ad?.currencies?.name_en} ${ad.price}`;
  const adImage = mainImage(ad?.ads_images?.[0]?.image);
  const adLocation = getAdAddress(ad);
  const rtl = locale.value === "ar" ? "rtl" : "ltr";

  // Using a link to allow navigation to ad details
  return `
    <div style="direction: ${rtl}; max-width: 250px; padding: 5px; text-align: start;">
      <a href="/ad-details/${ad.id}" target="_blank" style="text-decoration: none; color: inherit;">
        <img 
          src="${adImage}" 
          alt="${adTitle}" 
          style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;"
        />
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 4px 0;">${adTitle}</h3>
      </a>
      <p style="font-size: 0.9rem; color: #146AAB; font-weight: bold; margin: 0 0 4px 0;">
        ${adPrice}
      </p>
      <p style="font-size: 0.8rem; color: #555; margin: 0;">
        <i class="pi pi-map-marker" style="font-size: 0.7rem; margin-inline-end: 4px;"></i>
        ${adLocation}
      </p>
    </div>
  `;
}

function addMarkers() {
  clearMarkers();

  if (adsWithCoords.value.length === 0) {
    map.value?.flyTo({
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 3,
    });
    return;
  }

  const bounds = new window.mapboxgl.LngLatBounds();

  adsWithCoords.value.forEach((ad) => {
    const { lat, lng } = ad.coords;
    const lngLat = [lng, lat];

    // 1. Create the Marker
    const newMarker = new window.mapboxgl.Marker({
      color: "#146AAB",
      scale: 0.7,
    })
      .setLngLat(lngLat)
      // DO NOT use .setPopup() here, we manage it globally
      .addTo(map.value);

    // 2. Add the Click Listener to the marker element
    newMarker.getElement().addEventListener("click", () => {
      // Update and open the SINGLE, reusable popup instance
      adPopup.value
        .setLngLat(lngLat)
        .setHTML(createPopupContent(ad))
        .addTo(map.value);

      // Optional: Gently fly to the marker when clicked
      map.value.flyTo({
        center: lngLat,
        zoom: map.value.getZoom(),
        essential: true,
        speed: 0.5,
      });
    });

    markers.value.push(newMarker);
    bounds.extend(lngLat);
  });

  // Fit the map view to show all markers
  map.value?.fitBounds(bounds, {
    padding: 50,
    duration: 1000,
    maxZoom: props.zoom,
  });
}

// --- Initialization and Watchers ---

onMounted(() => {
  nextTick(() => {
    if (!window.mapboxgl) {
      console.error(
        "Mapbox GL JS is not loaded. Ensure the library is included globally."
      );
      return;
    }

    window.mapboxgl.accessToken = MAP_ACCESS_TOKEN;
    initRTLPlugin();

    const initialCoords = adsWithCoords.value[0]?.coords || defaultCenter;

    map.value = new window.mapboxgl.Map({
      container: props.mapId,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialCoords.lng, initialCoords.lat],
      zoom: props.zoom,
      minZoom: 2,
      maxZoom: 18,
      attributionControl: false,
    });

    // --- FIX: Initialize the single popup instance after map creation ---
    adPopup.value = new window.mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      // If true, clicking anywhere on the map closes it.
      // Setting to false lets Mapbox handle internal close events (e.g., the 'x' button).
      closeOnClick: false,
    });

    map.value.on("style.load", () => {
      updateMapLanguage();
      addMarkers();
    });
  });
});

watch(
  () => props.ads,
  () => {
    if (map.value) {
      addMarkers();
    }
  },
  { deep: true }
);

watch(locale, () => {
  if (map.value) {
    // Re-add markers to rebuild the popup HTML with the new locale text
    updateMapLanguage();
    addMarkers();
  }
});
</script>

<style scoped>
.map-container-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}
.no-pins-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
  border-radius: 12px;
  z-index: 10;
}
.map-container {
  border-radius: 12px;
  margin-bottom: 0;
}
</style>
