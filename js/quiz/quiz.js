var score = 0;
var currentQuestion = 0;
var time = 0;
var timer = null;
var quizEl = document.getElementById('quiz');
var startBtnEl = document.createElement('button');
var counterEl = document.createElement('div');
var timeEl = document.createElement('div');
var scoreEl = document.createElement('div');
var questionEl = document.createElement('h2');
var answersEl = document.createElement('ol');
var verdictEl = document.createElement('p');
var nextBtnEl = document.createElement('button');
var againBtnEl = document.createElement('button');
var linkEl = document.createElement('link');

var questions = [
    {
        question: 'Minä vuonna JavaScript julkaistiin?',
        answers: {
            a: '1980',
            b: '1985',
            c: '1995'
        },
        correctAnswer: 'c'
    },
    {
        question: 'Missä yrityksessä JavaScript kehitettiin?',
        answers: {
            a: 'Netscape',
            b: 'Microsoft',
            c: 'Apple'
        },
        correctAnswer: 'a'
    }
];

var verdicts = [
    {
        minScore: 2,
        text: 'Olet todellinen JavaScript-guru!'
    },
    {
        minScore: 1,
        text: 'Ihan kiva, mutta et ole vielä guru.'
    },
    {
        minScore: 0,
        text: 'Olet kyllä aika toivoton tapaus! Ei muuta ku opiskele lisää.'
    }
];

/**
 * Creates the start button and appens it to DOM.
 */
function init() {
    // Set button texts
    startBtnEl.textContent = 'Aloita';
    againBtnEl.textContent = 'Uudestaan';

    // Add function to startBtnEl click event
    startBtnEl.onclick = function() {
        //console.log('Pitäs alottaa tietovisa');
        startQuiz();
    };

    // Again button click handler
    againBtnEl.onclick = function() {
        score = 0;
        currentQuestion = 0;
        time = 0;
        questionEl.style.display = 'block';
        answersEl.style.display = 'block';
        quizEl.innerHTML = '';
        startQuiz();
    };

    // Sanotaan quizEl-elementille, että me halutaan lisätä sen sisään 
    // uusi elementti startBtnEl. Tämä tehdään appendChild-metodilla.
    quizEl.appendChild(startBtnEl);
}

/**
 * Appends all needed elements to DOM and starts the quiz.
 */
function startQuiz() {
    // Hide start button
    startBtnEl.style.display = 'none';

    // Set next question button text
    nextBtnEl.textContent = 'Seuraava kysymys';

    // Append needed elements to DOM
    quizEl.appendChild(counterEl);
    quizEl.appendChild(timeEl);
    quizEl.appendChild(scoreEl);
    quizEl.appendChild(questionEl);
    quizEl.appendChild(answersEl);
    quizEl.appendChild(verdictEl);
    quizEl.appendChild(nextBtnEl);

    updateScore();
    updateQuestion();
    updateTime();

    // Next question button click handler
    nextBtnEl.onclick = function() {
        currentQuestion += 1;
        updateQuestion();
    };

    // Set timer for displaying time
    timer = setInterval(updateTime, 1000);
}

/**
 * Updates current score to scoreEl text content.
 */
function updateScore() {
    scoreEl.textContent = 'Pisteet: ' + score;
}

/**
 * Updates time to timeEl.
 */
function updateTime() {
    // Convert time to format HH:MM:SS
    var hours = Math.floor(time / 60 / 60);
    var minutes = Math.floor(time / 60) - (hours * 60);
    var seconds = time % 60;

    // Update timeEl content
    timeEl.textContent = 'Aika: ' + padStartZero(hours) + ':' + padStartZero(minutes) + ':' + padStartZero(seconds);

    // Increment time
    time++;
}

/**
 * Adds a leading zero if the number is smaller than 10.
 * @param   {number}    i
 * @returns {number|string}
 */
function padStartZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

/**
 * Updates current question and answers to DOM.
 */
function updateQuestion() {
    // Hide next question button
    nextBtnEl.style.display = 'none';

    // Check if we've answered the last question already
    if (currentQuestion == questions.length) {
        // Last question answered already, do not proceed
        finalVerdict();
        return;
    }

    // Clear and enable answersEl
    answersEl.innerHTML = '';
    answersEl.classList.remove('disabled');

    // Clear verdictEl text
    verdictEl.textContent = '';

    // Update counterEl content
    counterEl.textContent = 'Kysymys ' + (currentQuestion + 1) + ' / ' + questions.length;

    // Get question from questions array
    questionEl.textContent = questions[currentQuestion].question;

    // Loop through answers
    for (var i in questions[currentQuestion].answers) {
        //console.log(i + ': ' + questions[0].answers[i]);
        // Create new li element for this answer
        var liEl = document.createElement('li');
        liEl.textContent = questions[currentQuestion].answers[i];
        liEl.dataset.letter = i;

        // Add li element click event handler
        liEl.onclick = function() {
            //console.log(this.dataset.letter + ': ' + this.textContent);
            // Check answer only if not already answered
            if (! answersEl.classList.contains('disabled')) {
                checkAnswer(this);
            }
        };

        // Append answer li element to answerEl ol
        answersEl.appendChild(liEl);
    }
}

/**
 * Checks the answer and displays right/wrong.
 * @param   {object}    answerLi 
 */
function checkAnswer(answerLi) {
    if (answerLi.dataset.letter == questions[currentQuestion].correctAnswer) {
        //console.log('Oikein!');
        score += 1;
        updateScore();
        verdictEl.textContent = 'Oikein!';
        answerLi.classList.add('correct');
    } else {
        //console.log('Väärin!');
        verdictEl.textContent = 'Väärin :(';
        answerLi.classList.add('wrong');
    }

    // Disable answers list
    answersEl.classList.add('disabled');

    // Show next question button
    nextBtnEl.style.display = 'block';

    // Clear timer and change button text if this was the last question
    if (currentQuestion == questions.length - 1) {
        clearInterval(timer);
        nextBtnEl.textContent = 'Näytä tuomio';
    }
}

/**
 * Displays the final verdict after all questions have been answered.
 */
function finalVerdict() {
    // Hide stuff
    questionEl.style.display = 'none';
    answersEl.style.display = 'none';

    verdictEl.textContent = 'Sait ' + score + ' / ' + questions.length + ' pistettä. ';

    // Loop through verdicts
    for (var i in verdicts) {
        if (score  >= verdicts[i].minScore) {
            // Right verdict found, get it's text and terminate loop
            verdictEl.textContent += verdicts[i].text;
            break;
        }
    }

    // Append again button to DOM
    quizEl.appendChild(againBtnEl);
}

// Append link element to document head to link quiz stylesheet
linkEl.rel = 'stylesheet';
linkEl.href = quizEl.dataset.path + 'quiz.css';

// Just testing
linkEl.onload = function() {
    console.log('quiz.css loaded!');
};

document.head.appendChild(linkEl);

// Go!
init();
