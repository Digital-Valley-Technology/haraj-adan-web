<template>
  <DataTable
    :value="attributes"
    :loading="loading"
    :paginator="true"
    :rows="rowsPerPage"
    :totalRecords="totalRecords"
    :first="(currentPage - 1) * rowsPerPage"
    @page="onPageChange"
    :rowsPerPageOptions="[5, 10, 20]"
    tableStyle="min-width: 60rem"
    stripedRows
    emptyMessage="No attributes found"
    class="rounded-lg shadow"
  >
    <Column
      field="name"
      :header="t('dashboard.categories.attributes.name_ar')"
    />
    <Column
      field="name_en"
      :header="t('dashboard.categories.attributes.name_en')"
    />
    <Column :header="t('dashboard.categories.attributes.type')">
      <template #body="slotProps">
        {{ slotProps.data?.type?.name_en || "-" }}
      </template>
    </Column>
    <Column :header="t('table.actions')" style="width: 150px">
      <template #body="slotProps">
        <div class="flex justify-center gap-2">
          <Button
            icon="pi pi-pencil"
            :label="$t('dashboard.actions.edit')"
            size="small"
            @click="$emit('edit', slotProps.data)"
            severity="info"
            rounded
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            :label="$t('dashboard.actions.delete')"
            size="small"
            @click="$emit('delete', slotProps.data.id)"
            rounded
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  attributes: Array,
  loading: Boolean,
  rowsPerPage: Number,
  totalRecords: Number,
  currentPage: Number,
});

const emit = defineEmits(["page-change", "edit", "delete"]);

const onPageChange = (event) => {
  emit("page-change", {
    page: event.page + 1,
    rows: event.rows,
  });
};

const { t } = useI18n();
</script>
