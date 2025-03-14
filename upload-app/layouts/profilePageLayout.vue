<script setup>
import AppSidebar from "~/components/AppSidebar.vue";
import GlobalDragOverlay from "~/components/GlobalDragOverlay.vue";
import Loader from "~/components/Loader.vue";
import SidebarProvider from "~/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "~/components/ui/sidebar/SidebarTrigger.vue";
</script>

<template>
  <div>
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full bg-profile-custom">
        <Loader />
        <SidebarTrigger class="mb-10" />
        <NuxtPage />
        <GlobalDragOverlay />
      </main>
    </SidebarProvider>
  </div>
</template>
