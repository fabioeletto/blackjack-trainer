<script setup lang="ts">
import Card from './Card.vue'

defineProps<{
    dealerCardRank: string;
}>()

</script>

<template>
    <Card :rank="dealerCardRank" class="shadow-xl" />
</template>
