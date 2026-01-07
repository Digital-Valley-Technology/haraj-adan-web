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
      } catch (err) {
        console.error("fetchUserChat error:", err);
      } finally {
        this.loadingMessages = false;
      }
    },

    markMessagesAsRead(messageIds) {
      // نتأكد أن لدينا معرف المحادثة ورسائل لقراءتها
      if (!this.activeChatId && this.messages.length > 0) {
        this.activeChatId = this.messages[0].support_chat_id;
      }

      if (!this.activeChatId || !messageIds || messageIds.length === 0) return;

      socket.emit("readSupportMessages", {
        chatId: this.activeChatId,
        messageIds: messageIds,
      });

      // تحديث محلي فوري (Optimistic Update)
      this.messages.forEach((msg) => {
        if (messageIds.includes(msg.id)) {
          msg.is_read = true;
        }
      });
    },

    /**
     * Send text message
     */
    async sendCustomerMessage(text) {
      if (!text) return;
      const authStore = useAuthStore();
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
    },

    /**
     * Send media message (image, audio, or file)
     */
    async sendMediaMessage(file, type) {
      try {
        const authStore = useAuthStore();
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
      } catch (err) {
        console.error("sendMediaMessage error:", err);
      }
    },

    /**
     * Socket listener for real-time updates
     */
    listenForMessages() {
      console.log("joining ");

      if (this._listening) return;
      this._listening = true;

      const authStore = useAuthStore();
      const currentUser = authStore.getUser;
      if (!currentUser?.id) return;

      socket.emit("joinRoom", `support_user_${currentUser.id}`);

      socket.on("sendSupportMessage:success", (data) => {
        console.log("message sent:", data);
        this.addMessage(data?.message);

        const notificationStore = useNotificationStore();
        socket.emit(
          "countUnreadMessages",
          { userId: currentUser.id },
          (data) => {
            notificationStore.supportChatCount = data?.count ?? 0;
          }
        );
      });

      socket.on("newSupportMessage", (msg) => {
        console.log("recieved message", msg);

        this.addMessage(msg);
      });
      socket.on("supportMessagesRead", ({ chatId, messageIds }) => {
        // إذا كان الحدث يخص محادثتي الحالية
        if (this.activeChatId === chatId) {
          this.messages.forEach((msg) => {
            if (messageIds.includes(msg.id)) {
              msg.is_read = true;
            }
          });
        }
      });
    },

    /**
     * Add message locally (keeps chronological order)
     */
    addMessage(msg) {
      const exists = this.messages.find((m) => m.id === msg.id);
      if (!exists) {
        this.messages.push(msg);
        this.messages.sort((a, b) => new Date(a.created) - new Date(b.created));
      }
    },
  },
});
