import { defineStore } from "pinia";
import { watch } from "vue";
import requestService from "../services/api/requestService";
import { socket } from "../services/SocketPlugin";
import { useAuthStore } from "./auth";

export const useChatStore = defineStore("chats", {
  state: () => ({
    chats: [],
    page: 1,
    limit: 10,
    total: 0,
    loadingChats: false,
    hasMoreChats: true,
    search: "",
    filterBy: null,

    activeChatId: null,
    activeChat: null,

    messagePage: 0,
    messageLimit: 20,
    messageTotal: 0,
    loadingMessages: false,
    hasMoreMessages: true,

    onlineUsers: [], // list of online userIds

    // ⭐ NEW: Admin notification count
    unreadAdminCount: 0,

    _listening: false,
  }),

  getters: {
    getChats: (state) => state.chats,
    isUserOnline: (state) => (userId) => state.onlineUsers.includes(userId),
  },

  actions: {
    addMessageToChat(msg) {
      if (!msg?.support_chat_id) return;

      if (this.activeChat && this.activeChat.id === msg.support_chat_id) {
        const exists = this.activeChat.messages.find((m) => m.id === msg.id);
        if (!exists) this.activeChat.messages.push(msg);
      }

      const idx = this.chats.findIndex((c) => c.id === msg.support_chat_id);
      if (idx !== -1) this.chats[idx].lastMessage = msg;
      else
        this.chats.unshift({
          id: msg.support_chat_id,
          users: msg.users ?? null,
          lastMessage: msg,
          _count: {},
        });
    },

    async fetchChats({ append = false } = {}) {
      if (this.loadingChats) return;
      this.loadingChats = true;
      try {
        const pageToFetch = append ? this.page + 1 : 1;
        const query = new URLSearchParams({
          page: String(pageToFetch),
          limit: String(this.limit),
        });
        if (this.search) {
          query.append("search", this.search);
          if (this.filterBy) query.append("filterBy", this.filterBy);
        }

        const response = await requestService.getAll(
          `/support-chats/paginate?${query.toString()}`
        );
        const payload = response?.data ?? {};
        const items = Array.isArray(payload) ? payload : payload?.data ?? [];

        const normalized = items.map((chat) => ({
          id: chat.id,
          users: chat.users ?? null,
          lastMessage: chat.support_chat_messages?.[0] ?? null,
          _count: chat._count ?? {},
          raw: chat,
        }));

        if (append) this.chats = [...this.chats, ...normalized];
        else this.chats = normalized;

        this.total = payload?.meta?.total ?? this.chats.length;
        this.page = payload?.meta?.page ?? pageToFetch;
        this.hasMoreChats = this.chats.length < this.total;
      } catch (err) {
        console.error("fetchChats error:", err);
      } finally {
        this.loadingChats = false;
      }
    },

    setActiveChat(chatId) {
      this.activeChatId = chatId;
      const found = this.chats.find((c) => c.id === chatId);
      this.activeChat = found
        ? {
            id: found.id,
            users: found.users,
            messages: [],
            _count: found._count,
          }
        : { id: chatId, users: null, messages: [], _count: {} };
      this.messagePage = 0;
      this.messageTotal = 0;
      this.hasMoreMessages = true;
      this.loadingMessages = false;

      // ⭐ FIXED: Join the chat room when setting active
      socket.emit("joinRoom", `support_chat_${chatId}`);
    },

    /**
     * ⭐ FIXED: Messages are now correctly ordered
     * Backend returns DESC, we reverse to ASC for display
     */
    async fetchMessages(chatId, { prepend = false } = {}) {
      if (!chatId || this.loadingMessages) return null;
      this.loadingMessages = true;
      try {
        const response = await requestService.getAll(
          `/support-chats/${chatId}?page=${this.messagePage + 1}&limit=${
            this.messageLimit
          }`
        );
        const chatData = response?.data ?? {};

        // Backend returns messages in DESC order (newest first)
        let batch = Array.isArray(chatData.support_chat_messages)
          ? chatData.support_chat_messages
          : [];

        // ⭐ FIXED: Reverse to get chronological order (oldest first)
        batch = batch.reverse();

        if (!prepend) {
          // Initial load
          this.activeChat = {
            ...(this.activeChat || {}),
            id: chatData.id,
            users: chatData.users ?? this.activeChat?.users,
            messages: batch,
            _count: chatData._count ?? this.activeChat?._count,
          };
          this.messagePage = 1;
          this.hasMoreMessages = batch.length === this.messageLimit;
        } else {
          // Load older messages - prepend them
          this.activeChat.messages = [
            ...batch,
            ...(this.activeChat.messages || []),
          ];
          this.messagePage += 1;
          if (batch.length < this.messageLimit) this.hasMoreMessages = false;
        }

        this.messageTotal = this.activeChat.messages.length;
        return response.data;
      } catch (err) {
        console.error("fetchMessages error:", err);
        return null;
      } finally {
        this.loadingMessages = false;
      }
    },

    async sendSupportMessage(userId, text) {
      if (!userId || !this.activeChatId) return null;
      const authStore = useAuthStore();
      const currentUser = authStore.getUser;
      if (!currentUser?.id) throw new Error("User not authenticated");

      socket.emit("sendSupportMessage", {
        userId,
        message: {
          type: "text",
          message: text,
          sender_id: currentUser.id,
          is_admin: true,
        },
      });
    },

    async sendMediaMessage(file, type) {
      try {
        const authStore = useAuthStore();
        const currentUser = authStore.getUser;
        if (!currentUser?.id) throw new Error("User not authenticated");

        const formData = new FormData();
        formData.append("file", file);
        if (this.activeChatId)
          formData.append("chatId", String(this.activeChatId));
        formData.append("type", type || "file");
        formData.append("userId", currentUser.id);
        formData.append("is_admin", 1);

        await requestService.create(`/support-chats/media`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return true;
      } catch (err) {
        console.error("sendMediaMessage error:", err);
        return null;
      }
    },

    async resetAndFetchChats() {
      console.log("resetting");
    },

    markMessagesAsReadSocket(chatId) {
      if (!chatId || !this.activeChat) return;
      const authStore = useAuthStore();
      const currentUserId = authStore.getUser?.id;

      const unreadMessages = this.activeChat.messages.filter(
        (msg) => !msg.is_read && msg.sender_id !== currentUserId
      );
      if (!unreadMessages.length) return;

      unreadMessages.forEach((msg) => (msg.is_read = true));

      socket.emit("readSupportMessages", {
        chatId,
        messageIds: unreadMessages.map((m) => m.id),
      });

      // ⭐ FIXED: Refresh admin notification count after marking as read
      this.fetchUnreadCount();
    },

    /**
     * ⭐ NEW: Fetch unread count for admin
     */
    async fetchUnreadCount() {
      socket.emit("countUnreadAdminMessages", {}, (response) => {
        if (response?.success) {
          this.unreadAdminCount = response.count;
        }
      });
    },

    /**
     * ⭐ FIXED: Better notification handling and reconnection support
     */
    listenForMessages(isAdmin = false) {
      if (this._listening) return;
      this._listening = true;

      // Join rooms based on active chat
      watch(
        () => this.activeChatId,
        (chatId) => {
          if (!chatId) return;
          socket.emit("joinRoom", `support_chat_${chatId}`);
          console.log(`Joined support_chat_${chatId}`);
        },
        { immediate: true }
      );

      // Admin joins admin room
      if (isAdmin) {
        socket.emit("joinRoom", "admins");
        console.log("Joined admins room");

        // ⭐ NEW: Fetch initial admin unread count
        this.fetchUnreadCount();
      }

      // Listen for new messages
      socket.on("newSupportMessage", (msg) => {
        console.log("New support message:", msg);

        if (isAdmin || msg.support_chat_id === this.activeChatId) {
          this.addMessageToChat(msg);
        }

        // ⭐ FIXED: Update admin notification count
        if (isAdmin && !msg.is_admin) {
          this.unreadAdminCount++;
        }
      });

      // Listen for read receipts
      socket.on("supportMessagesRead", ({ chatId, messageIds }) => {
        if (!this.activeChat || this.activeChat.id !== chatId) return;
        this.activeChat.messages.forEach((msg) => {
          if (messageIds.includes(msg.id)) msg.is_read = true;
        });
      });

      // Listen for online users
      socket.on("userOnline", ({ userId }) => {
        if (!this.onlineUsers.includes(userId)) this.onlineUsers.push(userId);
      });

      socket.on("userOffline", ({ userId }) => {
        this.onlineUsers = this.onlineUsers.filter((id) => id !== userId);
      });

      // ⭐ FIXED: Handle reconnection
      window.addEventListener("socket-reconnected", () => {
        console.log("Socket reconnected - rejoining admin rooms");
        if (isAdmin) {
          socket.emit("joinRoom", "admins");
        }
        if (this.activeChatId) {
          socket.emit("joinRoom", `support_chat_${this.activeChatId}`);
        }
      });
    },
  },
});
