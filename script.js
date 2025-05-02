let currentQuestion = 0;
let playerScores = {}; // Store players' scores
let totalPlayers = 0;

// Fetch trivia questions from Open Trivia Database API
function getQuestions() {
  fetch('https://opentdb.com/api.php?amount=10&type=multiple')
    .then(response => response.json())
    .then(data => {
      let questions = data.results;
      startGame(questions);
    })
    .catch(error => console.log("Error fetching questions:", error));
}

// Start the game and display questions
function startGame(questions) {
  const questionContainer = document.getElementById("question-container");
  const optionsContainer = document.getElementById("options-container");

  function displayQuestion() {
    if (currentQuestion < questions.length) {
      const question = questions[currentQuestion];
      const questionText = question.question;
      const options = [...question.incorrect_answers, question.correct_answer];
      const correctAnswer = question.correct_answer;

      // Shuffle the options
      options.sort(() => Math.random() - 0.5);

      // Clear previous question and options
      questionContainer.innerHTML = questionText;
      optionsContainer.innerHTML = '';

      // Create options
      options.forEach((option, index) => {
        const optionElement = document.createElement("button");
        optionElement.classList.add("option");
        optionElement.textContent = option;
        optionElement.onclick = () => checkAnswer(option, correctAnswer);
        optionsContainer.appendChild(optionElement);
      });
    }
  }

  function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
      updateScore(true);
    } else {
      updateScore(false);
    }

    // Move to next question
    currentQuestion++;
    displayQuestion();
  }

  function updateScore(isCorrect) {
    if (isCorrect) {
      playerScores[totalPlayers] = (playerScores[totalPlayers] || 0) + 1;
    }
  }

  displayQuestion();
}

// Start the game once the player count is set
document.getElementById("start-game").onclick = () => {
  totalPlayers = parseInt(document.getElementById("num-players").value, 10);
  getQuestions(); // Get questions from the API
};
