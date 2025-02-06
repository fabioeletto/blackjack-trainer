<script setup lang="ts">
import { ref } from 'vue';

const dialogRef = ref<HTMLDialogElement | null>(null);

const showDialog = () => dialogRef.value?.showModal();
const closeDialog = () => dialogRef.value?.close();

const emit = defineEmits(['ok']);

defineExpose({
    show: showDialog,
    close: closeDialog
});

function closeFromEvent(event: MouseEvent) {
    if (event.target === dialogRef.value) {
        closeDialog();
    }
}

</script>

<template>
    <dialog 
        ref="dialogRef" 
        class="bg-white text-clack rounded-md p-6"
        @click="closeFromEvent"
    >   
        <slot />
        <button @click="emit('ok')" class="mt-4 px-2 py-1 w-16 rounded-md mr-4">Yes</button>
        <button @click="closeDialog" class="mt-4 px-2 py-1 w-16 rounded-md">Close</button>
    </dialog>
</template>