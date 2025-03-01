<script setup>
useSeoMeta({
  title: "Profile",
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<template>Profile</template>
