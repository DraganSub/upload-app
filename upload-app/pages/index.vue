<script setup lang="ts">
import Card from "~/components/ui/card/Card.vue";
import AppSidebar from "../components/AppSidebar.vue";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

useSeoMeta({
  title: "Home",
  description: "Home",
});

const items = 40;
</script>

<template>
  <div class="w-full">
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(150px,200px))] grid-rows-[repeat(auto-fill, minmax(150px, 200px))] gap-4 auto-cols-max grid-auto-flow mt-15 mx-5"
    >
      <div v-for="item in items">
        <div class="min-h-[70px] min-w-[100px] w-full">
          <Card>
            <CardContent class="w-[150px] h-[150px] p-0">
              <!-- add image  -->
            </CardContent>
          </Card>
          <!-- <button class="bg-red-900 p-2 text-white cursor-pointer">X</button> -->
        </div>
      </div>
    </div>
  </div>
</template>
