import { reactive } from 'vue';

export const eventBus = reactive({
  uploadCompleted: false,
  triggerUploadComplete() {
    this.uploadCompleted = !this.uploadCompleted;
  }
});