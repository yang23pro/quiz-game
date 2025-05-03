let players = [];
let scores = [];
let currentPlayerIndex = 0;
let currentRound = 1;
let totalRounds = 0;
let questions = [];

function startGame() {
  const namesInput = document.getElementById("playerNames").value.trim();
  const roundsInput = parseInt(document.getElementById("rounds").value);

  if (!namesInput || isNaN(roundsInput) || roundsInput < 1) {
    alert("Please enter player names and a valid number of rounds.");
    return;
  }

  players = namesInput.split("\n").map(name => name.trim()).filter(Boolean);
  scores = Array(players.length).fill(0);
  totalRounds = roundsInput;

  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";

  fetchQuestions();
}

function fetchQuestions() {
  const amount = totalRounds * players.length;
  fetch(`https://corsproxy.io/?https://opentdb.com/api.php?amount=${amount}&type=multiple`)
    .then(response => response.json())
    .then(data => {
      questions = data.results;
      askQuestion();
    })
    .catch(error => {
      console.error("Failed to fetch questions:", error);
      alert("Error fetching questions. Try again.");
    });
}

function askQuestion() {
  if ((currentRound - 1) * players.length + currentPlayerIndex >= questions.length) {
    endGame();
    return;
  }

  const q = questions[(currentRound - 1) * players.length + currentPlayerIndex];
  const correctAnswer = q.correct_answer;
  const allAnswers = [...q.incorrect_answers, correctAnswer];
  shuffle(allAnswers);

  document.getElementById("question").innerHTML = `${players[currentPlayerIndex]}'s Turn:<br>${decodeHTML(q.question)}`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";
  allAnswers.forEach(answer => {
    const btn = document.createElement("button");
    btn.textContent = decodeHTML(answer);
    btn.onclick = () => handleAnswer(answer === correctAnswer);
    choicesDiv.appendChild(btn);
  });

  updateScoreboard();
}

function handleAnswer(isCorrect) {
  if (isCorrect) {
    scores[currentPlayerIndex]++;
    document.getElementById("status").innerText = "Correct!";
  } else {
    document.getElementById("status").innerText = "Wrong!";
  }

  currentPlayerIndex++;

  if (currentPlayerIndex >= players.length) {
    currentPlayerIndex = 0;
    currentRound++;
  }

  setTimeout(() => {
    document.getElementById("status").innerText = "";
    if ((currentRound - 1) * players.length + currentPlayerIndex < questions.length) {
      askQuestion();
    } else {
      endGame();
    }
  }, 1000);
}

function endGame() {
  document.getElementById("game").style.display = "none";
  document.getElementById("final").style.display = "block";

  const results = players.map((name, index) => ({ name, score: scores[index] }));
  results.sort((a, b) => b.score - a.score);

  let html = "<h3>Final Scores:</h3><ul>";
  results.forEach(p => {
    html += `<li>${p.name}: ${p.score}</li>`;
  });
  html += "</ul>";

  html += `<h3>🎉 Winner: ${results[0].name} 🎉</h3>`;

  document.getElementById("finalScoreboard").innerHTML = html;
}

function updateScoreboard() {
  let text = "Scores: ";
  players.forEach((name, index) => {
    text += `${name} (${scores[index]}) `;
  });
  document.getElementById("scoreboard").innerText = text;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
