<script setup lang="ts">
import AppSidebar from "../components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

useSeoMeta({
  title: "Home",
  description: "Home",
});
</script>

<template>
  HOme
  <!--   <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
      <slot />
    </main>
  </SidebarProvider> -->
</template>
