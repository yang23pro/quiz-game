let players = [];
let totalRounds = 0;
let currentRound = 0;
let currentPlayer = 0;
let questions = [];

function startGame() {
  const numPlayers = parseInt(document.getElementById("numPlayers").value);
  const roundsPerPlayer = parseInt(document.getElementById("roundsPerPlayer").value);
  totalRounds = numPlayers * roundsPerPlayer;

  // Init players
  players = [];
  for (let i = 0; i < numPlayers; i++) {
    players.push({ name: `Player ${i + 1}`, score: 0 });
  }

  // Hide setup, show game
  document.getElementById("setup").style.display = "none";
  document.getElementById("game").style.display = "block";

  // Get questions from API
  fetch(`https://opentdb.com/api.php?amount=${totalRounds}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      questions = data.results;
      showQuestion();
    })
    .catch(err => alert("Failed to load questions"));
}

function showQuestion() {
  if (currentRound >= totalRounds) {
    endGame();
    return;
  }

  const q = questions[currentRound];
  const allAnswers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

  document.getElementById("turnInfo").textContent = `${players[currentPlayer].name}'s Turn (Round ${Math.floor(currentRound / players.length) + 1})`;
  document.getElementById("question").innerHTML = q.question;
  
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  allAnswers.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => {
      if (ans === q.correct_answer) {
        players[currentPlayer].score++;
        alert("Correct!");
      } else {
        alert(`Wrong! Correct answer: ${q.correct_answer}`);
      }
      currentRound++;
      currentPlayer = currentRound % players.length;
      showQuestion();
    };
    answersDiv.appendChild(btn);
  });

  updateScoreboard();
}

function updateScoreboard() {
  const scoreboard = players.map(p => `${p.name}: ${p.score}`).join(" | ");
  document.getElementById("scoreboard").textContent = `Scores: ${scoreboard}`;
}

function endGame() {
  let highest = Math.max(...players.map(p => p.score));
  let winners = players.filter(p => p.score === highest).map(p => p.name);
  document.getElementById("question").textContent = `Game Over! Winner(s): ${winners.join(", ")}`;
  document.getElementById("answers").innerHTML = "";
}
