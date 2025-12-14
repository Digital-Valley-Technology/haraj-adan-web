import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

// Define the events used by the Socket Gateway (same as before)
const USER_CHAT_EVENTS = {
  COUNT_NOTIFICATIONS: "countChatNotifications",
  NEW_MESSAGE: "newUserMessage", // Need to listen for new messages to refresh count
};
const SUPPORT_CHAT_EVENTS = {
  COUNT_UNREAD_MESSAGES: "countUnreadMessages",
};

// Local variable to hold the socket instance once it's set
let socketInstance = null;

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    userChatCount: 0,
    supportChatCount: 0,
  }),

  actions: {
    /**
     * 1. Sets the socket instance and attaches ALL necessary listeners.
     * This should be called once after the app is mounted and the user is known.
     * @param {Object} socket - The global socket.io instance
     * @param {number} userId - The ID of the authenticated user
     */
    initializeSocketListeners(socket, userId) {
      if (!socket || !userId || socketInstance) return;

      socketInstance = socket;

      this.fetchInitialCounts(userId);

      // --- NORMAL CHAT LISTENERS ---

      // Listener 1: Update count when the server explicitly pushes a new count (after read/send)
      socketInstance.on(USER_CHAT_EVENTS.COUNT_NOTIFICATIONS, (payload) => {
        // The server might send a full count object { success: true, count: X }
        if (typeof payload === "object" && payload.success) {
          this.userChatCount = payload.count;
        } else {
          // Or the server might just signal a change (as implemented in NestJS gateway)
          this.fetchInitialCounts(userId);
        }
      });

      // Listener 2: When a NEW MESSAGE arrives, immediately refresh the notification count
      // This event is emitted by the server to all users in the chat room.
      // We listen to it globally to ensure the count badge updates instantly.
      socketInstance.on(USER_CHAT_EVENTS.NEW_MESSAGE, (message) => {
        const authStore = useAuthStore();
        // Check if the current user is the RECEIVER of the message
        // This logic depends on how your NEW_MESSAGE payload is structured.
        // If the message is for the CURRENT CHAT, the local chat component handles it.
        // If the message is for a DIFFERENT CHAT, we must update the global count.
        if (message.sender_id !== authStore.user.id) {
          this.userChatCount++; // Optimistic update, then refresh
          this.fetchInitialCounts(userId);
        }
      });

      // --- SUPPORT CHAT LISTENERS ---

      // Listener for Support Chat Notifications (assuming support logic is also running)
      socketInstance.on(
        SUPPORT_CHAT_EVENTS.COUNT_UNREAD_MESSAGES,
        (payload) => {
          if (payload && payload.success) {
            this.supportChatCount = payload.count;
          }
        }
      );

      console.log(`Socket listeners initialized for user: ${userId}`);
    },

    /**
     * 2. Emits the initial request to get the current unread counts from the server.
     */
    fetchInitialCounts(userId) {
      if (socketInstance && userId) {
        // Request count for Normal Chat (using the new event)
        socketInstance.emit(
          USER_CHAT_EVENTS.COUNT_NOTIFICATIONS,
          userId,
          (response) => {
            if (response.success) {
              this.userChatCount = response.count;
            }
          }
        );

        // Request count for Support Chat
        socketInstance.emit(
          SUPPORT_CHAT_EVENTS.COUNT_UNREAD_MESSAGES,
          userId,
          (response) => {
            if (response.success) {
              this.supportChatCount = response.count;
            }
          }
        );
      }
    },

    /**
     * 3. Utility action to emit the 'read' event from any component (e.g., ChatPage)
     */
    emitReadMessages(payload) {
      if (socketInstance) {
        socketInstance.emit("readUserMessages", payload);
      }
    },

    /**
     * 4. Utility action to manually trigger a count refresh
     */
    refreshCounts() {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;
      this.fetchInitialCounts(userId);
    },
  },
});
