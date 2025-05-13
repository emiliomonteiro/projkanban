// Página de Busca de Dados - Permite buscar dados de projetos de fontes externas
import { userService } from '../services/userService.js';
import { apiService } from '../services/apiService.js';

export function renderDataFetchPage() {
  // Obtém referência ao conteúdo principal e usuário atual
  const mainContent = document.getElementById('main-content');
  const currentUser = userService.getCurrentUser();
  
  // Se não houver usuário selecionado, exibe mensagem
  if (!currentUser) {
    mainContent.innerHTML = `
      <div class="alert">
        <p>Please select a user to use this feature.</p>
        <a href="#/profile" class="btn">Go to Profile Page</a>
      </div>
    `;
    return;
  }
  
  mainContent.innerHTML = `
    <div class="data-fetch-page">
      <!-- Seletor de fonte de dados -->
      <div class="data-source-selector card">
        <h2>Select Data Source</h2>
        <p>Choose where to fetch project data from:</p>
        
        <!-- Opções de fonte de dados -->
        <div class="radio-group">
          <div class="radio-option">
            <input type="radio" id="external-api" name="data-source" value="api" checked>
            <label for="external-api">External API (JSONPlaceholder)</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="sample-data" name="data-source" value="sample">
            <label for="sample-data">Sample JSON Data</label>
          </div>
        </div>
        
        <!-- Botão para buscar dados -->
        <button id="fetch-data-btn" class="btn btn-primary">
          <span class="material-icons">cloud_download</span> Fetch Data
        </button>
      </div>
      
      <!-- Área de resultados -->
      <div class="data-results" id="data-results">
        <!-- Os resultados serão exibidos aqui -->
      </div>
    </div>
  `;
  
  // Adiciona estilos CSS específicos para a página
  const style = document.createElement('style');
  style.textContent = `
    /* Layout da página de busca de dados */
    .data-fetch-page {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }
    
    /* Seletor de fonte de dados */
    .data-source-selector {
      padding: var(--spacing-3);
    }
    
    /* Grupo de opções de rádio */
    .radio-group {
      margin: var(--spacing-2) 0;
    }
    
    /* Card do projeto */
    .project-card {
      margin-bottom: var(--spacing-2);
    }
    
    /* Seção de tarefas do projeto */
    .project-tasks {
      margin-top: var(--spacing-2);
      padding-top: var(--spacing-2);
      border-top: 1px solid var(--color-gray-200);
    }
    
    /* Chip de tarefa */
    .task-chip {
      display: inline-block;
      padding: 4px 8px;
      margin: 4px;
      border-radius: 16px;
      font-size: 0.85rem;
      background-color: var(--color-gray-200);
    }
    
    /* Estados dos chips de tarefa */
    .task-chip.completed {
      background-color: var(--color-success);
      color: white;
    }
    
    .task-chip.pending {
      background-color: var(--color-warning);
    }
    
    .task-chip.in-progress {
      background-color: var(--color-accent);
      color: white;
    }
    
    /* Estado de carregamento */
    .loading {
      text-align: center;
      padding: var(--spacing-3);
    }
    
    /* Animação de carregamento */
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: var(--color-primary);
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    
    /* Animação de rotação do spinner */
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Adiciona evento ao botão de busca
  document.getElementById('fetch-data-btn').addEventListener('click', fetchData);
}

// Função para buscar dados da fonte selecionada
async function fetchData() {
  const dataResults = document.getElementById('data-results');
  const dataSource = document.querySelector('input[name="data-source"]:checked').value;
  
  // Exibe estado de carregamento
  dataResults.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Fetching data...</p>
    </div>
  `;
  
  let data;
  
  try {
    // Busca dados da fonte selecionada
    if (dataSource === 'api') {
      data = await apiService.fetchExternalData();
    } else {
      data = await apiService.loadSampleData();
    }
    
    // Exibe os resultados
    displayResults(data);
  } catch (error) {
    dataResults.innerHTML = `
      <div class="alert alert-error">
        <p>Error fetching data: ${error.message}</p>
      </div>
    `;
  }
}

// Função para exibir os resultados da busca
function displayResults(data) {
  const dataResults = document.getElementById('data-results');
  
  // Verifica se há dados para exibir
  if (!data || !data.projects || data.projects.length === 0) {
    dataResults.innerHTML = `
      <div class="alert">
        <p>No data found.</p>
      </div>
    `;
    return;
  }
  
  // Renderiza a lista de projetos e suas tarefas
  dataResults.innerHTML = `
    <h3>Fetched Projects</h3>
    <div class="project-list">
      ${data.projects.map(project => `
        <div class="project-card">
          <div class="project-header">
            <h3>${project.name}</h3>
          </div>
          <p>${project.description}</p>
          
          <!-- Lista de tarefas do projeto -->
          <div class="project-tasks">
            <h4>Tasks:</h4>
            <div class="task-chips">
              ${project.tasks.map(task => `
                <span class="task-chip ${task.status}">${task.title}</span>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}