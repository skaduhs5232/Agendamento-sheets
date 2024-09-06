document.addEventListener("DOMContentLoaded", function() {
    var swiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
    });

    document.getElementById('menu-toggle').addEventListener('click', function() {
        var menu = document.getElementById('menu');
        menu.classList.toggle('active');
    });
});

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