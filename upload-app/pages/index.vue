<script setup lang="ts">
import Card from "~/components/ui/card/Card.vue";
import Dialog from "~/components/ui/dialog/Dialog.vue";
import DialogTrigger from "~/components/ui/dialog/DialogTrigger.vue";
import { useToast } from "~/components/ui/toast";
import { ref, inject } from "vue";
import { type Tables } from "~/database.types";
import getFileExtension from "~/utils/helpers/getFileExtension";

useSeoMeta({
  title: "Home",
  description: "Home",
});

definePageMeta({
  middleware: ["auth"],
});

const images = ref<Tables<"uploads">[]>([]);
const user = useSupabaseUser();
const userRef = toRef(user, "value");
const { toast } = useToast();
const { startLoading, finishLoading } = useLoading();
// inject the isImageUploaded ref and updateIsUploaded function
const isImageUploaded = inject<{
  isImageUploaded: Ref<boolean>;
  updateIsUploaded: (value: boolean) => void;
}>("isImageUploaded");

const downloadImages = async () => {
  try {
    const data = await $fetch("/api/downloadImages", {
      method: "POST",
      body: JSON.stringify({
        userId: userRef?.value?.id,
      }),
    });
    if (data.success) {
      console.log("Images downloaded successfully");
    }
  } catch (error) {
    console.error("Failed to download images:", error);
  }
};

const fetchDataFromDb = async () => {
  try {
    startLoading();
    await downloadImages();
    const data = await $fetch("/api/fetchImages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userRef?.value?.id,
      }),
    });

    if (data.success) {
      images.value = data.images;
    }

    if (data.error) {
      toast({
        title: data.error as string,
        duration: 3000,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    finishLoading();
  }
};

const deleteImage = async (
  fileName: string,
  imageId: string,
  file_type: string
) => {
  startLoading();
  try {
    const data = await $fetch("/api/deleteImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: fileName,
        imageId: imageId,
        userId: userRef?.value?.id,
        file_type: file_type,
      }),
    });

    if (data.success) {
      toast({
        title: "Successfully deleted image!",
        duration: 3000,
        variant: "success",
      });
      await fetchDataFromDb();
    }
  } catch (error) {
    toast({
      title: "There was a problem deleting the image",
      duration: 3000,
      variant: "destructive",
    });
  } finally {
    finishLoading();
  }
};

onMounted(() => {
  fetchDataFromDb();
});

watch(
  () => isImageUploaded?.isImageUploaded.value,
  async (newValue) => {
    if (newValue) {
      await fetchDataFromDb();

      // prepare for the next upload
      isImageUploaded?.updateIsUploaded(false);
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
                    :src="`/images/${image.file_id}${getFileExtension(
                      image.file_type
                    )}`"
                    class="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent
              class="w-[700px] h-[600px] overflow-hidden bg-[#2D2F39] border-none p-8"
            >
              <div class="flex flex-col relative">
                <DialogDescription class="text-white text-[16px] py-4">{{
                  image.file_name
                }}</DialogDescription>
                <img
                  :src="`/images/${image.file_id}${getFileExtension(
                    image.file_type
                  )}`"
                  class="w-full h-full object-cover mb-10 max-h-[500px]"
                />
                <Button
                  variant="destructive"
                  class="w-[30%] absolute -bottom-1 right-0"
                  @click="
                    deleteImage(
                      image.file_id,
                      image.id,
                      getFileExtension(image.file_type)
                    )
                  "
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
