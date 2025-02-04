<script setup lang="ts">
import { ref } from 'vue';
import Dialog from './Dialog.vue';

defineExpose({
  show: () => dialogTarget.value?.show(),
});

const emit = defineEmits(['ok']);

const dialogTarget = ref<InstanceType<typeof Dialog>>();

function handleClick() {
  emit('ok');
  dialogTarget.value?.close();
}

</script>

<template>
    <Dialog ref="dialogTarget">
        <slot />
        <button 
            @click="handleClick"
            class="inline mr-4 mt-4 px-2 py-1 w-16 rounded-md"
        >
            Yes
        </button>
    </Dialog>
</template>