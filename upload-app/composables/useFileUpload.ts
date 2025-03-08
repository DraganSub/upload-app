import { ref, inject } from "vue";
import { upload } from "~/utils/upload";
import { useToast } from "~/components/ui/toast";
import { useSupabaseUser } from "#imports";

const files = ref<
  {
    file: File;
    preview: string;
    progress: number;
    error: any | null;
  }[]
>([]);

export default function useFileUpload() {
  const isUploading = ref(false);
  const { toast } = useToast();
  const user = useSupabaseUser();
  const userRef = toRef(user, "value");
  const isImageUploaded = inject<{
    value: boolean;
    updateIsUploaded: (value: boolean) => void;
  }>("isImageUploaded");


  const addFiles = (newFiles: FileList) => {
    if (!newFiles) return;

    for (const file of newFiles) {
      files.value.push({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        error: null,
      });
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
          await upload(file.file, userRef.value?.id as string, (progress) => {
            files.value[index].progress = progress;
          });
        } catch (error) {
          files.value[index].progress = 0;
          files.value[index].error = error;
        }
      })
    );

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

    isUploading.value = false;
    isImageUploaded?.updateIsUploaded(true);

    setTimeout(() => {
      files.value.forEach((file) => URL.revokeObjectURL(file.preview));
      files.value = [];
    }, 5000);

  }

  return {
    isUploading,
    files,
    addFiles,
    removeFile,
    uploadFiles,
  };
}