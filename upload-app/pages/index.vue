<script setup lang="ts">
import Card from "~/components/ui/card/Card.vue";
import { fetchImages } from "@/utils/fetchImages";
import Dialog from "~/components/ui/dialog/Dialog.vue";
import DialogTrigger from "~/components/ui/dialog/DialogTrigger.vue";
import { useToast } from "~/components/ui/toast";
import { ref } from "vue";
import { type Tables } from "~/database.types";

useSeoMeta({
  title: "Home",
  description: "Home",
});

definePageMeta({
  middleware: ["auth"],
});

const isLoading = ref(false);
const images = ref<Tables<"uploads">[]>([]);
const user = useSupabaseUser();
const userRef = toRef(user, "value");
const { toast } = useToast();

const fetchData = async () => {
  isLoading.value = true;
  try {
    const data = await fetchImages(userRef?.value!.id);
    if (data.success) {
      images.value = data.images;
    } else {
      console.error("Error fetching images:", data.message);
    }
  } catch (error) {
    console.error("Fetch failed:", error);
  }
  isLoading.value = false;
};

const deleteImage = async (fileName: string, imageId: string) => {
  try {
    const response = await fetch("/api/deleteImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: fileName,
        imageId: imageId,
        userId: userRef?.value?.id,
      }),
    });

    const data = await response.json();
    if (data.success) {
      toast({
        title: "Successfully deleted image!",
        duration: 3000,
        variant: "success",
      });
      await fetchData();
    } else {
      toast({
        title: "There was a problem deleting the image",
        duration: 3000,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchData();
});

watch(
  () => eventBus.uploadCompleted,
  (newValue) => {
    if (newValue) {
      fetchData();
    }
  }
);
</script>

<template>
  <div class="w-full mx-auto max-w-[90%] flex flex-col gap-10">
    <h1 class="text-white text-[40px]">Gallery</h1>
    <div
      v-if="images.length !== 0"
      class="grid grid-cols-[repeat(auto-fill,minmax(150px,200px))] grid-rows-[repeat(auto-fill, minmax(150px, 200px))] gap-4 auto-cols-max grid-auto-flow mt-15"
    >
      <div v-for="image in images" :key="image.file_name">
        <div class="min-h-[70px] min-w-[100px] w-full">
          <Dialog class="bg-[#2D2F39] border-none">
            <DialogTrigger>
              <Card class="w-[200px] h-[150px] overflow-hidden">
                <CardContent class="p-0 w-full h-full">
                  <img
                    :src="image.file_url"
                    class="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent
              class="w-[700px] h-[600px] overflow-hidden bg-[#2D2F39] border-none p-8"
            >
              <div class="flex flex-col relative">
                <img
                  :src="image.file_url"
                  class="w-full h-full object-cover mb-10 max-h-[500px]"
                />
                <Button
                  variant="destructive"
                  class="w-[30%] absolute -bottom-1 right-0"
                  @click="deleteImage(image.file_name, image.id)"
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
    <div class="h-[400px] flex justify-center items-center" v-else>
      <EmptyGalery />
    </div>
  </div>
</template>
