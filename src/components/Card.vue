<script setup lang="ts">

defineProps<{
    rank: string;
}>()

const suits = ['hearts', 'diamonds', 'clubs', 'spades']
const randomSuit = suits[Math.floor(Math.random() * suits.length)]

</script>

<template>
    <div class="lg:w-44 lg:h-62 sm:w-32 sm:h-44 w-24 h-32">
        <img :src="`./cards/${rank}-${randomSuit}.svg`" :alt="`Card ${rank} of ${randomSuit}`" />
    </div>
</template>
