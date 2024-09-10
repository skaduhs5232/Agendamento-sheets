// Este link é para a planilha "mestre" (administradora).
var mainURL =
  "https://script.google.com/macros/s/AKfycbzEDOu7dFI2mE79PeniKjgyoQjx0A9l7iNU5CdNjf6HC1yvcCo7XKVFlKISnB89C2ntTQ/exec";

// Este link é para a planilha individual de cada psicólogo.
var scriptURL = "";

// Este é um dicionário que contém todos os nomes e links para cada planilha.
let planilhasPsicologos = {};

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

  fetch(mainURL, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.result === "success") {
        showFeedback(
          "Obrigado, seu cadastro foi adicionado com sucesso! fique de olho na data!",
          "success"
        );

        // Agora, envie a mesma informação para a planilha individual.
        if (scriptURL) {
          fetch(scriptURL, { method: "POST", body: formData })
            .then((res) => {
              if (!res.ok) {
                throw new Error("Erro na resposta da planilha individual");
              }
              return res.json();
            })
            .then((resResult) => {  
              console.log("Enviado para planilha individual:", resResult);
            })
            .catch((error) => {
              console.error("Error fetching individual URL:", error);
              showFeedback(
                "Erro ao enviar para a planilha individual.",
                "error"
              );
            });
        } else {
          console.error("scriptURL is empty");
          showFeedback("Por favor, selecione um psicólogo.", "warning");
        }
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

// Inicializa outras funcionalidades da página após o DOM carregar
document.addEventListener("DOMContentLoaded", function () {

  const selectProfissional = document.getElementById("profissional");

  selectProfissional.setAttribute("disabled", "");

  selectProfissional.addEventListener("change", (event) => {
    let profissionalSelecionado = planilhasPsicologos.find(
      (x) => x.nome === event.target.value
    );

    if (profissionalSelecionado) {
      scriptURL = profissionalSelecionado.url;
      console.log(`URL do profissional selecionado: ${scriptURL}`);
    } else {
      console.error("Profissional não encontrado.");
    }
  });

  const dataInput = form.querySelector('input[name="Data"]');
  const dataAtual = new Date().toISOString().split("T")[0];

  dataInput.setAttribute("min", dataAtual);

  // Carregar os psicólogos da planilha
  fetch(
    "https://script.google.com/macros/s/AKfycbwDM7wIH0c3FOzgw6Y-9MxVI7alohX_sw2MIg62OfVGcCdA9k_rvsojZefj7YD3Z_jB/exec"
  )
    .then((response) => response.json())
    .then((data) => {
      const selectPsicologo = document.querySelector(
        'select[name="Psicólogo"]'
      );
      planilhasPsicologos = data;

      data.forEach((x) => {
        const option = document.createElement("option");
        option.value = x["nome"];
        option.textContent = x["nome"];
        selectPsicologo.appendChild(option);
      });

      selectProfissional.removeAttribute("disabled");
    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
});

fetch(mainURL, {
  redirect: "follow",
  method: "GET"
}).then((response) => console.log(response.json()))