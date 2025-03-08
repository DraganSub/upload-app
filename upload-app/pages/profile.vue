<script setup lang="ts">
import { User, Mail, Phone, MapPinHouse, House } from "lucide-vue-next";
import { ref, toRef } from "vue";
import { useToast } from "~/components/ui/toast";
import { type Tables } from "~/database.types";
useSeoMeta({
  title: "Profile",
});

definePageMeta({
  middleware: ["auth"],
  layout: "profile-page-layout",
});

const userData = ref<Tables<"users"> | null>(null);
const user = useSupabaseUser();
const refUser = toRef(user, "value");
const { toast } = useToast();
const { fetchData, data, error } = useFetchRequest();

const fetchUser = async () => {
  await fetchData(
    "/api/getUser",
    "POST",
    {
      userId: refUser?.value?.id,
    },
    { "Content-Type": "application/json" }
  );

  if (!data.value.success || error.value) {
    toast({
      title: "Unable to get user",
      variant: "destructive",
    });
  } else {
    userData.value = data.value.user[0];
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div v-if="userData" class="flex flex-col ml-10 gap-6">
    <h1 class="text-white text-[44px]">User Profile</h1>

    <div class="w-[20%]">
      <p class="text-white mb-2">Username:</p>
      <div class="flex items-center gap-2">
        <User class="text-white" />
        <h1 class="border p-1 rounded-sm w-full text-white">
          {{ userData.full_name }}
        </h1>
      </div>
    </div>
    <div class="w-[20%]">
      <p class="text-white mb-2">Email:</p>
      <div class="flex items-center gap-2">
        <Mail class="text-white" />
        <h3 class="border p-1 rounded-sm w-full text-white">
          {{ userData.email }}
        </h3>
      </div>
    </div>
    <div class="w-[20%]">
      <p class="text-white mb-2">Phone Number:</p>
      <div class="flex items-center gap-2">
        <Phone class="text-white" />
        <p class="border p-1 rounded-sm w-full text-white">
          {{ userData.phone_number }}
        </p>
      </div>
    </div>
    <div class="w-[20%]">
      <p class="text-white mb-2">Address:</p>
      <div class="flex items-center gap-2">
        <House class="text-white" />
        <p class="border p-1 rounded-sm w-full text-white">
          {{ userData.address }}
        </p>
      </div>
    </div>
    <div class="w-[20%]">
      <p class="text-white mb-2">Country:</p>
      <div class="flex items-center gap-2">
        <MapPinHouse class="text-white" />
        <p class="border p-1 rounded-sm w-full text-white">
          {{ userData.country }}
        </p>
      </div>
    </div>
  </div>
</template>
