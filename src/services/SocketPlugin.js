import { io } from "socket.io-client";
import { DEV_SOCKET_URL, MODE, PROD_SOCKET_URL } from "../utils/constants";
import { useAuthStore } from "../store/auth";

export const URL = MODE == "DEV" ? DEV_SOCKET_URL : PROD_SOCKET_URL;

export const socket =
  MODE == "DEV"
    ? io(`${URL}`, {
        withCredentials: true,
      })
    : io(`${URL}`, {
        withCredentials: true,
        path: "/haraj/socket.io/", // 👈 keep default unless you changed it server-side
        withCredentials: true,
      });

socket.on("connect_error", (err) => console.log(`connect_error due to ${err}`));

socket.on("connect", () => console.log("socket connected"));

socket.on("disconnect", () => console.log("socket disconnected"));

export default {
  install(app) {
    app.provide("socket", socket);

    const authStore = useAuthStore();

    window.addEventListener("beforeunload", () => {
      if (authStore.user) {
        socket.emit("offline", authStore.user.id || 0);
      }
    });

    socket.on("disconnect", () => {
      if (authStore.user) {
        socket.emit("offline", authStore.user.id || 0);
      }
    });

    socket.on("disconnecting", () => {
      if (authStore.user) {
        socket.emit("offline", authStore.user.id || 0);
      }
    });
  },
};
