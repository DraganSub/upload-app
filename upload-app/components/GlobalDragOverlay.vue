<script setup lang="ts">
import { useGlobalDragUpload } from "~/composables/useGlobalDragUpload";

const { isDragging } = useGlobalDragUpload();
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isDragging"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class="text-center text-white text-lg border-4 border-dashed border-gray-300 p-10 rounded-lg"
      >
        Drop your files for upload
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
