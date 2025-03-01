<script setup lang="ts">
import { Home, User, Upload, LogOut } from "lucide-vue-next";
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
    // add composable for modal and change in view
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
                <NuxtLink class="text-[#f6f6f6]" :to="item.url">
                  <component :is="item.icon" />
                  <span class="text-[15px]">{{ item.title }}</span>
                </NuxtLink>
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
      <span>Sign Out</span>
      <LogOut />
    </SidebarFooter>
  </Sidebar>
</template>
