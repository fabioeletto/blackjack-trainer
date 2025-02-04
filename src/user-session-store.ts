import { defineStore } from "pinia";
import { ref } from "vue";
import type { UserSession, Scenario, IncorrectScenario } from "./types";

const LOCAL_USER_SESSION_STORAGE_KEY = "user-session-fabio-blackjack-trainer";

export const useUserSessionStore = defineStore("user-session", () => {
  const correctScenarios = ref<Scenario[]>([]);
  const incorrectScenarios = ref<IncorrectScenario[]>([]);
  const visibleScenarios = ref<Scenario[]>([]);
  const currentScenario = ref<Scenario>();

  loadUserSessionFromLocalStorage();

  const setCurrentState = (
    _correctScenarios: Scenario[],
    _incorrectScenarios: IncorrectScenario[],
    _visibleScenarios: Scenario[],
    _currentScenario: Scenario,
  ) => {
    correctScenarios.value = _correctScenarios;
    incorrectScenarios.value = _incorrectScenarios;
    visibleScenarios.value = _visibleScenarios;
    currentScenario.value = _currentScenario;
    saveUserSessionToLocalStorage();
  };

  function saveUserSessionToLocalStorage() {
    localStorage.setItem(
      LOCAL_USER_SESSION_STORAGE_KEY,
      JSON.stringify({
        correctScenarios: correctScenarios.value,
        incorrectScenarios: incorrectScenarios.value,
        visibleScenarios: visibleScenarios.value,
        currentScenario: currentScenario.value,
      }),
    );
  }

  function loadUserSessionFromLocalStorage() {
    const data = localStorage.getItem(LOCAL_USER_SESSION_STORAGE_KEY);
    if (data) {
      const session: UserSession = JSON.parse(data);
      correctScenarios.value = session.correctScenarios;
      incorrectScenarios.value = session.incorrectScenarios;
      visibleScenarios.value = session.visibleScenarios;
      currentScenario.value = session.currentScenario;
    }
  }

  function clearUserSession() {
    correctScenarios.value = [];
    incorrectScenarios.value = [];
    visibleScenarios.value = [];
    currentScenario.value = undefined;
    saveUserSessionToLocalStorage();
  }

  return {
    correctScenarios,
    incorrectScenarios,
    visibleScenarios,
    currentScenario,
    setCurrentState,
    clearUserSession,
  };
});
