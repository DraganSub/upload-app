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
  const isDragging = useState("isDragging", () => false);
  let dragTimeout: ReturnType<typeof setTimeout> | null = null;
  const { isModalOpen } = useModal();

  const resetState = () => {
    files.value = [];
  };

  const isImageUploaded = inject<{
    value: Ref<boolean>;
    updateIsUploaded: (value: boolean) => void;
  }>("isImageUploaded");

  // uploads singe file when dragged and dropped without upload modal 
  const handleSingeFileUpload = async (file: File) => {
    try {
      await upload(file, userRef.value?.id as string);
      toast({
        title: file.name,
        description: "Successfully uploaded",
        duration: 3000,
        variant: "success",
      });
      isImageUploaded?.updateIsUploaded(true);
    } catch (error: any) {
      toast({
        title: file.name,
        description: error.message,
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  // Add files into the list with preview - for upload modal 
  const addFiles = async (newFiles: FileList) => {
    if (!newFiles || newFiles.length === 0) return;

    // Add files to the list (without replacing existing ones)
    for (const file of newFiles) {
      console.log(file)
      const alreadyExists = files.value.some(f => f.file.name === file.name);

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast({
          title: file.name,
          description: "Only .jpg and .png files are allowed.",
          duration: 3000,
          variant: "destructive",
        });
        continue;
      }
      if (!alreadyExists) {
        files.value.push({
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          error: null,
        });
      }
    }
  };

  // remove file from the list inside the upload modal preview 
  const removeFile = (index: number) => {
    URL.revokeObjectURL(files.value[index].preview);
    files.value.splice(index, 1);
  };

  // upload all files from the list inside the upload modal preview and add progress bar with error handling
  const uploadFiles = async () => {
    isUploading.value = true;
    await Promise.all(
      files.value.map(async (file, index) => {
        try {
          await upload(file.file, userRef.value?.id as string, (progress) => {
            files.value[index].progress = progress;
          });
        } catch (error) {
          files.value[index].progress = 0;
          files.value[index].error = error;
        }
      })
    );

    // display toaster
    files.value.forEach((file) => {
      if (file.error) {
        toast({
          title: file.file.name,
          description: file.error,
          duration: 3000,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: file.file.name,
        description: "Successfully uploaded",
        duration: 3000,
        variant: "success",
      });
    });

    isImageUploaded?.updateIsUploaded(true);

    setTimeout(() => {
      files.value.forEach((file) => URL.revokeObjectURL(file.preview));
      isUploading.value = false;
      resetState();
    }, 5000);
  };

  // drag over event for enabling dragging flag
  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    if (dragTimeout) clearTimeout(dragTimeout);
    isDragging.value = true;
  };

  // drag leave event for disabling dragging flag
  const onDragLeave = () => {
    dragTimeout = setTimeout(() => {
      isDragging.value = false;
    }, 200);
  };


  const onDrop = async (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;
    if (!event.dataTransfer?.files) return;

    // Ensure duplicate files aren't uploaded twice
    const newFiles = event.dataTransfer.files;

    // If modal is open, just add to the list
    try {

      if (isModalOpen.value) {
        await addFiles(newFiles);
      } else {
        // If modal is closed, upload immediately
        for (const file of newFiles) {
          await handleSingeFileUpload(file);
        }
      }
    } catch (error: any) {

    }
  };


  return {
    isUploading,
    files,
    resetState,
    addFiles,
    removeFile,
    uploadFiles,
    onDrop,
    isDragging,
    onDragOver,
    onDragLeave,
  };
}
