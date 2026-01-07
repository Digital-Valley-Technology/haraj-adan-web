import { defineStore } from "pinia";
import requestService from "../services/api/requestService";
import { socket } from "../services/SocketPlugin";
import { useAuthStore } from "./auth";
import { useNotificationStore } from "./notifications";

export const useCustomerChatStore = defineStore("customerChat", {
  state: () => ({
    messages: [],
    loadingMessages: false,
    messagePage: 1,
    messageLimit: 20,
    hasMoreMessages: true,
    _listening: false,
    activeChatId: null,
  }),

  getters: {
    getMessages: (state) => state.messages,
  },

  actions: {
    /**
     * ⭐ FIXED: Better chat ID tracking and room joining
     * Fetch paginated messages for the logged-in customer
     */
    async fetchUserChat({ append = false } = {}) {
      if (this.loadingMessages) return;
      this.loadingMessages = true;

      try {
        const pageToFetch = append ? this.messagePage + 1 : 1;
        const res = await requestService.getAll(
          `/support-chats/customer/paginate?page=${pageToFetch}&limit=${this.messageLimit}`
        );

        const batch = Array.isArray(res.data) ? res.data : [];

        // ⭐ FIXED: Set activeChatId from first message
        if (batch.length > 0 && batch[0].support_chat_id) {
          this.activeChatId = batch[0].support_chat_id;
        }

        // Sort messages ascending (oldest → newest)
        const orderedBatch = [...batch].sort(
          (a, b) => new Date(a.created) - new Date(b.created)
        );

        if (!append) {
          this.messages = orderedBatch;
          this.messagePage = 1;
        } else {
          // Add older messages on top, avoid duplicates
          const existingIds = new Set(this.messages.map((m) => m.id));
          const uniqueBatch = orderedBatch.filter(
            (m) => !existingIds.has(m.id)
          );
          this.messages = [...uniqueBatch, ...this.messages];
          this.messagePage = pageToFetch;
        }

        const total = res.meta?.total || 0;
        this.hasMoreMessages = this.messages.length < total;

        // ⭐ FIXED: Join the support chat room after loading
        if (this.activeChatId) {
          socket.emit("joinRoom", `support_chat_${this.activeChatId}`);
          console.log(`Joined support_chat_${this.activeChatId}`);
        }
      } catch (err) {
        console.error("fetchUserChat error:", err);
      } finally {
        this.loadingMessages = false;
      }
    },

    /**
     * ⭐ FIXED: Added proper notification refresh after marking as read
     */
    markMessagesAsRead(messageIds) {
      if (!this.activeChatId && this.messages.length > 0) {
        this.activeChatId = this.messages[0].support_chat_id;
      }

      if (!this.activeChatId || !messageIds || messageIds.length === 0) return;

      socket.emit("readSupportMessages", {
        chatId: this.activeChatId,
        messageIds: messageIds,
      });

      // Optimistic local update
      this.messages.forEach((msg) => {
        if (messageIds.includes(msg.id)) {
          msg.is_read = true;
        }
      });

      // ⭐ FIXED: Refresh notification count after marking as read
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      socket.emit(
        "countUnreadMessages",
        { userId: authStore.getUser?.id },
        (response) => {
          if (response?.success) {
            notificationStore.supportChatCount = response.count;
          }
        }
      );
    },

    /**
     * ⭐ FIXED: Added notification count refresh after sending
     * Send text message
     */
    async sendCustomerMessage(text) {
      if (!text) return;
      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const currentUser = authStore.getUser;
      if (!currentUser?.id) throw new Error("User not authenticated");

      socket.emit("sendSupportMessage", {
        userId: currentUser.id,
        message: {
          type: "text",
          message: text,
          sender_id: currentUser.id,
          is_admin: false,
        },
      });

      // ⭐ FIXED: Refresh notification count after sending (admins may have replied)
      setTimeout(() => {
        socket.emit(
          "countUnreadMessages",
          { userId: currentUser.id },
          (response) => {
            if (response?.success) {
              notificationStore.supportChatCount = response.count;
            }
          }
        );
      }, 500);
    },

    /**
     * Send media message (image, audio, or file)
     */
    async sendMediaMessage(file, type) {
      try {
        const authStore = useAuthStore();
        const notificationStore = useNotificationStore();
        const currentUser = authStore.getUser;
        if (!currentUser?.id) throw new Error("User not authenticated");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type || "file");
        formData.append("userId", currentUser.id);

        const res = await requestService.create(
          `/support-chats/media`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        
        this.addMessage(res?.data);

        // Refresh notification count
        socket.emit(
          "countUnreadMessages",
          { userId: currentUser.id },
          (response) => {
            if (response?.success) {
              notificationStore.supportChatCount = response.count;
            }
          }
        );
      } catch (err) {
        console.error("sendMediaMessage error:", err);
      }
    },

    /**
     * ⭐ FIXED: Better room joining and reconnection handling
     * Socket listener for real-time updates
     */
    listenForMessages() {
      if (this._listening) return;
      this._listening = true;

      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const currentUser = authStore.getUser;
      if (!currentUser?.id) return;

      // Join personal room
      socket.emit("joinRoom", `user_${currentUser.id}`);
      console.log(`Joined personal room: user_${currentUser.id}`);

      // Listen for send success
      socket.on("sendSupportMessage:success", (data) => {
        console.log("Message sent successfully:", data);
        this.addMessage(data?.message);

        // Refresh count
        socket.emit(
          "countUnreadMessages",
          { userId: currentUser.id },
          (response) => {
            if (response?.success) {
              notificationStore.supportChatCount = response.count;
            }
          }
        );
      });

      // Listen for new messages
      socket.on("newSupportMessage", (msg) => {
        console.log("Received new support message:", msg);
        this.addMessage(msg);

        // If message is from admin, refresh notification count
        if (msg.is_admin) {
          socket.emit(
            "countUnreadMessages",
            { userId: currentUser.id },
            (response) => {
              if (response?.success) {
                notificationStore.supportChatCount = response.count;
              }
            }
          );
        }
      });

      // Listen for read receipts
      socket.on("supportMessagesRead", ({ chatId, messageIds }) => {
        if (this.activeChatId === chatId) {
          this.messages.forEach((msg) => {
            if (messageIds.includes(msg.id)) {
              msg.is_read = true;
            }
          });
        }
      });

      // ⭐ FIXED: Handle reconnection - rejoin rooms
      window.addEventListener("socket-reconnected", () => {
        console.log("Socket reconnected - rejoining rooms");
        socket.emit("joinRoom", `user_${currentUser.id}`);
        if (this.activeChatId) {
          socket.emit("joinRoom", `support_chat_${this.activeChatId}`);
        }
      });
    },

    /**
     * ⭐ FIXED: Better duplicate handling and message updates
     * Add message locally (keeps chronological order)
     */
    addMessage(msg) {
      if (!msg) return;
      
      const existingIndex = this.messages.findIndex((m) => m.id === msg.id);
      
      if (existingIndex === -1) {
        // New message - add it
        this.messages.push(msg);
        this.messages.sort((a, b) => new Date(a.created) - new Date(b.created));
      } else {
        // Update existing message (for read status updates)
        this.messages[existingIndex] = {
          ...this.messages[existingIndex],
          ...msg,
        };
      }
    },
  },
});