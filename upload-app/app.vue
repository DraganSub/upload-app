<script setup>
import "./assets/css/main.css";
import Toaster from "@/components/ui/toast/Toaster.vue";
</script>

<template>
  <div class="bg-main-gradient">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>
