// Importando os módulos necessários
// Importa o roteador para gerenciar as rotas da aplicação
import { router } from './utils/router.js';
// Importa a função para configurar a navegação
import { setupNavigation } from './components/navigation.js';
// Importa a função para carregar o seletor de usuário
import { loadUserSelect } from './components/userSelect.js';
// Importa a função para inicializar os dados
import { initializeData } from './services/dataInitializer.js';

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os dados no localStorage se não existirem
  initializeData();
  
  // Configura a navegação e a barra lateral
  setupNavigation();
  
  // Carrega o menu dropdown de seleção de usuário
  loadUserSelect();
  
  // Inicializa o roteador da aplicação
  router.init();
});