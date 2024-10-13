import {GameState} from "./containers/sceneContainer/SceneContainer";

const MILLISECONDS_TO_WAIT_BEFORE_NEXT = 1000;

const INITIAL_GAME_STATE: GameState = {
  currentRound: 1,
  currentScore: 0,
  currentScene: 'menu',

  totalRounds: 10,
  colorMode: 'hex',

  isGameOver: false,
}


export {
  MILLISECONDS_TO_WAIT_BEFORE_NEXT,
  INITIAL_GAME_STATE
}

