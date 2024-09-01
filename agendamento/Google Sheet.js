const scriptURL ="https://script.google.com/macros/s/AKfycbzEDOu7dFI2mE79PeniKjgyoQjx0A9l7iNU5CdNjf6HC1yvcCo7XKVFlKISnB89C2ntTQ/exec";
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

  // Define a classe com base no tipo de mensagem
  messageElement.className = "feedback-message " + type;
  messageElement.textContent = message;

  // Exibe o container
  container.style.display = "block";

  // Oculta o container após 5 segundos
  setTimeout(() => {
    container.style.display = "none";
  }, 5000);
}

// Enviar formulário
form.addEventListener("submit", async (e) => {
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

  const formData = new FormData(form);
  formData.set("Nome", nome);
  formData.set("Psicólogo", psicologo);

  fetch(scriptURL, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.result === "success") {
        showFeedback(
          "Obrigado, seu cadastro foi adicionado, fique de olho na data!",
          "success"
        );
      } else if (
        result.result === "error" &&
        result.message === "agendamento duplicado"
      ) {
        showFeedback(
          "Este agendamento já foi feito. Por favor, selecione outro horário.",
          "warning"
        );
      } else {
        showFeedback("Erro: " + result.message, "error");
      }
      form.reset();
    })
    .catch((error) => {
      console.error("Error!", error.message);
      showFeedback(
        "Houve um erro ao enviar os dados. Tente novamente mais tarde.",
        "error"
      );
    })
    .finally(() => {
      loading.style.display = "none";
    });
});

// Carregar psicólogos da planilha específica
document.addEventListener("DOMContentLoaded", function () {
  const url ="https://script.google.com/macros/s/AKfycbzLfkjIH-djQRwMhngOwnzrFYa4M0ZiPJReD6BH8YbCiRaJAd7DjUdQ_UN8-IGmf-0m/exec"; // URL do Apps Script da planilha "Colaboradores"

  const select = document.querySelector('select[name="Psicólogo"]');

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option[0];
        opt.textContent = option[0];
        select.appendChild(opt);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar dados do Google Sheets:", error);
    });

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");

  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });

  const dataInput = form.querySelector('input[name="Data"]');
  const dataAtual = new Date().toISOString().split("T")[0];
  dataInput.setAttribute("min", dataAtual);
});
