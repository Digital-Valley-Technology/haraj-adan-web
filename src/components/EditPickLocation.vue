<template>
  <div class="map-wrapper">
    <div :id="mapId" class="map-container"></div>

    <div class="coords-box">
      <strong>{{ t("postAdd.address") }}:</strong>
      <div class="address-text">
        {{ internal.address || t("postAdd.no_address") }}
      </div>
    </div>

    <Button severity="secondary" @click="useCurrentLocation">
      {{ t("postAdd.use_my_location") }}
    </Button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { MAP_ACCESS_TOKEN } from "../utils/constants";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lat: null, lng: null, address: "" }),
  },
  mapId: { type: String, default: "edit-map" },
  zoom: { type: Number, default: 14 },
});

const emit = defineEmits(["update:modelValue"]);
const { t } = useI18n();

const internal = ref({
  lat: props.modelValue.lat,
  lng: props.modelValue.lng,
  address: props.modelValue.address,
});

const map = ref(null);
const marker = ref(null);

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return;
    internal.value.lat = v.lat;
    internal.value.lng = v.lng;
    internal.value.address = v.address;
    updateMarker();
  },
  { deep: true }
);

function updateMarker() {
  if (!map.value || !internal.value.lat || !internal.value.lng) return;

  if (!marker.value) {
    marker.value = new window.mapboxgl.Marker({ draggable: true, color: "red" })
      .setLngLat([internal.value.lng, internal.value.lat])
      .addTo(map.value);

    marker.value.on("dragend", () => {
      const pos = marker.value.getLngLat();
      updateLocation(pos.lng, pos.lat);
    });
  } else {
    marker.value.setLngLat([internal.value.lng, internal.value.lat]);
  }

  map.value.setCenter([internal.value.lng, internal.value.lat]);
}

async function updateLocation(newLng, newLat) {
  internal.value.lat = newLat;
  internal.value.lng = newLng;

  // Reverse geocode
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${newLng},${newLat}.json?access_token=${MAP_ACCESS_TOKEN}`;
  const res = await fetch(url);
  const data = await res.json();
  internal.value.address = data.features?.[0]?.place_name || "";

  emit("update:modelValue", { ...internal.value });
}

function useCurrentLocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      updateLocation(pos.coords.longitude, pos.coords.latitude);
      updateMarker();
    },
    () => alert("Permission denied")
  );
}

onMounted(() => {
  nextTick(() => {
    window.mapboxgl.accessToken = MAP_ACCESS_TOKEN;

    map.value = new window.mapboxgl.Map({
      container: props.mapId,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [internal.value.lng ?? 30, internal.value.lat ?? 30],
      zoom: props.zoom,
    });

    map.value.on("load", () => {
      if (internal.value.lat && internal.value.lng) updateMarker();
    });

    map.value.on("click", (e) => {
      updateLocation(e.lngLat.lng, e.lngLat.lat);
      updateMarker();
    });
  });
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.coords-box {
  margin-bottom: 1rem;
}
.address-text {
  background: #f1f1f1;
  padding: 10px;
  border-radius: 6px;
}
</style>
