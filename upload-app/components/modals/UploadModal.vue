<template>
  <Dialog @update:open="resetState">
    <DialogTrigger class="hover:text-black">Upload</DialogTrigger>
    <DialogContent class="bg-[#2D2F39] border-none">
      <div>
        <DialogHeader>
          <h2 class="text-white">Upload Images</h2>
          <DialogDescription> Select images for upload </DialogDescription>
        </DialogHeader>

        <div
          class="border-2 border-dashed mt-6 border-gray-300 rounded-lg p-6 min-w-[400px] text-center cursor-pointer transition-all duration-300"
          :class="{ 'bg-gray-100 border-blue-500': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onDrop"
          @click="openFileManager"
        >
          <Upload
            class="flex justify-center items-center w-full my-2 text-white"
          />
          <p class="text-gray-500">
            Drag & Drop images here or
            <span class="text-blue-500 font-semibold">click to upload</span>
          </p>
        </div>

        <input
          type="file"
          ref="fileInput"
          class="hidden"
          multiple
          accept="image/*"
          @change="onFileChange"
        />

        <div class="mt-4 grid grid-cols-3 gap-4 max-h-64 overflow-y-auto">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="relative group"
          >
            <img
              :src="file.preview"
              class="w-full h-24 object-cover rounded-lg shadow"
            />
            <button
              class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              @click.stop="removeFile(index)"
            >
              <X />
            </button>
            <Progress
              :model-value="file.progress"
              class="w-full mt-3 bg-green-100 border-none"
            />
          </div>
        </div>

        <DialogFooter class="mt-3">
          <Button
            :disabled="isUploading || uploadComplete || files.length === 0"
            @click="uploadFiles"
            class="bg-green-500 hover:bg-green-700 p-2 rounded text-white"
          >
            Upload
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { upload } from "~/utils/upload";
import { Upload } from "lucide-vue-next";
import DialogFooter from "../ui/dialog/DialogFooter.vue";
import Button from "../ui/button/Button.vue";
import Progress from "../ui/progress/Progress.vue";
import { X } from "lucide-vue-next";
import DialogHeader from "../ui/dialog/DialogHeader.vue";
import DialogDescription from "../ui/dialog/DialogDescription.vue";
import { eventBus } from "~/utils/eventBus";
import { useToast } from "../ui/toast";

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<{ file: File; preview: string; progress: number }[]>([]);
const isUploading = ref(false);
const uploadComplete = ref(false);
const user = useSupabaseUser();
const userRef = toRef(user, "value");
const openFileManager = () => fileInput.value?.click();
const { toast } = useToast();

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  for (const file of input.files) {
    files.value.push({ file, preview: URL.createObjectURL(file), progress: 0 });
  }
};

const resetState = () => {
  files.value = [];
  uploadComplete.value = false;
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (!event.dataTransfer?.files) return;

  for (const file of event.dataTransfer.files) {
    files.value.push({ file, preview: URL.createObjectURL(file), progress: 0 });
  }
};

const removeFile = (index: number) => {
  URL.revokeObjectURL(files.value[index].preview);
  files.value.splice(index, 1);
};

const uploadFiles = async () => {
  isUploading.value = true;
  await Promise.all(
    files.value.map(async (file, index) => {
      try {
        await upload(file.file, userRef?.value!.id, (progress) => {
          files.value[index].progress = progress;
        });
      } catch (error) {
        console.error("Upload failed:", error);
      }
    })
  );

  isUploading.value = false;
  uploadComplete.value = true;
  eventBus.triggerUploadComplete();
  toast({
    title: "Successfully added image!",
    duration: 3000,
    variant: "success",
  });

  setTimeout(() => {
    files.value.forEach((file) => URL.revokeObjectURL(file.preview)); // Clean up object URLs
    files.value = [];
    uploadComplete.value = false;
  }, 5000);
};
</script>
