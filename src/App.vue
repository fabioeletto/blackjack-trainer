<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import scenarios from './assets/blackjack_scenarios.json';
import DealerHand from './components/DealerHand.vue';
import PlayerHand from './components/PlayerHand.vue';
import Statistic from './components/Statistic.vue';
import Help from './components/Help.vue';
import type { IncorrectScenario, Scenario, UserChoice } from './types';
import { useUserSessionStore } from './user-session-store';

const userSessionStore = useUserSessionStore();

const rounds = ref(0);
const visitedScenarios = ref<Scenario[]>(userSessionStore.visibleScenarios);
const currentScenario = ref<Scenario>(userSessionStore.currentScenario || scenarios[0]);
const lastAnswerCorrect = ref<boolean | null>(null);
const correctScenarios = ref<Scenario[]>(userSessionStore.correctScenarios);
const incorrectScenarios = ref<IncorrectScenario[]>(userSessionStore.incorrectScenarios);
const currentPlayerScore = ref<string>('');
const canSplit = ref<boolean>(false);

const notVisitedScenarios = computed(() => {
  return scenarios.filter(scenario => !visitedScenarios.value.includes(scenario));
});

const canDouble = computed(() => {
  return currentPlayerScore.value === '9' || currentPlayerScore.value === '10' || currentPlayerScore.value === '11';
})

const canPlay = computed(() => {
  return notVisitedScenarios.value.length > 0 || incorrectScenarios.value.length > 0;
});

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === '1') {
    checkAnswer('Hit');
  } else if (event.key === '2') {
    checkAnswer('Stand');
  } else if (event.key === '3') {
    checkAnswer('Double');
  } else if (event.key === '4') {
    checkAnswer('Split');
  }
}

onMounted(() => {
  if(canPlay.value) {
    document.addEventListener("keydown", handleKeyDown);
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
})

watch(canPlay, (value) => {
  if (!value) {
    document.removeEventListener("keydown", handleKeyDown);
  }
});

function loadRandomIncorrectScenario() {
  const randomIndex = Math.floor(Math.random() * incorrectScenarios.value.length);
  const scenario = incorrectScenarios.value[randomIndex];
  incorrectScenarios.value.splice(randomIndex, 1);
  return scenario;
}

function loadRandomNotVisitedScenario() {
  const randomIndex = Math.floor(Math.random() * notVisitedScenarios.value.length);
  const scenario = notVisitedScenarios.value[randomIndex];
  visitedScenarios.value.push(scenario);
  return scenario;
}

function loadRandomScenario() {
  rounds.value++;
  if (incorrectScenarios.value.length > 0 && (rounds.value % 5 === 0 || notVisitedScenarios.value.length === 0)) {
    return loadRandomIncorrectScenario();
  } 
  return loadRandomNotVisitedScenario();
}

function checkAnswer(userChoice: UserChoice) {
  if (userChoice === currentScenario.value.correctAction) {
    lastAnswerCorrect.value = true;
    correctScenarios.value.push(currentScenario.value);
  } else {
    lastAnswerCorrect.value = false;
    incorrectScenarios.value.push({
      ...currentScenario.value,
      userChoice
    });
  }
  const scoreTable = document.getElementById('score-table');
  scoreTable?.classList.remove('flash-green', 'flash-red');
  setTimeout(() => {
    scoreTable?.classList.add(lastAnswerCorrect.value ? 'flash-green' : 'flash-red');
  }, 10);
  currentScenario.value = loadRandomScenario();
  userSessionStore.setCurrentState(
    correctScenarios.value,
    incorrectScenarios.value,
    visitedScenarios.value,
    currentScenario.value,
  );
}

function handlePlayerScoreChanged(score: string) {
  currentPlayerScore.value = score;
}
</script>

<template>
  <div class="lg:flex lg:flex-col lg:items-center">
    <div class="relative flex flex-col justify-center items-center w-full">
      <span class="absolute z-20 batch rounded lg:text-base lg:-top-7 lg:px-4 lg:py-2 sm:-top-5 sm:px-3 sm:py-1 px-2 py-1 -top-5 text-sm">
        <span class="font-medium">Dealer: {{ currentScenario.dealerCard }}</span>
      </span>
      <DealerHand class="mb-14" :dealer-card-rank="currentScenario.dealerCard" />
      <Statistic 
        id="score-table"
        class="lg:mb-14 mb-10"
        :correct-scenarios-length="correctScenarios.length" 
        :incorrect-scenarios="incorrectScenarios" 
        :visited-scenarios-length="visitedScenarios.length"
        :scenarios-length="scenarios.length" 
      />
      <PlayerHand 
        :player-hand="currentScenario.playerHand" 
        @player-score-changed="handlePlayerScoreChanged" 
        @player-can-split="canSplit = $event"  
      />
    </div>
    <div class="text-center lg:mt-72 sm:mt-64 mt-48">
      <div class="flex gap-2 mt-2">
        <button 
          @click="checkAnswer('Hit')"
          class="lg:px-4 lg:py-2 text-white rounded lg:w-28 sm:w-24 w-20 lg:text-base text-sm px-1 py-1"
          :disabled="!canPlay"
        >
          Hit<span class="lg:inline hidden"> (1)</span>
        </button>
        <button 
          @click="checkAnswer('Stand')"
          class="lg:px-4 lg:py-2 text-white rounded lg:w-28 sm:w-24 w-20 lg:text-base text-sm px-1 py-1"
          :disabled="!canPlay"
        >
          Stand<span class="lg:inline hidden"> (2)</span>
        </button>
        <button 
          @click="checkAnswer('Double')" 
          class="lg:px-4 lg:py-2 text-white rounded lg:w-28 sm:w-24 w-20 lg:text-base text-sm px-1 py-1"
          :disabled="!canDouble || !canPlay"
        >
          Double<span class="lg:inline hidden"> (3)</span>
        </button>
        <button 
          @click="checkAnswer('Split')"
          class="lg:px-4 lg:py-2 text-white rounded lg:w-28 sm:w-24 w-20 lg:text-base text-sm px-1 py-1"
          :disabled="!canSplit || !canPlay"
        >
          Split<span class="lg:inline hidden"> (4)</span>
        </button>
      </div>
    </div>
    <Help 
      class="absolute bottom-5 right-5 mr-4 mb-4 hidden lg:block" 
      :scenario="currentScenario"
    />
  </div>  
</template>

<style>
  @keyframes flashGreen {
    0% { box-shadow: 0 0 75px #32cd32; }
    100% { box-shadow: none; }
  }

  @keyframes flashRed {
    0% { box-shadow: 0 0 75px #cd3232; }
    100% { box-shadow: none; }
  }

  .flash-green {
    animation: flashGreen 1s ease-out;
  }

  .flash-red {
    animation: flashRed 1s ease-out;
  }
</style>