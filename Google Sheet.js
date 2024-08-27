const scriptURL =
  "https://script.google.com/macros/s/AKfycbxhD6da0dvx3rQgGChA5NsfQ7hLE7wGTYIfTSfMEoa-esFP9K2vpPUinj6v_xhkXB2sTg/exec";
const form = document.forms["contact-form"];
const loading = document.getElementById("loading");
const modal = document.getElementById("successModal");
const span = document.getElementsByClassName("close")[0];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  loading.style.display = "flex";

  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      // Exibe o modal ao invés do alert
      modal.style.display = "block";
    })
    .then(() => {
      loading.style.display = "none";
      // Adicione lógica aqui para não recarregar a página imediatamente
    })
    .catch((error) => {
      console.error("Error!", error.message);
      loading.style.display = "none";
    });
});

// Fechar o modal quando o usuário clicar no "x"
span.onclick = function () {
  modal.style.display = "none";
  window.location.reload();
};

// Fechar o modal quando o usuário clicar fora do modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    window.location.reload();
  }
};
