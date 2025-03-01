<script setup>
import AppSidebar from "~/components/AppSidebar.vue";
import SidebarProvider from "~/components/ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "~/components/ui/sidebar/SidebarTrigger.vue";
</script>

<template>
  <div>
    <SidebarProvider>
      <AppSidebar />
      <main class="w-full">
        <SidebarTrigger class="mb-10" />
        <NuxtPage />
      </main>
    </SidebarProvider>
  </div>
</template>
