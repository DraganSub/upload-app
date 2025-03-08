<script setup>
defineProps({
  error: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <p v-if="error" class="text-red-500 text-sm max-w-[185px]">{{ error }}</p>
</template>
