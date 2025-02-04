<script setup lang="ts">
import { ref } from 'vue';
import Dialog from './Dialog.vue';
import scenarios from '../assets/blackjack_scenarios.json';

const dialogTarget = ref<InstanceType<typeof Dialog>>();
const openDialog = () => dialogTarget.value?.show();

const props = defineProps({
    playerHand: {
        type: String,
        required: true
    },
    playerScore: {
        type: String,
        required: true
    },
    dealerCard: {
        type: String,
        required: true
    }
})

function getHelpText() {
    const scenario = scenarios.find(scenario => scenario.playerHand === props.playerHand && scenario.dealerCard === props.dealerCard);
    return `Dealer has ${props.dealerCard} and you have ${props.playerScore} -> You should ${scenario?.correctAction}.`;
}


</script>

<template>
   <div>
        <span 
            class="help"
            @click="openDialog"
        >
            Show Help?
        </span>
        <Dialog ref="dialogTarget">
            <p>{{ getHelpText() }}</p>
        </Dialog>
   </div> 
</template>