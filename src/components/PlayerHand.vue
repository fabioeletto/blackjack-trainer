<script setup lang="ts">
import { ref, watch } from 'vue';
import Card from './Card.vue';

const props = defineProps<{
    playerHand: string;
}>();

const emit = defineEmits(['playerScoreChanged', 'playerCanSplit']);

const playerCardOneRank = ref('');
const playerCardTwoRank = ref('');
const playerScore = ref('');
const canPlayerSplit = ref(false);

convertPlayerHandToRanks();

watch(() => props.playerHand, convertPlayerHandToRanks);

function convertPlayerHandToRanks() {
    if (props.playerHand.includes('A')) {
        [playerCardOneRank.value, playerCardTwoRank.value] = props.playerHand.split('-');
        if (playerCardOneRank.value == 'A' && playerCardTwoRank.value == 'A') {
            canPlayerSplit.value = true;
            playerScore.value = '12';
        } else if (playerCardOneRank.value == 'A') {
            playerScore.value = `${1 + parseInt(playerCardTwoRank.value)} / ${11 + parseInt(playerCardTwoRank.value)}`;
        } else if (playerCardTwoRank.value == 'A') {
            playerScore.value = `${1 + parseInt(playerCardTwoRank.value)} / ${11 + parseInt(playerCardTwoRank.value)}`;
        }
    } else if (props.playerHand == "13-16") {
        const randomRank = Math.floor(Math.random() * 4) + 13;
        const sums = decomposeIntoSums(randomRank);
        const pair = sums[Math.floor(Math.random() * sums.length)];
        playerCardOneRank.value = pair.rank1.toString();
        playerCardTwoRank.value = pair.rank2.toString();
        playerScore.value = `${pair.rank1 + pair.rank2}`;
    } else if (props.playerHand == "17-21") {
        const tenRanks = ["10", "J", "Q", "K"]
        const randomRank = Math.floor(Math.random() * 4) + 17;
        if (randomRank == 21) {
            playerCardOneRank.value = 'A';
            playerCardTwoRank.value = tenRanks[Math.floor(Math.random() * tenRanks.length)];
            playerScore.value = '21';
        } else if (randomRank == 20) {
            playerCardOneRank.value = tenRanks[Math.floor(Math.random() * tenRanks.length)];
            const tenRanksWithoutSelected = tenRanks.filter(rank => rank != playerCardOneRank.value);
            playerCardTwoRank.value = tenRanksWithoutSelected[Math.floor(Math.random() * tenRanksWithoutSelected.length)];
            playerScore.value = '20';
        } else {
            console.log(randomRank);
            const sums = decomposeIntoSums(randomRank);
            const pair = sums[Math.floor(Math.random() * sums.length)];
            playerCardOneRank.value = pair.rank1.toString();
            playerCardTwoRank.value = pair.rank2.toString();
            playerScore.value = `${pair.rank1 + pair.rank2}`;
        }
    } else if (props.playerHand.includes('-') ) {
        [playerCardOneRank.value, playerCardTwoRank.value] = props.playerHand.split('-');
        playerScore.value = `${parseInt(playerCardOneRank.value) + parseInt(playerCardTwoRank.value)}`;
        canPlayerSplit.value = true;
    } else {
        const sums = decomposeIntoSums(parseInt(props.playerHand));
        const pair = sums[Math.floor(Math.random() * sums.length)];
        playerCardOneRank.value = pair.rank1.toString();
        playerCardTwoRank.value = pair.rank2.toString();
        playerScore.value = `${pair.rank1 + pair.rank2}`;
    }

    emit('playerScoreChanged', playerScore.value);
    emit('playerCanSplit', canPlayerSplit.value);
    canPlayerSplit.value = false;
}

function decomposeIntoSums(number: number): {rank1: number, rank2: number}[] {
    const allowedRanks = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sums: {rank1: number, rank2: number}[] = [];
    
    allowedRanks.forEach((rank) => {
        const remainder = number - rank;
        if(allowedRanks.includes(remainder) && rank <= remainder && remainder != rank) {
            sums.push({rank1: rank, rank2: remainder});
        }
    })

    return sums;
}

</script>

<template>
    <div>
        <Card 
            :rank="playerCardOneRank"
            class="-rotate-12 z-10 absolute shadow-xl lg:left-18 sm:left-22 left-17"
        />
        <Card 
            :rank="playerCardTwoRank"
            class="rotate-12 absolute shadow-xl lg:right-18 sm:right-22 right-17" 
        />
        <span 
            class="absolute z-20 batch rounded lg:text-base lg:px-4 lg:py-2 lg:w-36 lg:-bottom-64 lg:left-42 sm:px-3 sm:py-1 sm:w-32 sm:-bottom-47 sm:left-36 px-2 py-1 w-30 -bottom-42 left-28 text-sm"
        >
            Player: {{ playerScore }}
        </span>
    </div>
</template>
