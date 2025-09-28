
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar'); // Seleciona a navbar

// Função para monitorar o scroll
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Se rolou para baixo, esconde a navbar, se rolou para cima, mostra
    if (scrollTop > lastScrollTop) {
        navbar.classList.add('navbar-hidden'); // Esconde ao rolar para baixo
    } else {
        navbar.classList.remove('navbar-hidden'); // Mostra ao rolar para cima
    }

    // Atualiza a última posição de rolagem
    lastScrollTop = scrollTop;
});