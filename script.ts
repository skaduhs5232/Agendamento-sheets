(() => {
  let lastScrollTop: number = 0;
  const navbar = document.querySelector('.navbar') as HTMLElement | null; // Seleciona a navbar e garante que é do tipo HTMLElement ou null

  // Função para monitorar o scroll
  window.addEventListener('scroll', function() {
      if (!navbar) return; // Verifica se a navbar foi encontrada

      let scrollTop: number = window.pageYOffset || document.documentElement.scrollTop;

      // Se rolou para baixo, esconde a navbar, se rolou para cima, mostra
      if (scrollTop > lastScrollTop) {
          navbar.classList.add('navbar-hidden'); // Esconde ao rolar para baixo
      } else {
          navbar.classList.remove('navbar-hidden'); // Mostra ao rolar para cima
      }

      // Atualiza a última posição de rolagem
      lastScrollTop = scrollTop;
  });
})();
