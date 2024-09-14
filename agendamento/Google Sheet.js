// Este link é para a planilha "mestre" (administradora).
var mainURL =
  "https://script.google.com/macros/s/AKfycbzEDOu7dFI2mE79PeniKjgyoQjx0A9l7iNU5CdNjf6HC1yvcCo7XKVFlKISnB89C2ntTQ/exec";

var scriptURL = "";

// Este é um dicionário que contém todos os nomes e links para cada planilha.
let planilhasPsicologos = {};

const form = document.forms["contact-form"];
const loading = document.getElementById("loading");
const horarioSelect = document.querySelector('select[name="Hora"]');

// Desabilita o select de horário até que psicólogo e data sejam escolhidos
horarioSelect.setAttribute("disabled", true);

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

function gerarHorariosDisponiveis() {
  const horarios = [];
  for (let h = 8; h <= 18; h++) {
    const horaFormatada = h.toString().padStart(2, "0") + ":00"; // Adiciona zero à esquerda se necessário
    horarios.push(horaFormatada);
  }
  return horarios;
}

// Função para preencher o select com horários disponíveis
function preencherHorarios(horariosDisponiveis) {
  horarioSelect.innerHTML = ""; // Limpa opções anteriores
  horariosDisponiveis.forEach((hora) => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    horarioSelect.appendChild(option);
  });
}

function converterDataParaISO(data) {
  const [dia, mes, ano] = data.split("/");
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

function mostrarLoaderHorarios() {
  horarioSelect.innerHTML = ""; // Limpa opções anteriores
  const option = document.createElement("option");
  option.value = "";
  option.textContent = "Carregando horários...";
  option.disabled = true;
  option.selected = true;
  horarioSelect.appendChild(option);
}

// Função para obter horários da planilha e filtrar por data
function obterHorarios(scriptURL, dataSelecionada) {
  mostrarLoaderHorarios();
  fetch(scriptURL)
    .then((response) => response.json())
    .then((data) => {
      // Console log de todos os horários e datas retornados pela API
      console.log("Horários e datas recebidos:", data.horarios);

      const horariosOcupados = data.horarios
        .filter((horario) => {
          // Converte a data no formato 'DD/MM/AAAA' para 'AAAA-MM-DD' e compara
          return converterDataParaISO(horario.data) === dataSelecionada;
        })
        .map((horario) => horario.hora); // Pega só os horários ocupados
      console.log("Horários ocupados:", horariosOcupados);

      // Gerar todos os horários disponíveis
      const horariosDisponiveis = gerarHorariosDisponiveis();

      // Filtrar para remover horários ocupados
      const horariosFiltrados = horariosDisponiveis.filter(
        (hora) => !horariosOcupados.includes(hora)
      );

      // Preencher o dropdown com horários disponíveis
      preencherHorarios(horariosFiltrados);
    })
    .catch((error) => {
      console.error("Erro ao obter os horários:", error);
      showFeedback("Erro ao carregar os horários.", "error");
    });
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
  let psicologo = form.querySelector('select[name="Psicólogo"]').value.trim();

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
  const dataInput = form.querySelector('input[name="Data"]');

  selectProfissional.setAttribute("disabled", "");

  selectProfissional.addEventListener("change", (event) => {
    let profissionalSelecionado = planilhasPsicologos.find(
      (x) => x.nome === event.target.value
    );

    if (profissionalSelecionado) {
      scriptURL = profissionalSelecionado.url;
      console.log(`URL do profissional selecionado: ${scriptURL}`);

      // Habilita o campo de horário após selecionar psicólogo e data
      const dataSelecionada = dataInput.value;
      if (dataSelecionada) {
        horarioSelect.removeAttribute("disabled");
        obterHorarios(scriptURL, dataSelecionada);
      }
    } else {
      console.error("Profissional não encontrado.");
    }
  });

  // Habilita o select de horário apenas após selecionar data e psicólogo
  dataInput.addEventListener("change", () => {
    const psicologoSelecionado = selectProfissional.value;
    const dataSelecionada = dataInput.value;

    if (psicologoSelecionado && dataSelecionada) {
      horarioSelect.removeAttribute("disabled");
      obterHorarios(scriptURL, dataSelecionada);
    } else {
      horarioSelect.setAttribute("disabled", true);
    }
  });

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
