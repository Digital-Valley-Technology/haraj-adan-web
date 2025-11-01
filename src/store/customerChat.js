import { defineStore } from "pinia";
import requestService from "../services/api/requestService";
import { socket } from "../services/SocketPlugin";
import { useAuthStore } from "./auth";

export const useCustomerChatStore = defineStore("customerChat", {
  state: () => ({
    messages: [],
    loadingMessages: false,
    messagePage: 1,
    messageLimit: 20,
    hasMoreMessages: true,
    _listening: false,
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
      if (this._listening) return;
      this._listening = true;

      const authStore = useAuthStore();
      const currentUser = authStore.getUser;
      if (!currentUser?.id) return;

      socket.emit("joinRoom", `support_user_${currentUser.id}`);

      socket.on("sendSupportMessage:success", (data) => {
        this.addMessage(data?.message);
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
