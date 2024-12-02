let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

async function startQuiz() {
    // Hide menu and show quiz
    document.getElementById('menu').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';

    // Get quiz settings
    const numQuestions = document.getElementById('numQuestions').value;
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;

    // Fetch quiz data from API
    const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=${type}`;
    const response = await fetch(url);
    const data = await response.json();
    quizData = data.results;

    // Initialize score and start timer
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById('score').innerText = `Pisteet: ${score}`;
    timeLeft = 30; // Reset timer
    document.getElementById('timeLeft').innerText = timeLeft;
    startTimer();

    // Show the first question
    showQuestion();
}

function showQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const feedbackElement = document.getElementById('feedback');

    // Clear previous feedback
    feedbackElement.innerText = '';

    // Set the question text
    questionElement.innerText = currentQuestion.question;

    // Clear previous answers
    answersElement.innerHTML = '';

    // Add answer buttons
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    allAnswers.sort(() => Math.random() - 0.5); // Shuffle answers
    allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('answer');
        button.innerText = answer;
        button.onclick = () => handleAnswerClick(answer);
        answersElement.appendChild(button);
    });
}

function handleAnswerClick(answer) {
    const currentQuestion = quizData[currentQuestionIndex];
    const feedbackElement = document.getElementById('feedback');

    // Stop the timer before processing the answer
    clearInterval(timer);

    if (answer === currentQuestion.correct_answer) {
        score++;
        feedbackElement.innerText = 'Oikein!';
    } else {
        feedbackElement.innerText = 'Väärin!';
    }

    // Update score
    document.getElementById('score').innerText = `Pisteet: ${score}`;

    // Move to the next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
            timeLeft = 30; // Reset timer for next question
            document.getElementById('timeLeft').innerText = timeLeft;
            startTimer(); // Start timer again
        } else {
            endQuiz();
        }
    }, 1000);
}

function startTimer() {
    // Update timer every second
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').innerText = timeLeft;

        if (timeLeft <= 0) {
            // Time's up, move to next question
            clearInterval(timer);
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                showQuestion();
                timeLeft = 30; // Reset timer for next question
                document.getElementById('timeLeft').innerText = timeLeft;
                startTimer(); // Start timer again
            } else {
                endQuiz();
            }
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timer); // Stop the timer

    // Show final score
    alert(`Tietovisa on päättynyt! Pisteesi: ${score}`);
    document.getElementById('menu').style.display = 'block'; // Show menu again
    document.getElementById('quiz').style.display = 'none'; // Hide quiz
}
