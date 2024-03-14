import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import {
    getCellElementAtIdx,
    getCellElementList,
    getGameStatusElement,
    getCurrentTurnElement,
    getReplayGameElement,
} from './selectors.js'
import { checkGameStatus } from './utils.js';

/**
 * Global variables
 */
console.log(getCellElementList())
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toggleTurn() {


    //toggle turn
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

    //update turn on DOM element
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS)
        currentTurnElement.classList.add(currentTurn)
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;

    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) gameStatusElement.textContent = newGameStatus;


};

function showReplayButton() {
    const replayGameButton = getReplayGameElement();

    if (replayGameButton) replayGameButton.classList.add('show')


};

function hideReplayButton() {
    const replayGameButton = getReplayGameElement();

    if (replayGameButton) replayGameButton.classList.remove('show')


};

function highlighWinCell(winPosition) {
    if (!Array.isArray(winPosition) || winPosition.length !== 3) {
        throw new Error('SAI CMMR')
    }

    for (const position of winPosition) {
        const cell = getCellElementAtIdx(position)
        if (cell) cell.classList.add('win');
    }


};

function handleCellClick(cell, index) {
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS)
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
    if (isClicked || isEndGame) return;

    //set selected cell
    cell.classList.add(currentTurn)

    //update cellValues
    cellValues[index] = currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

    //toggle turn
    toggleTurn()

    //check game status
    const game = checkGameStatus(cellValues)
    switch (game.status) {
        case GAME_STATUS.ENDED: {
            updateGameStatus(game.status)
            showReplayButton()
            break;
        }

        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            updateGameStatus(game.status)
            showReplayButton()
            highlighWinCell(game.winPositions)

            break;
        }


        default:
        // PLAYING

    }
}

function initCellElementList() {
    const cellElementList = getCellElementList()
    cellElementList.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(cell, index))
    })
}

function resetGame() {
    // reset temp global vars
    currentTurn = TURN.CROSS
    gameStatus = GAME_STATUS.PLAYING
    cellValues = cellValues.map(() => '');

    // reset dom elements
    // reset game status
    updateGameStatus(GAME_STATUS.PLAYING)

    // reset currnt turn
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS)
        currentTurnElement.classList.add(TURN.CROSS)
    }

    // reset game board
    const cellElementList = getCellElementList()
    for (const cellElement of cellElementList) {
        cellElement.className = ''
    }

    // hide replay button
    hideReplayButton()
}

function initReplayButton() {
    const replayButton = getReplayGameElement()
    if (!replayButton) return;

    replayButton.addEventListener('click', resetGame)
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    initCellElementList();
    initReplayButton();
})()
