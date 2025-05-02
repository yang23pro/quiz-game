let players = [];
let scores = [];
let currentPlayerIndex = 0;
let currentQuestion = {};
let questions = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "Berlin", "Madrid", "Rome"],
    answer: 0,
  },
  {
    question: "What is 5 + 7?",
    choices: ["10", "12", "14", "15"],
    answer: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    choices: ["Earth", "Venus", "Mars", "Jupiter"],
    answer: 2,
  }
];

function startGame() {
  const names = document.getElementById("playerNames").value.split(",");
  players = names.map(name => name.trim());
  scores = new Array(players.length).fill(0);
  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";
  nextQuestion();
}

function displayScores() {
  const board = document.getElementById("scoreBoard");
  board.innerHTML = "";
  players.forEach((name, i) => {
    const li = document.createElement("li");
    li.textContent = `${name}: ${scores[i]}`;
    board.appendChild(li);
  });
}

function nextQuestion() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("questionText").textContent = currentQuestion.question;
  document.getElementById("currentPlayer").textContent = players[currentPlayerIndex];
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  currentQuestion.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(i);
    choicesDiv.appendChild(btn);
  });
  displayScores();
}

function checkAnswer(choiceIndex) {
  if (choiceIndex === currentQuestion.answer) {
    scores[currentPlayerIndex]++;
    alert("Correct!");
  } else {
    alert("Wrong!");
  }
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  nextQuestion();
}

function endGame() {
  alert("Game Over! Final Scores:\n" +
    players.map((name, i) => `${name}: ${scores[i]}`).join("\n"));
  location.reload();
}
