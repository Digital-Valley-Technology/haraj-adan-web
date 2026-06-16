import { defineStore } from "pinia";
import { playMessageChime } from "../utils/notificationSound";

// Module-level handler reference so we can attach/detach our own
// `newSupportMessage` listener without clobbering other listeners (off by name
// would remove everyone's).
let newSupportMsgHandler = null;

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    userChatCount: 0, // Customer-to-customer chat notifications
    supportChatCount: 0, // Customer-to-admin chat notifications
    _initialized: false,
    _socket: null,
    _userId: null,
  }),

  actions: {
    /**
     * Initialize socket listeners for notification events
     */
    initializeSocketListeners(socket, userId) {
      if (!socket || !userId) {
        console.warn(
          "⚠️ [NOTIFICATIONS] Cannot initialize - missing socket or userId"
        );
        return;
      }

      this._socket = socket;
      this._userId = userId;

      // Prevent duplicate listeners
      if (this._initialized) {
        console.log(
          "✅ [NOTIFICATIONS] Already initialized, refreshing counts"
        );
        this.refreshCounts();
        return;
      }

      console.log(
        "🔔 [NOTIFICATIONS] Initializing notification listeners for user:",
        userId
      );

      // ============================================================
      // LISTENER 1: User Chat Notifications (customer-to-customer)
      // ============================================================
      socket.off("countChatNotifications"); // Remove old listeners
      socket.on("countChatNotifications", (response) => {
        console.log("📊 [NOTIFICATIONS] User chat count update:", response);

        if (response?.success && typeof response.count === "number") {
          // A genuine new message raises the unread count — play a subtle chime.
          // (Sending your own message leaves the count unchanged, so the sender
          // doesn't hear it.)
          if (response.count > this.userChatCount) playMessageChime();
          this.userChatCount = response.count;
          console.log(
            "✅ [NOTIFICATIONS] User chat count set to:",
            this.userChatCount
          );
        } else if (response?.changed) {
          // Server notified of change, request fresh count
          console.log(
            "🔄 [NOTIFICATIONS] Change detected, refreshing user chat count"
          );
          this.fetchUserChatCount();
        }
      });

      // ============================================================
      // LISTENER 2: Support Chat Notifications (customer-to-admin)
      // ============================================================
      socket.off("countUnreadMessages"); // Remove old listeners
      socket.on("countUnreadMessages", (response) => {
        console.log("📊 [NOTIFICATIONS] Support chat count update:", response);

        if (response?.success && typeof response.count === "number") {
          if (response.count > this.supportChatCount) playMessageChime();
          this.supportChatCount = response.count;
          console.log(
            "✅ [NOTIFICATIONS] Support chat count set to:",
            this.supportChatCount
          );
        }
      });

      // ============================================================
      // LISTENER 3: Admin Support Chat Notifications (for admins)
      // ============================================================
      socket.off("countUnreadAdminMessages"); // Remove old listeners
      socket.on("countUnreadAdminMessages", (response) => {
        console.log("📊 [NOTIFICATIONS] Admin support count update:", response);

        if (response?.success && typeof response.count === "number") {
          if (response.count > this.supportChatCount) playMessageChime();
          this.supportChatCount = response.count;
          console.log(
            "✅ [NOTIFICATIONS] Admin support count set to:",
            this.supportChatCount
          );
        }
      });

      // ============================================================
      // LISTENER 4: New support message → refresh the support count.
      // The server doesn't push a count nudge on a support message (unlike user
      // chat's `changed` event), so without this the customer's support badge
      // wouldn't update until a reconnect. Attached by reference so reset() can
      // detach exactly our handler without disturbing other listeners.
      // ============================================================
      if (newSupportMsgHandler) socket.off("newSupportMessage", newSupportMsgHandler);
      newSupportMsgHandler = (msg) => {
        const sender =
          msg?.sender_id ?? msg?.senderId ?? msg?.message?.sender_id;
        // Ignore our own messages (no badge/sound for what we just sent).
        if (sender != null && Number(sender) === Number(this._userId)) return;
        this.fetchSupportChatCount();
      };
      socket.on("newSupportMessage", newSupportMsgHandler);

      this._initialized = true;

      // Fetch initial counts immediately
      this.refreshCounts();
    },

    /**
     * ⭐ KEY FIX: Request fresh counts from server
     */
    refreshCounts() {
      if (!this._socket || !this._userId) {
        console.warn(
          "⚠️ [NOTIFICATIONS] Cannot refresh - missing socket or userId"
        );
        return;
      }

      console.log(
        "🔄 [NOTIFICATIONS] Refreshing all notification counts for user:",
        this._userId
      );

      // Request user chat count (customer-to-customer) - THIS WAS MISSING!
      this.fetchUserChatCount();

      // Request support chat count (customer-to-admin)
      this.fetchSupportChatCount();
    },

    /**
     * ⭐ CRITICAL FIX: Explicitly request user chat notification count
     * THIS METHOD WAS MISSING - IT'S THE MAIN FIX!
     *
     * NOTE: Backend uses emit (not callback), so response comes via socket listener
     */
    fetchUserChatCount() {
      if (!this._socket || !this._userId) return;

      console.log(
        "📤 [NOTIFICATIONS] Requesting user chat count for:",
        this._userId
      );

      // ⭐ FIX: Just emit the userId (no callback)
      // Backend will emit back to "countChatNotifications" listener
      this._socket.emit("countChatNotifications", this._userId);
    },

    /**
     * Request support chat notification count
     *
     * NOTE: Backend uses emit (not callback), so response comes via socket listener
     */
    fetchSupportChatCount() {
      if (!this._socket || !this._userId) return;

      console.log(
        "📤 [NOTIFICATIONS] Requesting support chat count for:",
        this._userId
      );

      // ⭐ FIX: Backend expects { userId: number } payload
      // Backend will emit back to "countUnreadMessages" listener
      this._socket.emit("countUnreadMessages", { userId: this._userId });
    },

    /**
     * Reset notification state (called on logout)
     */
    reset() {
      console.log("🔄 [NOTIFICATIONS] Resetting notification store");

      // Clean up listeners
      if (this._socket) {
        this._socket.off("countChatNotifications");
        this._socket.off("countUnreadMessages");
        this._socket.off("countUnreadAdminMessages");
        if (newSupportMsgHandler) {
          this._socket.off("newSupportMessage", newSupportMsgHandler);
          newSupportMsgHandler = null;
        }
      }

      this.userChatCount = 0;
      this.supportChatCount = 0;
      this._initialized = false;
      this._socket = null;
      this._userId = null;
    },
  },
});
