<script setup>
import { ref } from "vue";
import { Upload } from "lucide-vue-next";
import Separator from "../ui/separator/Separator.vue";
const files = ref([]);
const isDragging = ref(false);
const fileInput = ref(null);

// Handle file selection from file manager
const onFileChange = (event) => {
  const selectedFiles = event.target.files;
  if (selectedFiles.length) {
    for (let file of selectedFiles) {
      files.value.push(file);
    }
  }
};

// Open file manager when clicking the button
const openFileManager = () => {
  fileInput.value.click();
};

// Handle drag events
const onDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;

  const droppedFiles = event.dataTransfer.files;
  if (droppedFiles.length) {
    for (let file of droppedFiles) {
      files.value.push(file);
    }
  }
};

// Remove file from the list
const removeFile = (index) => {
  files.value.splice(index, 1);
};
</script>

<template>
  <Dialog>
    <DialogTrigger> Upload </DialogTrigger>
    <DialogContent class="bg-[#2D2F39] border-none">
      <h3 class="text-white mb-4">Add Images!</h3>
      <div class="">
        <!-- Hidden File Input -->
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          multiple
          accept="image/*"
          @change="onFileChange"
        />

        <!-- Drop Zone -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 min-w-[400px] text-center cursor-pointer transition-all duration-300"
          :class="{ 'bg-gray-100 border-blue-500': isDragging }"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
          @click="openFileManager"
        >
          <component
            class="flex justify-center items-center w-full my-2 text-white"
            :is="Upload"
          />
          <p class="text-gray-500">
            Drag & Drop images here or
            <span class="text-blue-500 font-semibold">click to upload</span>
          </p>
        </div>
        <ul class="mt-4 space-y-2">
          <li
            v-for="(file, index) in files"
            :key="index"
            class="flex justify-between items-center bg-white p-2 rounded-md shadow-sm"
          >
            <span class="text-sm text-gray-700">{{ file.name }}</span>
            <button
              class="text-red-500 hover:text-red-700 transition"
              @click.stop="removeFile(index)"
            >
              ✕
            </button>
          </li>
        </ul>
      </div>
      <DialogFooter>
        <Button class="bg-green-500 hover:bg-green-700 p-2 rounded text-white"
          >Upload</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
