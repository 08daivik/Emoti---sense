let chart = null;

const emojiMap = {
  joy: "😄", anger: "😠", fear: "😨", sadness: "😢", disgust: "🤢",
  surprise: "😲", neutral: "😐", shame: "😳"
};

function startApp() {
  document.getElementById("welcomePage").style.display = "none";
  document.getElementById("appPage").style.display = "block";
}

function predictEmotion() {
  const text = document.getElementById("inputText").value;
  document.getElementById("originalText").innerText = text;

  fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text })
  })
    .then((response) => response.json())
    .then((data) => {
      const { emotion, confidence, probabilities } = data;
      const emoji = emojiMap[emotion] || "💡";

      const predElem = document.getElementById("prediction");
      const confElem = document.getElementById("confidence");

      predElem.innerText = `Emotion: ${emotion} ${emoji}`;
      confElem.innerText = `Confidence: ${(confidence * 100).toFixed(2)}%`;

      predElem.classList.add("show");
      confElem.classList.add("show");

      if (chart !== null) {
        chart.destroy();
      }

      const ctx = document.getElementById("probabilityChart").getContext("2d");
      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(probabilities),
          datasets: [{
            label: "Probability",
            data: Object.values(probabilities),
            backgroundColor: Object.keys(probabilities).map((label) =>
              label === emotion ? "#f59e0b" : "#4b5563"
            ),
            borderRadius: 6
          }]
        },
        options: {
          animation: {
            duration: 800,
            easing: 'easeOutBounce'
          },
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: "#f8fafc" },
              grid: { color: "#374151" }
            },
            x: {
              ticks: { color: "#f8fafc" },
              grid: { color: "#374151" }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    })
    .catch((error) => {
      document.getElementById("prediction").innerText = "Error!";
      console.error("Error:", error);
    });
}
