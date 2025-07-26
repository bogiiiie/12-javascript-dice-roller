// ===================================
// DICE ROLLING APPLICATION
// ===================================

// ===== INITIALIZATION & DOM ELEMENTS =====

// Set current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear();

// Control elements
const restartBtn = document.getElementById(`btn-restart`);
const rollDiceBtn = document.getElementById(`btn-roll-dice`);
const rollDiceBtnIcon = document.getElementById(`roll-dice-btn-icon`);
const rollDiceBtnText = document.getElementById(`roll-dice-btn-text`);
const rollDiceBtnOriginalText = rollDiceBtnText.textContent;

// Dice configuration elements
const diceCountSelect = document.getElementById(`dice-count-select`);
const diceTypeSelect = document.getElementById(`dice-type-select`);

// Display elements
const diceContainer = document.getElementById(`dice-container`);
const totalSum = document.getElementById(`total-sum`);
const individualRolls = document.getElementById(`individual-rolls`);
const individualRollsValues = document.getElementById(`rolls-values`);
const gameStatus = document.getElementById(`game-status`);
const rollsLabel = document.getElementById(`rolls-label`);
const rollHistoryList = document.getElementById(`roll-history-list`);

// Statistics display elements
const totalRollsValue = document.getElementById(`total-rolls-value`);
const lastSumValue = document.getElementById(`last-sum-value`);
const averageValue = document.getElementById(`average-value`);
const highestValue = document.getElementById(`highest-value`);

// ===== GLOBAL VARIABLES =====

let diceCountValue = diceCountSelect.value;
let diceTypeValue = diceTypeSelect.value;
let rollSets = []; // Store all roll results
let diceTypeRollSets = []; // Store dice types for each roll
let highestSumOfRoll = 0; // Track highest sum achieved

// Dice face values (for reference)
const d4 = [1, 2, 3, 4];
const d6 = [1, 2, 3, 4, 5, 6];

// ===== CORE DICE FUNCTIONS =====

/**
 * Generates a random number based on dice type
 * @param {string} diceType - Either 'd4' or 'd6'
 * @returns {number} Random number within dice range
 */
function randomDiceDigit(diceType) { 
    if(diceType == `d6`) {
        return Math.floor(Math.random() * 6 + 1);
    } else if(diceType == `d4`) {
        return Math.floor(Math.random() * 4 + 1);
    }
}

/**
 * Rolls multiple dice of specified type
 * @param {number} diceCount - Number of dice to roll
 * @param {string} diceType - Type of dice (d4 or d6)
 * @returns {Array} Array of rolled values
 */
function rollDice(diceCount, diceType) {
    let diceRolls = [];

    for(i = 0; i < diceCount; i++) {
        diceRolls.push(randomDiceDigit(diceType));
    }

    return diceRolls;
}

// ===== DISPLAY FUNCTIONS =====

/**
 * Clears all dice from the container
 */
function clearDiceContainer(){
    diceContainer.innerHTML = ``;
}

/**
 * Shows placeholder dice with question marks
 * @param {number} diceCount - Number of skeleton dice to show
 */
function showDiceSkeleton(diceCount) {
    const diceSkeletorContent = `
        <div class="dice dice-skeleton dice-item flex justify-center items-center w-20 h-20 bg-white rounded-xl shadow-2xl ring ring-gray-500" data-value="0">
            <i class="fa-solid fa-question text-4xl" aria-hidden="true"></i>
        </div>`
    
    clearDiceContainer();

    for(i = 0; i < diceCount; i++) {
        diceContainer.insertAdjacentHTML(`beforeend`, diceSkeletorContent);
    }
}

/**
 * Updates dice display with actual rolled values
 * @param {Array} currentRollSet - Array of rolled dice values
 */
function digitizedDice(currentRollSet) {
    let diceItems = document.querySelectorAll(`.dice-item`);
    let diceIndex = 0;
    
    diceItems.forEach((dice) => {
        let currentDiceType = diceTypeSelect.value;
        let currentDiceDigit = currentRollSet[diceIndex];
        let rollDiceDigitImage = `<img src="images/Dice-${currentDiceDigit}.png" class="dice-image brightness-0" alt="Die showing ${currentDiceDigit}">`

        dice.innerHTML = ``;
        dice.classList.remove(`dice-skeleton`);
        dice.setAttribute(`data-value`, currentDiceType);
        dice.insertAdjacentHTML(`beforeend`, rollDiceDigitImage);

        diceIndex++;
    })
}

/**
 * Creates rolling animation effect
 * @returns {Promise} Resolves when animation is complete
 */
function rollingDiceProcess() {
    return new Promise((resolve) => {
        // Update button to show rolling state
        rollDiceBtnText.textContent = `Rolling...`
        rollDiceBtnIcon.classList.remove(`fa-dice`);
        rollDiceBtnIcon.classList.add(`fa-spinner`, `animate-spin`);
        
        // Add spinning animation to dice
        let diceItems = document.querySelectorAll(`.dice-item`);
        diceItems.forEach((element) => element.classList.add(`animate-spin`));
        
        // Reset after 1 second
        setTimeout(() => {
            rollDiceBtnText.textContent = rollDiceBtnOriginalText;
            rollDiceBtnIcon.classList.add(`fa-dice`);
            rollDiceBtnIcon.classList.remove(`fa-spinner`, `animate-spin`);
            diceItems.forEach((element) => {
                element.classList.remove(`animate-spin`);
            });
            resolve();
        }, 1000)
    })
}

// ===== HISTORY & STATISTICS FUNCTIONS =====

/**
 * Adds the latest roll to the history list
 */
function displayHistoryListItem() {
    let lastRolledIndex = rollSets.length - 1;
    let currentRollSet = rollSets[lastRolledIndex];
    let sum = sumOfDice(currentRollSet);
    let currentRollItem = `
        <li id="history-item-${lastRolledIndex}" class="history-item bg-gray-100/12 text-gray-300 font-medium rounded-md py-2 px-3 flex justify-between" role="listitem">
            <span class="history-roll-details text-gray-300">${diceTypeRollSets[lastRolledIndex].toUpperCase()}: [${currentRollSet.join(`, `)}]</span>
            <span class="history-roll-sum text-white" aria-label="Sum: ${sum}">${sum}</span>
        </li>`

    rollHistoryList.insertAdjacentHTML(`beforeend`, currentRollItem);
}

/**
 * Calculates sum of dice array
 * @param {Array} diceArray - Array of dice values
 * @returns {number} Sum of all dice values
 */
function sumOfDice(diceArray) {
    return diceArray.reduce((accumulator, value) => accumulator + value);
}

/**
 * Calculates average of dice values
 * @param {Array} diceArray - Array of dice values
 * @returns {string} Average rounded to 2 decimal places
 */
function averageOfDiceDigit(diceArray) {
    return (sumOfDice(diceArray) / diceArray.length).toFixed(2);
}

/**
 * Updates all statistics displays
 * @param {Array} diceArray - Current roll results
 */
function displayStatistics(diceArray) {
    let totalRolls = diceArray.length;
    let lastSum = diceArray.reduce((accumulator, value) => accumulator + value);
    let average = lastSum / totalRolls;
    
    // Update highest sum if current sum is greater
    highestSumOfRoll = (lastSum > highestSumOfRoll) ? lastSum : highestSumOfRoll;

    // Show individual rolls, hide game status
    individualRolls.classList.remove(`hidden`);
    gameStatus.classList.add(`hidden`);
    
    // Update all statistics displays
    totalRollsValue.textContent = totalRolls;
    lastSumValue.textContent = lastSum;
    averageValue.textContent = average;
    highestValue.textContent = highestSumOfRoll;
    totalSum.textContent = lastSum;
    individualRollsValues.textContent = diceArray.join(`, `);
}

// ===== RESET FUNCTIONS =====

/**
 * Resets all statistics to zero
 */
function resetStatistics() {
    totalRollsValue.textContent = 0;
    lastSumValue.textContent = 0;
    averageValue.textContent = 0;
    highestValue.textContent = 0;
    totalSum.textContent = 0;
}

/**
 * Resets game status display
 */
function resetGameStatus() {
    individualRollsValues.textContent = null;
    individualRolls.classList.add(`hidden`);
    gameStatus.classList.remove(`hidden`);
    individualRollsValues.textContent = null;
}

/**
 * Clears roll history and resets arrays
 */
function resetHistoryList() {
    rollHistoryList.innerHTML = ``;
    rollSets = [];
    diceTypeRollSets = [];
    highestSumOfRoll = 0; // Reset highest sum
}

// ===== EVENT LISTENERS =====

/**
 * Handle dice count selection change
 */
diceCountSelect.addEventListener(`change`, function() {
    diceCountValue = diceCountSelect.value;
    showDiceSkeleton(diceCountValue);
    resetGameStatus();
    resetStatistics();
})

/**
 * Handle dice type selection change
 */
diceTypeSelect.addEventListener(`change`, function() {
    diceTypeValue = diceTypeSelect.value;
    showDiceSkeleton(diceCountValue);
    resetGameStatus();
    resetStatistics();
})

/**
 * Main dice rolling function - handles the complete roll process
 */
rollDiceBtn.onclick = async function() {
    // Get current settings
    diceCountValue = diceCountSelect.value;
    diceTypeValue = diceTypeSelect.value;
    
    // Roll the dice
    let currentRollSet = rollDice(diceCountValue, diceTypeValue);

    // Store results
    rollSets.push(currentRollSet);
    diceTypeRollSets.push(diceTypeValue);
    console.log(rollSets[rollSets.length - 1], diceTypeRollSets[diceTypeRollSets.length - 1])

    // Execute rolling animation and update displays
    await rollingDiceProcess()
    digitizedDice(currentRollSet);
    displayHistoryListItem();
    displayStatistics(currentRollSet);
}

/**
 * Reset everything to initial state
 */
restartBtn.onclick = function() {
    resetStatistics();
    resetGameStatus();
    resetHistoryList();
    showDiceSkeleton(1);
}

// ===== INITIAL SETUP =====

// Show initial dice skeleton
showDiceSkeleton(diceCountValue);