import { ref, toRef, inject, onMounted, onUnmounted } from "vue";
import { upload } from "~/utils/upload";
import { useToast } from "~/components/ui/toast";
import { useSupabaseUser } from "#imports";
import { useModal } from "~/composables/useModal";

export function useGlobalDragUpload() {
  const files = ref<
    {
      file: File;
      preview: string;
      progress: number;
      error: any | null;
    }[]
  >([]);

  const isUploading = ref(false);
  const { toast } = useToast();
  const user = useSupabaseUser();
  const userRef = toRef(user, "value");
  const isDragging = ref(false);
  let dragTimeout: ReturnType<typeof setTimeout> | null = null;
  const { isModalOpen } = useModal();

  const isImageUploaded = inject<{
    value: boolean;
    updateIsUploaded: (value: boolean) => void;
  }>("isImageUploaded");

  const handleFileUpload = async (file: File) => {
    try {
      await upload(file, userRef.value?.id as string);
      toast({
        title: file.name,
        description: "Successfully uploaded",
        duration: 3000,
        variant: "success",
      });
      isImageUploaded?.updateIsUploaded(true);
    } catch (error) {
      toast({
        title: file.name,
        description: "Upload failed",
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const addFiles = async (newFiles: FileList) => {
    if (!newFiles || newFiles.length === 0) return;

    if (isModalOpen.value) {
      // Add files to the list (without replacing existing ones)
      for (const file of newFiles) {
        files.value.push({
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          error: null,
        });
      }
    } else {
      // Upload files immediately if modal is closed
      for (const file of newFiles) {
        await handleFileUpload(file);
      }
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(files.value[index].preview);
    files.value.splice(index, 1);
  };

  const uploadFiles = async () => {
    isUploading.value = true;
    await Promise.all(
      files.value.map(async (file) => await handleFileUpload(file.file))
    );
    isUploading.value = false;
    files.value = [];
  };

  // Drag and Drop Events
  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (dragTimeout) clearTimeout(dragTimeout);
    isDragging.value = true;
  };

  const onDragLeave = () => {
    dragTimeout = setTimeout(() => {
      isDragging.value = false;
    }, 200);
  };


  const onDrop = async (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;
    if (!event.dataTransfer?.files) return;
    await addFiles(event.dataTransfer.files);

    // If modal is NOT open, upload immediately
    if (!isModalOpen.value) {
      await uploadFiles();
    }
  };

  onMounted(() => {
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
  });

  onUnmounted(() => {
    window.removeEventListener("dragover", onDragOver);
    window.removeEventListener("dragleave", onDragLeave);
    window.removeEventListener("drop", onDrop);
  });

  return {
    isUploading,
    files,
    addFiles,
    removeFile,
    uploadFiles,
    isDragging,
    onDrop,
    onDragOver,
    onDragLeave,
  };
}
