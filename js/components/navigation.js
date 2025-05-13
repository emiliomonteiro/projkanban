// Componente de navegação - Gerencia a barra lateral e navegação da aplicação

export function setupNavigation() {
  // Obtém referências aos elementos do DOM
  const sidebar = document.getElementById('sidebar');
  const collapseBtn = document.getElementById('collapse-btn');
  
  // Configura o botão de colapsar/expandir a barra lateral
  collapseBtn.addEventListener('click', () => {
    // Alterna as classes que controlam o estado da barra lateral
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('expanded');
    
    // Salva o estado da barra lateral no localStorage para persistência
    localStorage.setItem('sidebar-state', 
      sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded'
    );
  });
  
  // Restaura o estado anterior da barra lateral ao carregar a página
  const sidebarState = localStorage.getItem('sidebar-state');
  if (sidebarState === 'collapsed') {
    sidebar.classList.add('collapsed');
    sidebar.classList.remove('expanded');
  }
  
  // Configura o comportamento dos links de navegação
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Em dispositivos móveis, colapsa a barra lateral após clicar em um link
      if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('expanded');
      }
    });
  });
  
  // Gerencia o redimensionamento da janela
  window.addEventListener('resize', () => {
    // Ajusta a margem do conteúdo quando a janela é redimensionada
    const content = document.querySelector('.content');
    if (window.innerWidth <= 768) {
      content.style.marginLeft = `${sidebar.offsetWidth}px`;
    } else {
      content.style.marginLeft = '0';
    }
  });
  
  // Ajusta o conteúdo inicialmente para dispositivos móveis
  if (window.innerWidth <= 768) {
    const content = document.querySelector('.content');
    content.style.marginLeft = `${sidebar.offsetWidth}px`;
  }
}