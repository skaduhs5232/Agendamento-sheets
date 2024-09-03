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
