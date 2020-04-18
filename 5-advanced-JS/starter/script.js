// Coding challenge : Interview questions

// IIFE
(function () {
    // Function Constructor
    function Question(question, answers, correctAnswer) {
        this.question = question;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    };

    // Prototype methods
    Question.prototype.showNextQuestion = function () {
        console.log(this.question);
        for (var i = 0; i < this.answers.length; i++) {
            console.log(i + ': ' + this.answers[i]);
        }
    };

    Question.prototype.checkAnswer = function (userAnswer, callback) {
        if (this.correctAnswer == userAnswer) {
            console.log('Correct answer!');
            callback(true);
        } else {
            console.log('Wrong answer! Try again please :)');
            callback(false);
        }
    };

    // Questions
    var question1 = new Question('What is the first planet?', ['Jupiter', 'Mercury', 'Venus'], 1);
    var question2 = new Question('Which is the biggest continent?', ['Asia', 'Africa', 'North America'], 0);
    var question3 = new Question('What is the colour of sky?', ['White', 'Blue', 'Grey'], 1);
    var allQuestions = [question1, question2, question3];

    var totalScore = 0;
    var questionNumber;
    while (true) {
        questionNumber = Math.floor(Math.random() * 3);
        allQuestions[questionNumber].showNextQuestion();
        var userAnswer = prompt('Enter your answer here');
        if (userAnswer === 'exit') {
            break;
        } else {
            allQuestions[questionNumber].checkAnswer(userAnswer, updateScore);
            displayScore(totalScore);
        }
    }

    function updateScore(isCorrect) {
        if (isCorrect) {
            totalScore++;
        }
    }

    function displayScore(score) {
        console.log('Your current score is: ' + score);
        console.log('========================================================');
    }
})();