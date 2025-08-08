<template>
  <button
    v-bind="$attrs"
    class="cursor-pointer"
    :class="buttonClasses"
    @click="handleClick"
    :disabled="disabled"
  >
    <i v-if="icon" :class="iconClass"></i>
    <span
      ><slot>{{ label }}</slot></span
    >
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "", // e.g. "pi pi-plus"
    },
    buttonClasses: {
      type: [String, Array, Object],
      default: () =>
        "bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded flex items-center space-x-2 transition",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onClick: {
      type: Function,
      default: null,
    },
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && this.onClick) this.onClick(event);
    },
  },
  computed: {
    iconClass() {
      return [this.icon, "text-sm me-2"];
    },
  },
};
</script>
