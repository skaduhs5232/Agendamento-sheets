const scriptURL =
  "https://script.google.com/macros/s/AKfycbzEDOu7dFI2mE79PeniKjgyoQjx0A9l7iNU5CdNjf6HC1yvcCo7XKVFlKISnB89C2ntTQ/exec";
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

// Função para carregar as opções no <select>
async function loadOptions() {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbynMqCrcSvVt4Bfg2P77lqG_9YQu4BCRWnx4AS-_NceRHmizVItNgaXg0TJY2l3-w7l/exec"
    );
    const data = await response.json();

    const selectElement = document.querySelector('select[name="Psicólogo"]');
    selectElement.innerHTML = ""; // Limpa as opções existentes

    data.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.url; // Atribui a URL como valor
      option.textContent = item.nome;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar as opções:", error);
  }
}

// Função para enviar o formulário
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
  let psicologo = form.querySelector('select[name="Psicólogo"]').value; // Agora contém a URL
  const hora = form.querySelector('input[name="Hora"]').value.trim();

  nome = capitalizeFirstLetter(nome);

  loading.style.display = "flex";

  const formData = new FormData(form);
  formData.set("Nome", nome);

  // Enviar para a planilha principal
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

  // Enviar para a planilha do colaborador selecionado
  if (psicologo) {
    fetch(psicologo, {
      // Aqui utilizamos a URL obtida do select
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(
          "Envio para a planilha do colaborador foi bem-sucedido:",
          result
        );
      })
      .catch((error) => {
        console.error(
          "Erro ao enviar para a planilha do colaborador:",
          error.message
        );
      });
  } else {
    console.error("Nenhuma URL de colaborador foi selecionada.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const selectElement = document.querySelector('select[name="Psicólogo"]');

  fetch("https://script.google.com/macros/s/AKfycbytTMgt97lHqH0kpT7ADC3f7VORd0eGOJRLVtzBft4/dev")
      .then(response => response.json())
      .then(data => {
          data.forEach(item => {
              let option = document.createElement('option');
              option.value = item.url;  // O valor da opção será a URL
              option.textContent = item.nome;  // O texto exibido será o nome
              selectElement.appendChild(option);
          });
      })
      .catch(error => {
          console.error('Erro ao carregar os dados:', error);
      });
});

// Inicializa outras funcionalidades da página após o DOM carregar
document.addEventListener("DOMContentLoaded", function () {
  // Carrega as opções do select
  loadOptions();

  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");

  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });

  const dataInput = form.querySelector('input[name="Data"]');
  const dataAtual = new Date().toISOString().split("T")[0];
  dataInput.setAttribute("min", dataAtual);
});
