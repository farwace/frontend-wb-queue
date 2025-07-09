<template>
  <div>

    <input
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        @change="onFilesSelected"
        class="form-control custom-file"
    />
    <div v-if="previews.length" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px;">
      <img
          v-for="(src, idx) in previews"
          :key="idx"
          :src="src"
          alt="preview"
          class="preview-img"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onUnmounted, defineProps, defineEmits } from 'vue';

type Props = {
  modelValue: File[];
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', files: File[]): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const previews = ref<string[]>([]);

// Обновляем превью при внешнем изменении modelValue
watch(
    () => props.modelValue,
    (files) => {
      // Очищаем старые URL
      previews.value.forEach(URL.revokeObjectURL);
      previews.value = files.map((file) => URL.createObjectURL(file));
    },
    { immediate: true }
);

function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;

  // очищаем старые превью
  previews.value.forEach(URL.revokeObjectURL);

  const files = Array.from(input.files);
  emit('update:modelValue', files);
}

onUnmounted(() => {
  previews.value.forEach(URL.revokeObjectURL);
});
</script>

<style scoped>
.preview-img {
  max-width: 50%;
  max-height: 30vh;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.custom-file::file-selector-button {
  content: "📸 Выбрать фото";
  padding: 0.5em 1em;
  margin-right: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.custom-file::-webkit-file-upload-button {
  /* для старых версий Chrome/Safari */
  content: "📸 Выбрать фото";
  padding: 0.5em 1em;
  margin-right: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

/* Опционально прятать стандартный текст пути к файлу */
.custom-file::-webkit-file-upload-text {
  visibility: hidden;
}

</style>
