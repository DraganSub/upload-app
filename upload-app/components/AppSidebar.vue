<script setup lang="ts">
import { Home, User, Upload } from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import UploadModal from "./modals/UploadModal.vue";
import SignOutBtn from "./SignOutBtn.vue";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Upload",
    icon: Upload,
  },
];
</script>

<template>
  <Sidebar>
    <SidebarContent class="bg-[#191414]">
      <SidebarGroup>
        <SidebarGroupLabel class="text-[#f6f6f6] font-thin mb-3"
          >Application</SidebarGroupLabel
        >
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton asChild>
                <NuxtLink v-if="item.url" class="text-[#f6f6f6]" :to="item.url">
                  <component :is="item.icon" />
                  <span class="text-[15px]">{{ item.title }}</span>
                </NuxtLink>
                <span v-else class="text-[15px] text-white"
                  ><component :is="item.icon" /> <UploadModal />
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <Separator />
    <SidebarFooter
      class="flex flex-row justify-end text-[#f6f6f6] bg-[#191414] h-[50px] items-center"
    >
      <SignOutBtn />
    </SidebarFooter>
  </Sidebar>
</template>
