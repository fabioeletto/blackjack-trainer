export interface Scenario {
    playerHand: string;
    dealerCard: string;
    correctAction: string;
}
  
export interface IncorrectScenario extends Scenario {
    userChoice: string;
}
  
export type UserChoice = 'Hit' | 'Stand' | 'Double' | 'Split';

export interface UserSession {
    correctScenarios: Scenario[];
    incorrectScenarios: IncorrectScenario[];
    visibleScenarios: Scenario[];
    currentScenario: Scenario;
}