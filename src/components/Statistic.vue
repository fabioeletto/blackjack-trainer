<script setup lang="ts">
import { ref } from 'vue';
import Dialog from './Dialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import type { IncorrectScenario } from '../types';
import { useUserSessionStore } from '../user-session-store';

const userSessionStore = useUserSessionStore();

defineProps({
    correctScenariosLength: {
        type: Number,
        required: true
    },
    incorrectScenarios: {
        type: Array<IncorrectScenario>,
        required: true
    },
    visitedScenariosLength: {
        type: Number,
        required: true
    },
    scenariosLength: {
        type: Number,
        required: true
    }
});

const dialogTargetIncorrectScenarios = ref<InstanceType<typeof Dialog>>();
const dialogTargetConfirmReset = ref<InstanceType<typeof ConfirmDialog>>();

function openDialog() {
  dialogTargetIncorrectScenarios.value?.show();
}

function handleReset() {
  dialogTargetConfirmReset.value?.show();
}

function clearUserSession() {
  userSessionStore.clearUserSession();
  document.location.reload();
}
</script>

<template>
    <div class="sm:w-sm w-xs">
        <table>
            <thead>
            <tr>
                <th>Stat</th>
                <th>Value</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Correct</td>
                <td>{{ correctScenariosLength }}</td>
                <td></td>
            </tr>
            <tr>
                <td>Incorrect</td>
                <td>{{ incorrectScenarios.length }}</td>
                <td><a v-if="incorrectScenarios.length > 0" @click="openDialog">Show</a></td>
            </tr>
            <tr>
                <td>Visited</td>
                <td>{{ visitedScenariosLength }} / {{ scenariosLength }} ({{ (visitedScenariosLength / scenariosLength * 100).toFixed(2) }}%)</td>
                <td>
                    <a 
                        v-if="visitedScenariosLength > 0"
                        @click="handleReset"
                    >
                        Reset
                    </a>
                </td>
            </tr>
            </tbody>
        </table>
        <Dialog ref="dialogTargetIncorrectScenarios">
            <table>
                <thead>
                <tr>
                    <th>Player Hand</th>
                    <th>Dealer Card</th>
                    <th>User Choice</th>
                    <th>Correct Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="scenario in incorrectScenarios">
                    <td>{{ scenario.playerHand }}</td>
                    <td>{{ scenario.dealerCard }}</td>
                    <td>{{ scenario.userChoice }}</td>
                    <td>{{ scenario.correctAction }}</td>
                </tr>
                </tbody>
            </table>
        </Dialog>
        <ConfirmDialog ref="dialogTargetConfirmReset" @ok="clearUserSession">
            <p>Are you sure you want to reset?</p>
            <p>This will clear all your progress.</p>
        </ConfirmDialog>
    </div>
</template>