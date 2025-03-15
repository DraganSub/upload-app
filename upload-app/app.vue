<script setup>
import "./assets/css/main.css";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { ref, provide } from "vue";
const isImageUploaded = ref(false);
function updateIsUploaded(value) {
  isImageUploaded.value = value;
}
provide("isImageUploaded", { isImageUploaded, updateIsUploaded });
/* const { onDragLeave, onDragOver, onDrop } = useGlobalDragUpload();
onMounted(() => {
  window.addEventListener("dragover", onDragOver);
  window.addEventListener("dragleave", onDragLeave);
  window.addEventListener("drop", onDrop);
});

onUnmounted(() => {
  window.removeEventListener("dragover", onDragOver);
  window.removeEventListener("dragleave", onDragLeave);
  window.removeEventListener("drop", onDrop);
}); */
</script>

<template>
  <div class="bg-main-gradient">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>
