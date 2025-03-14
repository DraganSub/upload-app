<script setup>
import { useLoading } from "@/composables/useLoading";
const { isLoading } = useLoading();
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
