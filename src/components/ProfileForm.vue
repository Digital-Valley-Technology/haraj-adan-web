<template>
  <div class="flex-1 bg-white rounded-xl shadow-md p-6">
    <!-- User Header -->
    <div class="flex flex-col items-center">
      <img
        src="https://via.placeholder.com/100"
        alt="avatar"
        class="w-24 h-24 rounded-full object-cover"
      />
      <h2 class="mt-2 font-semibold">User name</h2>
      <p class="text-gray-500 text-sm">gmail@gmail.com</p>
    </div>

    <!-- User Information -->
    <div class="mt-6">
      <h3 class="font-bold mb-2">User information</h3>
      <input
        type="text"
        v-model="form.name"
        placeholder="Your Name"
        class="w-full border rounded-md p-2 mb-3"
      />
      <input
        type="email"
        v-model="form.email"
        placeholder="your@email.com"
        class="w-full border rounded-md p-2 mb-6"
      />

      <!-- Reset Password -->
      <h3 class="font-bold mb-2">Reset password</h3>
      <input
        type="password"
        v-model="form.oldPassword"
        placeholder="Old Password"
        class="w-full border rounded-md p-2 mb-3"
      />
      <input
        type="password"
        v-model="form.newPassword"
        placeholder="New Password"
        class="w-full border rounded-md p-2 mb-3"
      />
      <input
        type="password"
        v-model="form.confirmPassword"
        placeholder="Confirm new password"
        class="w-full border rounded-md p-2 mb-6"
      />

      <button class="w-full bg-yellow-400 py-2 rounded-md font-bold">
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({
  name: "",
  email: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
</script>
