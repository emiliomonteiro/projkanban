// Gerenciador de rotas do lado do cliente - Controla a navegação entre páginas

import { renderHomePage } from '../pages/home.js';
import { renderMyProjectsPage } from '../pages/myProjects.js';
import { renderFollowingProjectsPage } from '../pages/followingProjects.js';
import { renderLoginPage } from '../pages/login.js';
import { renderProfilePage } from '../pages/profile.js';
import { renderDataFetchPage } from '../pages/dataFetch.js';

class Router {
  constructor() {
    // Define o mapeamento de rotas para suas respectivas funções de renderização
    this.routes = {
      '': renderHomePage,                    // Rota raiz
      '#/': renderHomePage,                  // Rota home
      '#/home': renderHomePage,              // Página inicial
      '#/my-projects': renderMyProjectsPage, // Meus projetos
      '#/following-projects': renderFollowingProjectsPage, // Projetos seguidos
      '#/login': renderLoginPage,            // Página de login
      '#/profile': renderProfilePage,        // Perfil do usuário
      '#/data-fetch': renderDataFetchPage    // Busca de dados
    };
    
    // Define a rota padrão (home) para quando a rota não for encontrada
    this.defaultRoute = renderHomePage;
  }
  
  init() {
    // Gerencia o carregamento inicial da página
    this.handleRouteChange();
    
    // Adiciona listener para mudanças no hash da URL
    window.addEventListener('hashchange', () => this.handleRouteChange());
  }
  
  handleRouteChange() {
    // Obtém o hash atual da URL
    const hash = window.location.hash;
    // Obtém a função de renderização correspondente ou usa a padrão
    const render = this.routes[hash] || this.defaultRoute;
    
    // Atualiza o link de navegação ativo
    this.updateActiveNavLink(hash);
    
    // Renderiza a página correspondente
    render();
  }
  
  updateActiveNavLink(hash) {
    // Remove a classe 'active' de todos os links
    document.querySelectorAll('.nav-links li').forEach(link => {
      link.classList.remove('active');
    });
    
    // Extrai o nome da página do hash
    let pageName = hash.replace('#/', '');
    if (!pageName || pageName === '/') pageName = 'home';
    
    // Adiciona a classe 'active' ao link da página atual
    const activeLink = document.querySelector(`.nav-links li[data-page="${pageName}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    
    // Atualiza o título da página
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      // Formata o título capitalizando cada palavra
      pageTitle.textContent = pageName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  // Método para navegar programaticamente para uma nova rota
  navigate(path) {
    window.location.hash = path;
  }
}

// Exporta uma instância única do roteador
export const router = new Router();