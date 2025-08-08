<script setup>
import { useUsersStore } from "../../store/user";
import { useI18n } from "vue-i18n";

defineProps(["users"]);
const emit = defineEmits(["delete", "fetchUsers", "toggleBan"]);

const { t, locale } = useI18n();
const userStore = useUsersStore();

const NOT_PROVIDED = {
  text: t("dashboard.users.not_provided"),
  isPlaceholder: true,
};

const handleToggleBan = (user) => emit("toggleBan", user);

const getToggleButtonInfo = (isActive) => {
  if (isActive) {
    return {
      label: t("dashboard.users.actions.ban"),
      icon: "pi pi-lock",
      severity: "warn",
    };
  } else {
    return {
      label: t("dashboard.users.actions.activate"),
      icon: "pi pi-unlock",
      severity: "success",
    };
  }
};

const getStatusInfo = (isActive) => {
  if (isActive) {
    return {
      label: t("dashboard.users.status.active"),
      classes: "bg-green-100 text-green-700",
    };
  } else {
    return {
      label: t("dashboard.users.status.banned"),
      classes: "bg-red-100 text-red-700",
    };
  }
};

const isManager = (user) => {
  if (!user?.user_roles?.length) return false;
  return user.user_roles.some(
    (role) => role?.roles?.code?.toLowerCase() === "manager"
  );
};

const formatUsersRole = (roles = []) => {
  const uniqueRoles = [
    ...new Set(roles.map((r) => r?.roles?.name).filter(Boolean)),
  ];
  return uniqueRoles.length ? uniqueRoles.join(", ") : NOT_PROVIDED;
};

const formatPhone = (phone) => {
  if (!phone) return NOT_PROVIDED;

  // Remove all non-digit characters, just in case
  const digits = phone.replace(/\D/g, "");

  // If it's 10 digits (US-style), format like (123) 456-7890
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // For longer numbers (country code + local number),
  // add plus sign at start and group digits sensibly
  if (digits.length > 10 && digits.length <= 15) {
    // Example: +49 1234 567890
    // Here, we can split country code (1-3 digits) + rest

    // Extract country code (first 1-3 digits)
    const countryCodeLength = digits.length - 10; // Assuming local number is 10 digits
    const countryCode = digits.slice(0, countryCodeLength);
    const localNumber = digits.slice(countryCodeLength);

    // Format local number as (XXX) XXX-XXXX if 10 digits, or just group by 3s
    let formattedLocal;
    if (localNumber.length === 10) {
      formattedLocal = `(${localNumber.slice(0, 3)}) ${localNumber.slice(
        3,
        6
      )}-${localNumber.slice(6)}`;
    } else {
      // fallback grouping every 3 digits
      formattedLocal = localNumber.match(/.{1,3}/g).join(" ");
    }

    return locale.value == "ar"
      ? `${countryCode} ${formattedLocal}+`
      : `+${countryCode} ${formattedLocal}`;
  }

  // If unknown format, just add plus sign in front (international format fallback)
  return locale?.value == "ar" ? digits + "+" : "+" + digits;
};

const handleDelete = (user) => emit("delete", user);
</script>

<template>
  <DataTable
    :value="users"
    paginator
    :rowsPerPageOptions="[5, 10, 20, 50]"
    tableStyle="min-width: 50rem"
    :rows="userStore.limit"
    :totalRecords="userStore.total"
    :first="(userStore.page - 1) * userStore.limit"
    @page="
      (e) => {
        if (e.rows !== userStore.limit) {
          userStore.page = 1;
          userStore.limit = e.rows;
        } else {
          userStore.page = e.page + 1;
        }
        emit('fetchUsers');
      }
    "
    :loading="userStore?.loading"
  >
    <Column field="name" :header="$t('dashboard.users.table.name')" />

    <Column field="email" :header="$t('dashboard.users.table.email')">
      <template #body="{ data }">
        <p class="text-sm" :class="!data?.email ? 'text-gray-400 italic' : ''">
          {{ data?.email || $t("dashboard.users.not_provided") }}
        </p>
      </template>
    </Column>

    <Column field="phone" :header="$t('dashboard.users.table.phone')">
      <template #body="{ data }">
        <p class="text-sm" :class="!data?.phone ? 'text-gray-400 italic' : ''">
          {{
            typeof formatPhone(data?.phone) === "object"
              ? formatPhone(data?.phone).text
              : formatPhone(data?.phone)
          }}
        </p>
      </template>
    </Column>

    <Column field="roles" :header="$t('dashboard.users.table.role')">
      <template #body="{ data }">
        <p
          class="text-sm"
          :class="
            formatUsersRole(data?.user_roles).isPlaceholder
              ? 'text-gray-400 italic'
              : ''
          "
        >
          {{
            typeof formatUsersRole(data?.user_roles) === "object"
              ? formatUsersRole(data?.user_roles).text
              : formatUsersRole(data?.user_roles)
          }}
        </p>
      </template>
    </Column>

    <Column field="is_active" :header="$t('dashboard.users.table.is_active')">
      <template #body="{ data }">
        <span
          class="px-2 py-1 rounded text-xs font-medium"
          :class="getStatusInfo(data?.is_active).classes"
        >
          {{ getStatusInfo(data?.is_active).label }}
        </span>
      </template>
    </Column>

    <Column :header="$t('dashboard.users.table.actions')">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Button
            :disabled="isManager(data)"
            :icon="getToggleButtonInfo(data?.is_active).icon"
            :severity="getToggleButtonInfo(data?.is_active).severity"
            :label="getToggleButtonInfo(data?.is_active).label"
            @click="() => handleToggleBan(data)"
            rounded
            size="small"
          />
          <Button
            :disabled="isManager(data)"
            icon="pi pi-trash"
            severity="danger"
            :label="$t('dashboard.users.actions.delete')"
            @click="() => handleDelete(data)"
            rounded
            size="small"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
