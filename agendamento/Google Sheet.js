const scriptURL = "https://script.google.com/macros/s/AKfycbzEDOu7dFI2mE79PeniKjgyoQjx0A9l7iNU5CdNjf6HC1yvcCo7XKVFlKISnB89C2ntTQ/exec";
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataInput = form.querySelector('input[name="Data"]').value;
  const dataSelecionada = new Date(dataInput);
  const dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0);

  if (dataSelecionada < dataAtual) {
    alert("Por favor, selecione uma data futura.");
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
        alert("Obrigado, seu cadastro foi adicionado, fique de olho na data!");
      } else if (result.result === "error" && result.message === "agendamento duplicado") {
        alert("Este agendamento já foi feito. Por favor, selecione outro horário.");
      } else {
        alert("Erro: " + result.message);
      }
      form.reset();
    })
    .catch((error) => {
      console.error("Error!", error.message);
      alert("Houve um erro ao enviar os dados. Tente novamente mais tarde.");
    })
    .finally(() => {
      loading.style.display = "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("nav ul");

  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
  });

  const dataInput = form.querySelector('input[name="Data"]');
  const dataAtual = new Date().toISOString().split("T")[0];
  dataInput.setAttribute("min", dataAtual);
});
