import useFileUpload from "./useFileUpload";

export function useGlobalDragUpload() {
  const isDragging = ref(false);
  let dragTimeout: ReturnType<typeof setTimeout> | null = null;
  const { addFiles, uploadFiles } = useFileUpload();
  const { isModalOpen } = useModal();

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

    // if modal is open, add files to the list for upload
    addFiles(event.dataTransfer.files);

    if (!isModalOpen.value) {
      // Upload files when modal is not open
      await uploadFiles();
    }
  };

  onMounted(() => {
    // Add event listeners for drag and drop
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
  });

  onUnmounted(() => {
    // Remove event listeners when component is unmounted
    window.removeEventListener("dragover", onDragOver);
    window.removeEventListener("dragleave", onDragLeave);
    window.removeEventListener("drop", onDrop);
  });

  return { isDragging, onDrop, onDragOver, onDragLeave };
}

