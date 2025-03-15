<script setup>
import AppSidebar from "~/components/AppSidebar.vue";
import SidebarProvider from "~/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "~/components/ui/sidebar/SidebarTrigger.vue";
import GlobalDragOverlay from "~/components/GlobalDragOverlay.vue";
import Loader from "~/components/Loader.vue";
import { useGlobalDragUpload } from "@/composables/useGlobalDragUpload";

const route = useRoute();
const isProfileRoute = computed(() => route.fullPath.includes("profile"));

const { onDragLeave, onDragOver, onDrop } = useGlobalDragUpload();
onMounted(() => {
  window.addEventListener("dragover", onDragOver);
  window.addEventListener("dragleave", onDragLeave);
  window.addEventListener("drop", onDrop);
});

onUnmounted(() => {
  window.removeEventListener("dragover", onDragOver);
  window.removeEventListener("dragleave", onDragLeave);
  window.removeEventListener("drop", onDrop);
});
</script>

<template>
  <div>
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full" :class="{ 'bg-profile-custom': isProfileRoute }">
        <Loader />
        <SidebarTrigger class="mb-10" />
        <GlobalDragOverlay />
        <NuxtPage />
      </main>
    </SidebarProvider>
  </div>
</template>
