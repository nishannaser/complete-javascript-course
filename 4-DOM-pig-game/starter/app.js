/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, currentScore, activePlayer;

scores = [0, 0];
activePlayer = 0;
currentScore = 0;


// Hide dice upon game start
document.querySelector('.dice').style.display = 'none';

document.querySelector('.btn-roll').addEventListener('click', function () {

    // Make dice visible
    document.querySelector('.dice').style.display = 'block';

    // Get the dice value
    var diceValue = Math.floor(Math.random() * 6) + 1;

    // Set the correct dice image
    document.querySelector('.dice').src = 'dice-' + diceValue + '.png';

    // Update current score
    currentScore += diceValue;
    if (diceValue === 1) {
        currentScore = 0;
        resetGame();
    } else {
        document.querySelector('#current-' + activePlayer).textContent = currentScore;
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    resetGame();
});

function resetGame() {
    scores[activePlayer] += currentScore;
    currentScore = 0;
    document.querySelector('#current-0').textContent = 0;
    document.querySelector('#current-1').textContent = 0;
    document.querySelector('#score-0').textContent = scores[0];
    document.querySelector('#score-1').textContent = scores[1];
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    activePlayer = activePlayer ? 0 : 1;
    document.querySelector('.dice').style.display = 'none';
}