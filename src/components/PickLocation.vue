<template>
  <div class="map-picker">
    <!-- Map -->
    <div :id="mapId" class="map-container"></div>

    <!-- Controls -->
    <div class="map-actions">
      <Button severity="secondary" @click="useCurrentLocation">
        {{ t("postAdd.use_my_location") }}
      </Button>
    </div>

    <!-- Coordinates -->
    <div class="coords">
      <label>{{ t("postAdd.address") }}</label>
      <div class="address-preview">
        {{ address ? address : t("postAdd.no_address") }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { IP_INFO_TOKEN, MAP_ACCESS_TOKEN } from "../utils/constants";

function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lat: null, lng: null, address: "" }),
  },
  mapId: { type: String, default: "map" },
  zoom: { type: Number, default: 12 },
});

const emit = defineEmits(["update:modelValue"]);
const { t, locale } = useI18n();

const defaultCenter = { lat: 20, lng: 0 }; // Global default
const map = ref(null);
const marker = ref(null);
const geocoder = ref(null);
const lat = ref(props.modelValue.lat ?? defaultCenter.lat);
const lng = ref(props.modelValue.lng ?? defaultCenter.lng);
const address = ref(props.modelValue.address || "");

/* ------------------------------
   Detect Country/Location by IP (Updated)
-------------------------------- */
async function detectCountryByIP() {
  try {
    // ✅ ipinfo.io has free API with CORS enabled — sign up for free token
    const res = await fetch(`https://ipinfo.io/json?token=${IP_INFO_TOKEN}`);
    const data = await res.json();

    if (data?.loc) {
      const [latitude, longitude] = data.loc.split(",");
      lat.value = parseFloat(latitude);
      lng.value = parseFloat(longitude);
      map.value?.flyTo({ center: [lng.value, lat.value], zoom: 7 });
      ensureMarker(lng.value, lat.value);
      await reverseGeocode(lng.value, lat.value);
      return;
    }
  } catch (err) {
    console.warn("Could not detect location by IP:", err);
  }

  // fallback to global center
  map.value?.flyTo({ center: [defaultCenter.lng, defaultCenter.lat], zoom: 3 });
}

watch(
  () => props.modelValue,
  (val) => {
    if (!map.value) return;
    if (val.lat !== null && val.lng !== null) {
      lat.value = val.lat;
      lng.value = val.lng;
      address.value = val.address || "";
      ensureMarker(lng.value, lat.value);
      map.value.setCenter([lng.value, lat.value]);
      if (!address.value) reverseGeocode(lng.value, lat.value);
    }
  },
  { deep: true, immediate: true }
);

watch([lat, lng], ([newLat, newLng]) => {
  if (map.value && marker.value) {
    emit("update:modelValue", {
      lat: newLat,
      lng: newLng,
      address: address.value,
    });
  }
});

const initRTLPlugin = debounce(() => {
  if (!window._rtlPluginLoaded && window.mapboxgl.setRTLTextPlugin) {
    window.mapboxgl.setRTLTextPlugin(
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
      null,
      true
    );
    window._rtlPluginLoaded = true;
  }
}, 500);

function updateMapLanguage() {
  if (!map.value) return;
  const lang = locale.value === "ar" ? "name_ar" : "name_en";
  const layers = map.value.getStyle().layers;
  layers.forEach((layer) => {
    if (layer.type === "symbol" && layer.layout?.["text-field"]) {
      const fieldAsString = JSON.stringify(layer.layout["text-field"]);
      if (fieldAsString.includes("name")) {
        map.value.setLayoutProperty(layer.id, "text-field", ["get", lang]);
      }
    }
  });
}

function updateGeocoder() {
  if (!map.value || !window.MapboxGeocoder) return;
  if (geocoder.value) map.value.removeControl(geocoder.value);

  geocoder.value = new window.MapboxGeocoder({
    accessToken: window.mapboxgl.accessToken,
    mapboxgl: window.mapboxgl,
    marker: false,
    placeholder: t("postAdd.search_place"),
    language: locale.value === "ar" ? "ar" : "en",
  });

  map.value.addControl(geocoder.value);

  geocoder.value.on("result", (e) => {
    const coords = e.result.center;
    lng.value = coords[0];
    lat.value = coords[1];
    address.value = e.result.place_name;
    ensureMarker(coords[0], coords[1]);
    map.value.setCenter(coords);
    emit("update:modelValue", {
      lat: lat.value,
      lng: lng.value,
      address: address.value,
    });
  });
}

async function reverseGeocode(lngVal, latVal) {
  try {
    const lang = locale.value === "ar" ? "ar" : "en";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngVal},${latVal}.json?access_token=${window.mapboxgl.accessToken}&language=${lang}`;
    const res = await fetch(url);
    const data = await res.json();
    address.value = data.features?.[0]?.place_name || "";
    emit("update:modelValue", {
      lat: latVal,
      lng: lngVal,
      address: address.value,
    });
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
  }
}

function ensureMarker(lngVal = lng.value, latVal = lat.value) {
  if (!map.value) return;
  if (!marker.value) {
    marker.value = new window.mapboxgl.Marker({ draggable: true, color: "red" })
      .setLngLat([lngVal, latVal])
      .addTo(map.value);
    marker.value.on("dragend", async () => {
      const lngLat = marker.value.getLngLat();
      lng.value = lngLat.lng;
      lat.value = lngLat.lat;
      await reverseGeocode(lng.value, lat.value);
    });
  } else {
    marker.value.setLngLat([lngVal, latVal]);
  }
}

function useCurrentLocation() {
  if (!navigator.geolocation) return alert(t("postAdd.geo_not_supported"));
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      lat.value = pos.coords.latitude;
      lng.value = pos.coords.longitude;
      ensureMarker(lng.value, lat.value);
      map.value.flyTo({ center: [lng.value, lat.value], zoom: 13 });
      await reverseGeocode(lng.value, lat.value);
    },
    () => alert(t("postAdd.geo_denied"))
  );
}

// onMounted(async () => {
//   nextTick(async () => {
//     window.mapboxgl.accessToken = MAP_ACCESS_TOKEN;
//     initRTLPlugin();

//     map.value = new window.mapboxgl.Map({
//       container: props.mapId,
//       style: "mapbox://styles/mapbox/streets-v12",
//       center: [lng.value, lat.value],
//       zoom: props.zoom,
//       minZoom: 3,
//       maxZoom: 18,
//       attributionControl: false,
//     });

//     updateGeocoder();

//     await detectCountryByIP();

//     map.value.on("click", async (e) => {
//       lng.value = e.lngLat.lng;
//       lat.value = e.lngLat.lat;
//       ensureMarker(lng.value, lat.value);
//       map.value.flyTo({ center: [lng.value, lat.value], zoom: 13 });
//       await reverseGeocode(lng.value, lat.value);
//     });

//     map.value.on("style.load", () => {
//       updateMapLanguage();
//       if (props.modelValue.lat && props.modelValue.lng)
//         reverseGeocode(lng.value, lat.value);
//     });
//   });
// });

onMounted(async () => {
  nextTick(async () => {
    window.mapboxgl.accessToken = MAP_ACCESS_TOKEN;
    initRTLPlugin();

    map.value = new window.mapboxgl.Map({
      container: props.mapId,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng.value, lat.value],
      zoom: props.zoom,
    });

    updateGeocoder();

    // FIX: Don't overwrite ad location when editing
    if (!props.modelValue.lat || !props.modelValue.lng) {
      await detectCountryByIP();
    } else {
      ensureMarker(lng.value, lat.value);
      reverseGeocode(lng.value, lat.value);
    }

    map.value.on("click", async (e) => {
      lng.value = e.lngLat.lng;
      lat.value = e.lngLat.lat;
      ensureMarker(lng.value, lat.value);
      map.value.flyTo({ center: [lng.value, lat.value], zoom: 13 });
      await reverseGeocode(lng.value, lat.value);
    });
  });
});

watch(locale, () => {
  updateMapLanguage();
  updateGeocoder();
  if (marker.value) reverseGeocode(lng.value, lat.value);
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.map-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.coords {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.coords label {
  font-weight: bold;
}
.address-preview {
  font-weight: bold;
  font-size: 1rem;
  color: #333;
  background-color: #f5f5f5;
  padding: 0.75rem;
  border-radius: 0.5rem;
  line-height: 1.4;
  word-break: break-word;
}
</style>
