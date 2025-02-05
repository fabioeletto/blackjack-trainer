<script setup lang="ts">
import type { Suit } from "../types";

defineProps<{
    rank: string;
}>()

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const randomSuit = suits[Math.floor(Math.random() * suits.length)]

</script>

<template>
    <div class="lg:w-44 lg:h-62 sm:w-32 sm:h-44 w-28 h-32">
        <img :src="`./cards/${rank}-${randomSuit}.svg`" :alt="`Card ${rank} of ${randomSuit}`" />
    </div>
</template>
