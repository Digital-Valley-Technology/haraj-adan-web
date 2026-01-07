import { defineStore } from "pinia";
import { watch } from "vue";
import requestService from "../services/api/requestService";
import { socket } from "../services/SocketPlugin";
import { useAuthStore } from "./auth";
import { useNotificationStore } from "./notifications";

export const useUserChatsStore = defineStore("userChats", {
  state: () => ({
    // Chat list
    chats: [],
    page: 1,
    limit: 10,
    total: 0,
    loadingChats: false,
    hasMoreChats: true,
    search: "",

    // Active chat
    activeChatId: null,
    activeChat: null,

    // Messages
    messagePage: 0,
    messageLimit: 20,
    messageTotal: 0,
    loadingMessages: false,
    hasMoreMessages: true,

    // Online users
    onlineUsers: [],

    _listening: false,
  }),

  getters: {
    getChats: (state) => state.chats,
    isUserOnline: (state) => (userId) => state.onlineUsers.includes(userId),

    // Get the other user in the active chat
    getOtherUser: (state) => {
      if (!state.activeChat?.members) return null;
      const authStore = useAuthStore();
      const currentUserId = authStore.user?.id;
      return state.activeChat.members.find(
        (member) => member.users?.id !== currentUserId
      )?.users;
    },
  },

  actions: {
    /**
     * 🌟 Fetch paginated chat list for current user
     * Used by: ChatPage.vue
     */
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
        }

        const response = await requestService.getAll(
          `/chats/customer/paginate?${query.toString()}`
        );

        const payload = response?.data ?? {};
        const items = Array.isArray(payload) ? payload : payload?.data ?? [];

        // Normalize the data
        const normalized = items.map((chat) => ({
          id: chat.id,
          members: chat.members ?? [],
          lastMessage: chat.lastMessage ?? null,
          unreadCount: chat.unreadCount ?? 0,
          created: chat.created,
          raw: chat,
        }));

        if (append) {
          this.chats = [...this.chats, ...normalized];
        } else {
          this.chats = normalized;
        }

        this.total = payload?.meta?.total ?? this.chats.length;
        this.page = payload?.meta?.page ?? pageToFetch;
        this.hasMoreChats = this.chats.length < this.total;

        console.log("📋 [USER-CHAT] Fetched chats:", this.chats.length);
      } catch (err) {
        console.error("❌ [USER-CHAT] fetchChats error:", err);
      } finally {
        this.loadingChats = false;
      }
    },

    /**
     * 🌟 Get or create chat with specific user
     * Used by: ProfilePage.vue
     * @param {number} otherUserId - The other user's ID
     * @returns {Object|null} The chat object or null
     */
    async getChatWithUser(otherUserId) {
      console.log("🔍 [USER-CHAT] Getting chat with user:", otherUserId);

      // First check if chat exists in current list
      const existingChat = this.chats.find((chat) =>
        chat.members.some((m) => m.users?.id === otherUserId)
      );

      if (existingChat) {
        console.log("✅ [USER-CHAT] Found existing chat:", existingChat.id);
        await this.setActiveChat(existingChat.id);
        return existingChat;
      }

      // If not in current list, fetch all chats and search
      console.log("🔄 [USER-CHAT] Chat not in list, fetching all chats...");
      await this.fetchChats();

      const chat = this.chats.find((c) =>
        c.members.some((m) => m.users?.id === otherUserId)
      );

      if (chat) {
        console.log("✅ [USER-CHAT] Found chat after refresh:", chat.id);
        await this.setActiveChat(chat.id);
        return chat;
      }

      console.log(
        "ℹ️ [USER-CHAT] No existing chat, will be created on first message"
      );

      // Prepare a temporary active chat structure for new conversations
      this.activeChat = {
        id: null, // Will be set when first message is sent
        members: [],
        messages: [],
        unreadCount: 0,
        otherUserId: otherUserId, // Store for sending first message
      };

      return null;
    },

    /**
     * Set active chat and load messages
     */
    async setActiveChat(chatId) {
      console.log("💬 [USER-CHAT] Setting active chat:", chatId);

      this.activeChatId = chatId;
      const found = this.chats.find((c) => c.id === chatId);

      if (found) {
        this.activeChat = {
          id: found.id,
          members: found.members,
          messages: [],
          unreadCount: found.unreadCount,
        };
      } else {
        this.activeChat = {
          id: chatId,
          members: [],
          messages: [],
          unreadCount: 0,
        };
      }

      this.messagePage = 0;
      this.messageTotal = 0;
      this.hasMoreMessages = true;
      this.loadingMessages = false;

      // Join the chat room
      socket.emit("joinUserRoom", chatId);
      console.log("🚪 [USER-CHAT] Joined room: user_chat_" + chatId);

      // Load initial messages
      await this.fetchMessages(chatId);
    },

    /**
     * Fetch messages for a specific chat
     */
    async fetchMessages(chatId, { prepend = false } = {}) {
      if (!chatId || this.loadingMessages) return null;

      console.log(
        "📨 [USER-CHAT] Fetching messages for chat:",
        chatId,
        "page:",
        this.messagePage + 1
      );

      this.loadingMessages = true;

      try {
        const response = await requestService.getAll(
          `/chats/messages?chatId=${chatId}&page=${
            this.messagePage + 1
          }&limit=${this.messageLimit}`
        );

        const chatData = response?.data ?? {};
        let batch = Array.isArray(chatData.data) ? chatData.data : [];

        console.log("📨 [USER-CHAT] Received messages:", batch.length);

        // Backend returns DESC, reverse to ASC for display
        batch = batch.reverse();

        if (!prepend) {
          // Initial load
          this.activeChat.messages = batch;
          this.messagePage = 1;
          this.hasMoreMessages = batch.length === this.messageLimit;
        } else {
          // Load older messages
          this.activeChat.messages = [...batch, ...this.activeChat.messages];
          this.messagePage += 1;
          if (batch.length < this.messageLimit) {
            this.hasMoreMessages = false;
          }
        }

        this.messageTotal =
          chatData.meta?.total ?? this.activeChat.messages.length;

        return response.data;
      } catch (err) {
        console.error("❌ [USER-CHAT] fetchMessages error:", err);
        return null;
      } finally {
        this.loadingMessages = false;
      }
    },

    /**
     * Send text message via Socket
     */
    async sendMessage(receiverId, text) {
      if (!receiverId || !text) return;

      const authStore = useAuthStore();
      const currentUser = authStore.getUser;
      if (!currentUser?.id) {
        console.error("❌ [USER-CHAT] User not authenticated");
        return;
      }

      console.log("📤 [USER-CHAT] Sending message to user:", receiverId);

      // Add optimistic message to UI
      const tempMessage = {
        id: Date.now() * -1, // Temporary negative ID
        chat_id: this.activeChatId,
        sender_id: currentUser.id,
        message: text,
        type: "text",
        is_read: false,
        created: new Date().toISOString(),
      };

      if (this.activeChat) {
        this.activeChat.messages.push(tempMessage);
      }

      socket.emit("sendUserMessage", {
        senderId: currentUser.id,
        receiverId: receiverId,
        message: text,
        type: "text",
      });
    },

    /**
     * Send media message via HTTP
     */
    async sendMediaMessage(receiverId, file, type) {
      try {
        const authStore = useAuthStore();
        const currentUser = authStore.getUser;
        if (!currentUser?.id) throw new Error("User not authenticated");

        console.log("📤 [USER-CHAT] Sending media message");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("senderId", currentUser.id);
        formData.append("receiverId", receiverId);

        const response = await requestService.create(`/chats/media`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ [USER-CHAT] Media message sent");

        // The newUserMessage event will handle adding it to the UI
        return true;
      } catch (err) {
        console.error("❌ [USER-CHAT] sendMediaMessage error:", err);
        return false;
      }
    },

    /**
     * Mark messages as read
     */
    markMessagesAsRead(chatId) {
      if (!chatId || !this.activeChat) return;

      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();
      const currentUserId = authStore.getUser?.id;

      // Find unread messages from other users
      const unreadMessages = this.activeChat.messages.filter(
        (msg) => !msg.is_read && msg.sender_id !== currentUserId
      );

      if (!unreadMessages.length) {
        console.log("📭 [USER-CHAT] No unread messages to mark");
        return;
      }

      console.log(
        "✅ [USER-CHAT] Marking",
        unreadMessages.length,
        "messages as read"
      );

      // Optimistic update
      unreadMessages.forEach((msg) => {
        msg.is_read = true;
      });

      // Update unread count in chat list
      const chatIndex = this.chats.findIndex((c) => c.id === chatId);
      if (chatIndex !== -1) {
        this.chats[chatIndex].unreadCount = 0;
      }

      // Emit to server
      socket.emit("readUserMessages", {
        chatId: chatId,
        messageIds: unreadMessages.map((m) => m.id),
        readerId: currentUserId,
      });

      // Refresh notification count
      setTimeout(() => {
        notificationStore.refreshCounts();
      }, 500);
    },

    /**
     * Add message to active chat
     */
    addMessageToChat(msg) {
      console.log("➕ [USER-CHAT] Adding message to chat:", msg);

      // Remove optimistic message if this is the real one
      if (this.activeChat && msg.id > 0) {
        this.activeChat.messages = this.activeChat.messages.filter(
          (m) => m.id >= 0
        );
      }

      // Add to active chat if it's the right one
      if (this.activeChat && this.activeChat.id === msg.chat_id) {
        const exists = this.activeChat.messages.find((m) => m.id === msg.id);
        if (!exists) {
          this.activeChat.messages.push(msg);
          console.log("✅ [USER-CHAT] Message added to active chat");
        }
      }

      // Update activeChatId if it was null (new conversation)
      if (!this.activeChatId && msg.chat_id) {
        this.activeChatId = msg.chat_id;
        if (this.activeChat) {
          this.activeChat.id = msg.chat_id;
        }
      }

      // Update last message in chat list
      const chatIndex = this.chats.findIndex((c) => c.id === msg.chat_id);
      if (chatIndex !== -1) {
        this.chats[chatIndex].lastMessage = msg;

        // Increase unread count if not in this chat and message is from other user
        const authStore = useAuthStore();
        if (
          msg.sender_id !== authStore.user?.id &&
          this.activeChatId !== msg.chat_id
        ) {
          this.chats[chatIndex].unreadCount =
            (this.chats[chatIndex].unreadCount || 0) + 1;
        }

        console.log("✅ [USER-CHAT] Chat list updated");
      } else {
        // New chat, refresh list
        console.log("🔄 [USER-CHAT] New chat detected, refreshing list");
        this.fetchChats();
      }
    },

    /**
     * Initialize socket listeners for user-to-user chat
     */
    listenForMessages() {
      if (this._listening) {
        console.log("⚠️ [USER-CHAT] Already listening");
        return;
      }

      console.log("👂 [USER-CHAT] Setting up message listeners");
      this._listening = true;

      const authStore = useAuthStore();
      const notificationStore = useNotificationStore();

      // Watch active chat to join/leave rooms
      watch(
        () => this.activeChatId,
        (newChatId, oldChatId) => {
          if (oldChatId) {
            // Leave old room
            socket.emit("leaveRoom", `user_chat_${oldChatId}`);
            console.log("🚪 [USER-CHAT] Left room: user_chat_" + oldChatId);
          }
          if (newChatId) {
            // Join new room
            socket.emit("joinUserRoom", newChatId);
            console.log("🚪 [USER-CHAT] Joined room: user_chat_" + newChatId);
          }
        }
      );

      // Listen for new messages
      socket.on("newUserMessage", (msg) => {
        console.log("📩 [USER-CHAT] New message received:", msg);
        this.addMessageToChat(msg);

        // If message is not from current user, increment notification count
        if (msg.sender_id !== authStore.user?.id) {
          notificationStore.userChatCount++;
          console.log("🔔 [USER-CHAT] Notification count increased");
        }
      });

      // Listen for read receipts
      socket.on("userMessagesRead", ({ chatId, messageIds, readerId }) => {
        console.log(
          "✅ [USER-CHAT] Messages marked as read:",
          messageIds.length
        );

        if (!this.activeChat || this.activeChat.id !== chatId) return;

        this.activeChat.messages.forEach((msg) => {
          if (messageIds.includes(msg.id)) {
            msg.is_read = true;
          }
        });
      });

      // Listen for online status
      socket.on("userOnline", ({ userId }) => {
        if (!this.onlineUsers.includes(userId)) {
          this.onlineUsers.push(userId);
          console.log("🟢 [USER-CHAT] User online:", userId);
        }
      });

      socket.on("userOffline", ({ userId }) => {
        this.onlineUsers = this.onlineUsers.filter((id) => id !== userId);
        console.log("⚫ [USER-CHAT] User offline:", userId);
      });

      // Handle socket reconnection
      window.addEventListener("socket-reconnected", () => {
        console.log("🔄 [USER-CHAT] Socket reconnected, rejoining rooms");
        if (this.activeChatId) {
          socket.emit("joinUserRoom", this.activeChatId);
        }
      });

      console.log("✅ [USER-CHAT] Message listeners ready");
    },

    /**
     * Reset store (on logout)
     */
    reset() {
      console.log("🔄 [USER-CHAT] Resetting store");
      this.chats = [];
      this.activeChatId = null;
      this.activeChat = null;
      this.onlineUsers = [];
      this._listening = false;
    },
  },
});
