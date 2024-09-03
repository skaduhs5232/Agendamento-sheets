const scriptURLPrincipal = "https://script.google.com/macros/s/AKfycbzEDOu7dFI2mE79PeniKjgyoQjx0A9l7iNU5CdNjf6HC1yvcCo7XKVFlKISnB89C2ntTQ/exec";
const form = document.forms["contact-form"];
const loading = document.getElementById("loading");

// Função para capitalizar a primeira letra de cada palavra
function capitalizeFirstLetter(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Função para mostrar mensagens de feedback
function showFeedback(message, type) {
  const container = document.getElementById("feedback-container");
  const messageElement = document.getElementById("feedback-message");

  messageElement.className = "feedback-message " + type;
  messageElement.textContent = message;

  container.style.display = "block";
  setTimeout(() => {
    container.style.display = "none";
  }, 5000);
}

// Função para agendar na planilha do psicólogo selecionado
async function agendarNaPlanilhaDoPsicologo() {
  const psicologoSelecionado = form.querySelector('select[name="Psicólogo"]').value.trim();
  
  try {
    // Buscar a URL correspondente ao psicólogo selecionado
    const response = await fetch("https://script.google.com/macros/s/AKfycbynMqCrcSvVt4Bfg2P77lqG_9YQu4BCRWnx4AS-_NceRHmizVItNgaXg0TJY2l3-w7l/exec");
    const data = await response.json();
    
    // Procurar pela URL correspondente ao psicólogo selecionado
    const entry = data.find(item => item.psicologo === psicologoSelecionado);
    if (!entry || !entry.url) {
      throw new Error("Não foi possível encontrar a URL correspondente ao psicólogo selecionado.");
    }
    
    const urlPsicologo = entry.url;

    // Enviar o agendamento para a planilha principal
    const formData = new FormData(form);
    formData.set("Nome", capitalizeFirstLetter(formData.get("Nome")));
    formData.set("Psicólogo", capitalizeFirstLetter(psicologoSelecionado));

    const responsePrincipal = await fetch(scriptURLPrincipal, {
      method: "POST",
      body: formData,
    });

    const resultPrincipal = await responsePrincipal.json();
    if (resultPrincipal.result !== "success") {
      throw new Error("Erro ao agendar na planilha principal: " + resultPrincipal.message);
    }

    // Enviar o agendamento para a planilha do psicólogo
    const responsePsicologo = await fetch(urlPsicologo, {
      method: "POST",
      body: formData,
    });

    const resultPsicologo = await responsePsicologo.json();
    if (resultPsicologo.result === "success") {
      showFeedback("Agendamento realizado com sucesso em ambas as planilhas!", "success");
    } else {
      showFeedback("Agendamento realizado na planilha principal, mas houve um erro na planilha do psicólogo: " + resultPsicologo.message, "warning");
    }
  } catch (error) {
    console.error("Erro:", error);
    showFeedback("Erro ao processar o agendamento. Tente novamente mais tarde.", "error");
  } finally {
    loading.style.display = "none";
  }
}

// Enviar formulário e agendar nas duas planilhas
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const dataInput = form.querySelector('input[name="Data"]').value;
  const dataSelecionada = new Date(dataInput);
  const dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0);

  if (dataSelecionada < dataAtual) {
    showFeedback("Por favor, selecione uma data futura.", "warning");
    return;
  }

  let nome = form.querySelector('input[name="Nome"]').value.trim();
  let psicologo = form.querySelector('select[name="Psicólogo"]').value.trim();
  const hora = form.querySelector('input[name="Hora"]').value.trim();

  nome = capitalizeFirstLetter(nome);
  psicologo = capitalizeFirstLetter(psicologo);

  loading.style.display = "flex";

  agendarNaPlanilhaDoPsicologo();
});

// Inicializa outras funcionalidades da página após o DOM carregar
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");

  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });

  const dataInput = form.querySelector('input[name="Data"]');
  const dataAtual = new Date().toISOString().split("T")[0];
  dataInput.setAttribute("min", dataAtual);

  // Carregar os psicólogos da planilha
  fetch("https://script.google.com/macros/s/AKfycbynMqCrcSvVt4Bfg2P77lqG_9YQu4BCRWnx4AS-_NceRHmizVItNgaXg0TJY2l3-w7l/exec")
    .then(response => response.json())
    .then(data => {
      const selectPsicologo = document.querySelector('select[name="Psicólogo"]');
      data.forEach(optionText => {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;
        selectPsicologo.appendChild(option);
      });
    })
    .catch(error => console.error("Erro ao carregar os dados:", error));
});
