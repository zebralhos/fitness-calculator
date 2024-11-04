// Função para calcular BMR
function calculateBMR() {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
  
    if (!weight || !height || !age) {
      alert("Preencha todos os campos!");
      return;
    }
  
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
  
    document.getElementById("bmr-result").innerText = `Seu BMR é: ${bmr.toFixed(2)} kcal`;
    localStorage.setItem("userBMR", bmr); // Armazenar o BMR calculado
  }
  
  // Variáveis para rastrear calorias e pesos
  let dailyCalories = JSON.parse(localStorage.getItem("dailyCalories")) || [];
  let monthlyWeights = JSON.parse(localStorage.getItem("monthlyWeights")) || [];
  
  // Função para adicionar calorias
  function addCalories() {
    const calories = parseFloat(document.getElementById("calories").value);
  
    if (!calories) {
      alert("Por favor, insira uma quantidade válida de calorias.");
      return;
    }
  
    const date = new Date().toLocaleDateString();
    dailyCalories.push({ date, calories });
    localStorage.setItem("dailyCalories", JSON.stringify(dailyCalories));
    updateCalorieChart();
    document.getElementById("calories").value = "";
  }
  
  // Configuração do Gráfico de Calorias
  const calorieCtx = document.getElementById("calorieChart").getContext("2d");
  let calorieChart;
  
  function updateCalorieChart() {
    const dates = dailyCalories.map(entry => entry.date);
    const caloriesData = dailyCalories.map(entry => entry.calories);
    const bmr = parseFloat(localStorage.getItem("userBMR")) || 0;
  
    if (calorieChart) {
      calorieChart.destroy();
    }
  
    calorieChart = new Chart(calorieCtx, {
      type: "bar",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Calorias Consumidas",
            data: caloriesData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
          {
            label: "Défice Calórico (BMR)",
            data: Array(dates.length).fill(bmr),
            backgroundColor: "rgba(255, 99, 132, 0.4)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 500
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          }
        }
      }
    });
  }
  
  // Função para adicionar peso mensal
  function addWeight() {
    const weight = parseFloat(document.getElementById("monthly-weight").value);
  
    if (!weight) {
      alert("Por favor, insira um peso válido.");
      return;
    }
  
    const month = new Date().toLocaleString("default", { month: "long" });
    monthlyWeights.push({ month, weight });
    localStorage.setItem("monthlyWeights", JSON.stringify(monthlyWeights));
    displayWeights();
    document.getElementById("monthly-weight").value = "";
  }
  
  // Exibe o histórico de peso mensal
  function displayWeights() {
    const weightRecords = document.getElementById("weight-records");
    weightRecords.innerHTML = "Histórico de Peso:<br>" + monthlyWeights
      .map(entry => `${entry.month}: ${entry.weight} kg`)
      .join("<br>");
  }
  
  // Inicializa o gráfico e exibe dados salvos
  window.onload = function() {
    updateCalorieChart();
    displayWeights();
  };
  