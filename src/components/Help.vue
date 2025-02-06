<script setup lang="ts">
import { ref } from 'vue';
import Dialog from './Dialog.vue';
import scenarios from '../assets/blackjack_scenarios.json';
import type { Scenario } from '../types';

const props = defineProps<{
    scenario: Scenario;
}>();

const dialogTarget = ref<InstanceType<typeof Dialog>>();
const openDialog = () => dialogTarget.value?.show();

const playerHands = [...new Set(scenarios.map(scenario => scenario.playerHand))];
const dealerCards = [...new Set(scenarios.map(scenario => scenario.dealerCard))];

function getScenarioCorrectAction(playerHand: string, dealerCard: string) {
    return scenarios.find(scenario => scenario.playerHand === playerHand && scenario.dealerCard === dealerCard)?.correctAction;
}

function getColorForAction(action?: string) {
    if (!action) {
        return 'transparent';
    }
    if (action === 'Hit') {
        return '#4CAF50';
    } else if (action === 'Stand') {
        return '#F44336';
    } else if (action === 'Double') {
        return '#2196F3';
    } else if (action === 'Split') {
        return '#FFC107';
    }
}

function isCurrentScenario(playerHand: string, dealerCard: string) {
    return playerHand === props.scenario.playerHand && dealerCard === props.scenario.dealerCard;
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
            <table>
                <thead>
                    <tr>
                        <td>Dealer \ Player</td>
                        <th v-for="playerHand in playerHands" :key="playerHand" scope="col">
                            {{ playerHand }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="dealerCard in dealerCards" :key="dealerCard">
                        <th scope="row">{{ dealerCard }}</th>
                        <td 
                            v-for="playerHand in playerHands"
                            :key="playerHand"
                            :style="{ 
                                backgroundColor: getColorForAction(getScenarioCorrectAction(playerHand, dealerCard)),
                            }"
                            :class="{ activeScenario: isCurrentScenario(playerHand, dealerCard) }"
                        >
                            <span v-if="getScenarioCorrectAction(playerHand, dealerCard) === 'Hit'">+</span>
                            <span v-else-if="getScenarioCorrectAction(playerHand, dealerCard) === 'Stand'">-</span>
                            <span v-else-if="getScenarioCorrectAction(playerHand, dealerCard) === 'Double'">2X</span>
                            <span v-else-if="getScenarioCorrectAction(playerHand, dealerCard) === 'Split'">| |</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Dialog>
   </div> 
</template>

<style scoped>

dialog {
    width: 90%;
}

table {
    border-collapse: collapse;
    width: fit-content;
    table-layout: fixed;
    overflow-x: auto;
    display: block; 
    white-space: nowrap;
}

th, td {
    width: 3em;
    height: 3em; 
    text-align: center;
    vertical-align: middle;
    border: 1px solid black;
    border-radius: 0.25em;
}

th {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.activeScenario {
    border-radius: 0.25em;
    border: 4px solid #7b07ff;
}
</style>