<script setup>
import AppSidebar from "~/components/AppSidebar.vue";
import SidebarProvider from "~/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "~/components/ui/sidebar/SidebarTrigger.vue";
import { ref, provide } from "vue";
import GlobalDragOverlay from "~/components/GlobalDragOverlay.vue";

const isImageUploaded = ref(false);
function updateIsUploaded(value) {
  isImageUploaded.value = value;
}
provide("isImageUploaded", { isImageUploaded, updateIsUploaded });
</script>

<template>
  <div>
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full">
        <SidebarTrigger class="mb-10" />
        <NuxtPage />

        <GlobalDragOverlay />
      </main>
    </SidebarProvider>
  </div>
</template>
