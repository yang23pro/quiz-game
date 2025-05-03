let players = [];
let scores = [];
let currentPlayerIndex = 0;
let currentRound = 1;
let totalRounds = 0;
let questions = [];
let correctAnswer = "";

function startGame() {
  const namesInput = document.getElementById("playerNames").value.trim();
  if (!namesInput) return alert("Please enter player names.");
  
  players = namesInput.split(",").map(name => name.trim());
  scores = new Array(players.length).fill(0);
  totalRounds = parseInt(document.getElementById("rounds").value);
  
  if (!totalRounds || totalRounds < 1) return alert("Enter valid number of rounds.");

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";

  fetchQuestions();
}

function fetchQuestions() {
  const totalQuestions = players.length * totalRounds;
  fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      askQuestion();
    });
}

function askQuestion() {
  const questionObj = questions[(currentRound - 1) * players.length + currentPlayerIndex];
  correctAnswer = questionObj.correct_answer;

  document.getElementById("question").innerHTML = decodeHTML(questionObj.question);
  document.getElementById("roundCounter").innerText = `Round ${currentRound} of ${totalRounds}`;
  document.getElementById("currentPlayer").innerText = `Player: ${players[currentPlayerIndex]}`;
  document.getElementById("status").innerText = "";

  const choices = [...questionObj.incorrect_answers, correctAnswer]
    .map(decodeHTML)
    .sort(() => Math.random() - 0.5);

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  choices.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => handleAnswer(answer === decodeHTML(correctAnswer));
    choicesDiv.appendChild(btn);
  });
}

function handleAnswer(isCorrect) {
  const status = document.getElementById("status");

  if (isCorrect) {
    scores[currentPlayerIndex]++;
    status.innerText = "Correct!";
    status.style.color = "green";
  } else {
    status.innerText = "Wrong!";
    status.style.color = "red";
  }

  setTimeout(() => {
    status.innerText = "";
    status.style.color = "";
    nextTurn();
  }, 1000);
}

function nextTurn() {
  currentPlayerIndex++;
  if (currentPlayerIndex >= players.length) {
    currentPlayerIndex = 0;
    currentRound++;
  }

  const totalTurns = players.length * totalRounds;
  const currentTurn = (currentRound - 1) * players.length + currentPlayerIndex;

  if (currentTurn < totalTurns) {
    askQuestion();
  } else {
    endGame();
  }
}

function endGame() {
  document.getElementById("game").style.display = "none";
  document.getElementById("result").style.display = "block";

  const scoreboard = document.getElementById("scoreboard");
  scoreboard.innerHTML = players
    .map((player, i) => `<li><strong>${player}</strong>: ${scores[i]} points</li>`)
    .join("");
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
