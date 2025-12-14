// src/store/adminMonitorStore.js - CORRECTED

import { defineStore } from "pinia";
import { watch } from "vue";
import requestService from "../services/api/requestService";
import { socket } from "../services/SocketPlugin";
import { useAuthStore } from "./auth";

export const useAdminMonitorStore = defineStore("adminMonitorChats", {
  state: () => ({
    // Chat List State
    chats: [],
    page: 1,
    limit: 10,
    total: 0,
    loadingChats: false,
    hasMoreChats: true,
    search: "",

    // Active Chat State
    activeChatId: null,
    activeChat: null,

    // Message Pagination State
    messagePage: 0,
    messageLimit: 20,
    loadingMessages: false,
    hasMoreMessages: true,

    onlineUsers: [],

    _listening: false,
  }),

  getters: {
    getChats: (state) => state.chats,
    isUserOnline: (state) => (userId) => state.onlineUsers.includes(userId),

    /**
     * CORRECTED: Extracts the combined names of participants directly from the member objects.
     */
    getChatMembersNames: (state) => (chat) => {
      // API response structure: chat.members is array of {id, name, email, ...}
      const names =
        chat?.members?.map((p) => p.name).filter((name) => name) || [];
      return names.join(" & ");
    },
  },

  actions: {
    addMessageToChat(msg) {
      if (!msg?.chat_id) return;

      // 1. Update active chat messages
      if (this.activeChat && this.activeChat.id === msg.chat_id) {
        const exists = this.activeChat.messages.find((m) => m.id === msg.id);
        if (!exists) this.activeChat.messages.push(msg);
      }

      // 2. Update last message in the chat list (and reorder)
      const idx = this.chats.findIndex((c) => c.id === msg.chat_id);

      if (idx !== -1) {
        this.chats[idx].lastMessage = msg;
        const [chat] = this.chats.splice(idx, 1);
        this.chats.unshift(chat);
      } else {
        this.fetchChats();
      }
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
        }

        const response = await requestService.getAll(
          `/chats/paginate/admin?${query.toString()}`
        );
        const fullPayload = response?.data ?? {}; // Extract the chat array (assuming it's nested under 'data' or is the root array)

        // Since you logged fullPayload and it showed an array, let's trust the array extraction:
        const items = Array.isArray(fullPayload)
          ? fullPayload
          : fullPayload.data || []; // --- Use $patch to update state properties efficiently ---

        this.$patch((state) => {
          if (append) {
            state.chats = [...state.chats, ...items];
          } else {
            state.chats = items;
          }
          // If API returns meta, use it. Otherwise, assume total equals list length.
          state.total = fullPayload?.meta?.total ?? state.chats.length;
          state.page = fullPayload?.meta?.page ?? pageToFetch;
          state.hasMoreChats = state.chats.length < state.total;
          state.loadingChats = false;
        });

        // >>> REMOVED AUTO-OPEN CHAT LOGIC HERE <<<
      } catch (err) {
        console.error("fetchAdminChats error:", err);
        this.loadingChats = false;
      }
    },

    setActiveChat(chatId) {
      this.activeChatId = chatId;
      const found = this.chats.find((c) => c.id === chatId);

      const participantBId = found?.members?.[1]?.id; // Participant B (Default Right/Reference)

      this.activeChat = found
        ? {
            id: found.id,
            members: found.members,
            messages: [],
            // CORRECTED: Use getter for display name
            names: this.getChatMembersNames(found),
            rightSideUserId: participantBId,
          }
        : {
            id: chatId,
            members: [],
            messages: [],
            names: "Unknown Chat",
            rightSideUserId: participantBId,
          };

      this.messagePage = 0;
      this.loadingMessages = false;
      this.hasMoreMessages = true;
    },

    async fetchMessages(chatId, { prepend = false } = {}) {
      if (!chatId || this.loadingMessages) return null;
      this.loadingMessages = true;
      try {
        const response = await requestService.getAll(
          `/chats/admin/${chatId}/messages?page=${this.messagePage + 1}&limit=${
            this.messageLimit
          }`
        );

        const chatData = response?.data ?? {};

        const batch = Array.isArray(chatData) ? chatData : [];

        if (!prepend) {
          this.activeChat = {
            ...(this.activeChat || {}),
            id: chatData.meta?.chatId ?? chatId,
            messages: batch,
          };
          this.messagePage = 1;
          this.hasMoreMessages = batch.length === this.messageLimit;
        } else {
          this.activeChat.messages = [
            ...batch.reverse(),
            ...(this.activeChat.messages || []),
          ];
          this.messagePage += 1;
          if (batch.length < this.messageLimit) this.hasMoreMessages = false;
        }

        return response.data;
      } catch (err) {
        console.error("fetchAdminMessages error:", err);
        return null;
      } finally {
        this.loadingMessages = false;
      }
    },

    async resetAndFetchChats() {
      this.page = 1;
      this.chats = [];
      this.hasMoreChats = true;
      await this.fetchChats();
    },

    markMessagesAsReadSocket() {
      // Read-only. Do nothing.
    },

    listenForMessages() {
      if (this._listening) return;
      this._listening = true;

      socket.emit("joinRoom", "admins");

      watch(
        () => this.activeChatId,
        (chatId, oldChatId) => {
          if (oldChatId) socket.emit("leaveRoom", `chats_${oldChatId}`);
          if (chatId) socket.emit("joinRoom", `chats_${chatId}`);
        },
        { immediate: true }
      );

      socket.on("newChatMessage", (msg) => {
        this.addMessageToChat(msg);
      });

      socket.on("messagesRead", ({ chatId, messageIds }) => {
        if (!this.activeChat || this.activeChat.id !== chatId) return;

        this.activeChat.messages.forEach((msg) => {
          if (messageIds.includes(msg.id)) msg.is_read = true;
        });
      });

      socket.on("userOnline", ({ userId }) => {
        if (!this.onlineUsers.includes(userId)) this.onlineUsers.push(userId);
      });
      socket.on("userOffline", ({ userId }) => {
        this.onlineUsers = this.onlineUsers.filter((id) => id !== userId);
      });
    },
  },
});
