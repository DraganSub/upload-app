<script setup>
import { LogOut } from "lucide-vue-next";

const supabase = useSupabaseClient();

const doSignOut = async () => {
  try {
    const response = await $fetch("/api/removeAllFiles", {
      method: "GET",
    });

    if (response.success) {
      console.log(response.message);
    }

    const { data, error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    } else {
      navigateTo("/login");
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="flex gap-2 cursor-pointer" @click="doSignOut">
    <span>Sign Out</span>
    <LogOut />
  </div>
</template>
