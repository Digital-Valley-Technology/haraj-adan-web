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
import { MAP_ACCESS_TOKEN, MODE, DEV_MEDIA_URL, PROD_MEDIA_URL } from "../utils/constants";

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
const popups = ref([]);
const noPins = computed(() => props.ads.length === 0);
const MEDIA_URL = MODE === "DEV" ? DEV_MEDIA_URL : PROD_MEDIA_URL;


// --- Coordinate Extraction (Reused Logic) ---
const getAdCoordinates = (ad) => {
  if (ad?.lat != null && ad?.lng != null) {
    return {
      lat: +ad?.lat,
      lng: +ad?.lng,
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
    Popup Content Helper
-------------------------------- */

function createPopupContent(ad) {
  // Get ad image - using ads_images array with image property
  const imageUrl = ad.ads_images?.[0]?.image
    ? `${MEDIA_URL}/${ad.ads_images[0].image}`
    : "/images/placeholder.png";

  // Get title based on locale
  const title = locale.value === "ar" ? (ad.title || ad.title_en) : (ad.title_en || ad.title);

  // Get price display
  const price = ad.price ? `${ad.price} ${ad.currency?.code || ""}` : t("ads.price_not_set");

  // Get address/location
  const address = ad.address || t("ads.no_address");

  // Create HTML content - using hash router link
  return `
    <a href="#/ad-details/${ad.id}" class="ad-popup-link" style="text-decoration: none; color: inherit; display: block;">
      <div class="ad-popup" style="min-width: 200px; max-width: 280px; cursor: pointer;">
        <img src="${imageUrl}" alt="${title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0;" onerror="this.src='/images/placeholder.png'"/>
        <div style="padding: 10px;">
          <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${title}</h4>
          <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #146AAB;">${price}</p>
          <p style="margin: 0; font-size: 12px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">📍 ${address}</p>
        </div>
      </div>
    </a>
  `;
}

/* ------------------------------
    Marker Management
-------------------------------- */

function clearMarkers() {
  markers.value.forEach((marker) => marker.remove());
  popups.value.forEach((popup) => popup.remove());
  markers.value = [];
  popups.value = [];
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

    // 1. Create the Popup with ad details
    const popup = new window.mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false,
      maxWidth: "300px",
    }).setHTML(createPopupContent(ad));

    // 2. Create the Marker and attach popup
    const newMarker = new window.mapboxgl.Marker({
      color: "#146AAB",
      scale: 0.7,
    })
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map.value);

    // 3. Style the marker cursor to indicate it's clickable
    newMarker.getElement().style.cursor = "pointer";

    markers.value.push(newMarker);
    popups.value.push(popup);
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

<style>
/* Global popup styles - not scoped so they apply to Mapbox popups */
.mapboxgl-popup-content {
  padding: 0 !important;
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.mapboxgl-popup-close-button {
  font-size: 18px;
  padding: 4px 8px;
  color: #666;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  margin: 4px;
}

.mapboxgl-popup-close-button:hover {
  color: #333;
  background: #fff;
}

.ad-popup-link:hover .ad-popup {
  background-color: #f9f9f9;
}
</style>
