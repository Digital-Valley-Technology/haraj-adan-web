<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

const { t } = useI18n();

// --- Component Setup ---
// The component now only emits the data payload for the parent to handle the API call.
const emit = defineEmits(["submitPayment"]);

// --- Form Validation Setup ---

// Define the validation schema using the updated locale key paths
const schema = yup.object({
  amount: yup
    .number()
    .typeError(t("profile.validation.amount.invalid_number"))
    .required(t("profile.validation.amount.required"))
    .positive(t("profile.validation.amount.positive")),
  receiptFile: yup.mixed().required(t("profile.validation.receipt.required")),
});

// Configure vee-validate
const { handleSubmit, isSubmitting, setFieldError, setErrors } = useForm({
  validationSchema: schema,
  validateOnMount: false,
  validateOnBlur: true,
  validateOnChange: false,
  validateOnInput: false,
});

// Fields
const { value: amount, errorMessage: amountError } = useField("amount");
const { value: receiptFile, errorMessage: receiptFileError } =
  useField("receiptFile");

// --- File Handling ---

const fileInputRef = ref(null);

const handleFileClick = () => {
  fileInputRef.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files ? event.target.files[0] : null;

  if (file) {
    receiptFile.value = file;
    setErrors({ receiptFile: undefined });
  } else {
    receiptFile.value = null;
    setFieldError("receiptFile", t("profile.validation.receipt.required"));
  }
};

// --- Clipboard Functionality ---
// Keeping this here as it relates to the form layout (bank details)
const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`Copied to clipboard: ${text}`);
    } catch (err) {
      console.error("Could not copy text using clipboard API: ", err);
      fallbackCopyTextToClipboard(text);
    }
  } else {
    fallbackCopyTextToClipboard(text);
  }
};

const fallbackCopyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }
  document.body.removeChild(textArea);
};

// --- Submission Handler ---

const onSubmit = handleSubmit((values) => {
  // Emit the validated data to the parent for the API call
  emit("submitPayment", {
    amount: values.amount,
    receiptFile: values.receiptFile,
  });
  // Note: isPaymentSuccessful state is now handled in the parent component
});
</script>

<template>
  <div class="bg-white p-4 rounded-lg">
    <!-- Payment Form View -->
    <div>
      <p class="text-xs mb-2">
        {{ t("profile.payment.account_transfer_label") }}
      </p>

      <!-- Bank Accounts Section -->
      <div class="bg-[#F5F6F7] py-4 px-2 rounded-lg mb-4">
        <div
          v-for="(account, index) in [
            { name: 'bank_alomqy', number: '3453453435' },
            { name: 'bank_albosaery', number: '3453453435' },
            { name: 'bank_kuraimimibank', number: '3453453435' },
          ]"
          :key="index"
          class="flex gap-2 items-center"
          :class="{ 'mb-4': index < 2 }"
        >
          <p class="text-sm text-gray-800">
            {{ t(`profile.payment.${account.name}`) }}:
            <span class="font-mono">{{ account.number }}</span>
          </p>

          <!-- Copy Button -->
          <span
            class="cursor-pointer text-[#146AAB]"
            @click="copyToClipboard(account.number)"
            title="Copy Account Number"
          >
            <i class="pi pi-clone"></i>
          </span>
        </div>
      </div>

      <!-- Receipt Upload Section -->
      <p class="text-xs mb-2">
        {{ t("profile.payment.download_receipt_label") }}
      </p>

      <!-- Hidden File Input -->
      <input
        type="file"
        ref="fileInputRef"
        @change="handleFileChange"
        class="hidden"
        accept="image/*, application/pdf"
      />

      <!-- Visible Upload Area -->
      <div
        class="flex flex-col justify-center items-center gap-1 border-2 border-dashed rounded-lg py-20 text-[#146AAB] mb-4 transition"
        :class="{
          'border-red-500 text-red-500': receiptFileError,
          'border-[#146AAB]': !receiptFileError,
          'bg-blue-50': receiptFile,
        }"
        @click="handleFileClick"
        role="button"
      >
        <i
          class="pi"
          :class="
            receiptFile
              ? 'pi-check-circle text-2xl'
              : 'pi-cloud-upload text-2xl'
          "
        ></i>
        <div class="ml-2 text-xs">
          <span v-if="receiptFile">{{ receiptFile.name }}</span>
          <span v-else>{{ t("profile.payment.click_to_download") }}</span>
        </div>
      </div>
      <p v-if="receiptFileError" class="text-red-500 text-xs mb-3">
        {{ receiptFileError }}
      </p>

      <!-- Amount Input Section -->
      <p class="text-xs mb-1">
        {{ t("profile.payment.amount") }}
      </p>
      <input
        v-model="amount"
        type="number"
        step="0.01"
        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 transition"
        :class="amountError ? 'border-red-500' : 'border-gray-300'"
        placeholder="0.00"
      />
      <p v-if="amountError" class="text-red-500 text-xs mb-3">
        {{ amountError }}
      </p>

      <!-- Save Button -->
      <button
        type="button"
        class="w-full bg-[#FFE800] text-black px-4 py-2 rounded-lg hover:bg-[#f5e103] transition mb-4 cursor-pointer disabled:opacity-50"
        :disabled="isSubmitting"
        @click="onSubmit"
      >
        <span v-if="isSubmitting">{{ t("profile.payment.saving") }}...</span>
        <span v-else>{{ t("profile.payment.save") }}</span>
      </button>
    </div>
  </div>
</template>
