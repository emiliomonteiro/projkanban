// Página inicial - Exibe o dashboard com visão geral das atividades do usuário
import { userService } from '../services/userService.js';
import { projectService } from '../services/projectService.js';
import { taskService } from '../services/taskService.js';

export function renderHomePage() {
  // Obtém referência ao conteúdo principal e usuário atual
  const mainContent = document.getElementById('main-content');
  const currentUser = userService.getCurrentUser();
  
  // Se não houver usuário selecionado, exibe mensagem de boas-vindas
  if (!currentUser) {
    mainContent.innerHTML = `
      <div class="welcome-banner">
        <h2>Welcome to Activity Tracker</h2>
        <p>Please select or create a user to get started.</p>
        <a href="#/profile" class="btn">Go to Profile Page</a>
      </div>
    `;
    return;
  }
  
  // Obtém os projetos e tarefas do usuário
  const projects = projectService.getProjectsByUserId(currentUser.id);
  const tasks = taskService.getTasksByUserId(currentUser.id);
  
  // Calcula estatísticas das tarefas por status
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    pending: tasks.filter(task => task.status === 'pending').length
  };
  
  // Calcula a porcentagem de progresso geral
  const progressPercentage = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;
  
  // Obtém as 5 tarefas mais recentes
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  // Renderiza o HTML do dashboard
  mainContent.innerHTML = `
    <div class="dashboard">
      <!-- Seção de boas-vindas -->
      <div class="welcome-section">
        <h2>Hello, ${currentUser.name}!</h2>
        <p>Here's an overview of your activities.</p>
      </div>
      
      <!-- Seção de estatísticas -->
      <div class="stats-section">
        <div class="grid">
          <!-- Card de projetos -->
          <div class="card">
            <h3>Projects</h3>
            <p class="stat-number">${projects.length}</p>
          </div>
          <!-- Card de total de tarefas -->
          <div class="card">
            <h3>Total Tasks</h3>
            <p class="stat-number">${taskStats.total}</p>
          </div>
          <!-- Card de tarefas completadas -->
          <div class="card">
            <h3>Completed Tasks</h3>
            <p class="stat-number">${taskStats.completed}</p>
          </div>
          <!-- Card de progresso geral -->
          <div class="card">
            <h3>Overall Progress</h3>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
            <p class="progress-text">${progressPercentage}%</p>
          </div>
        </div>
      </div>
      
      <!-- Seção de tarefas recentes -->
      <div class="recent-section">
        <div class="section-header">
          <h3>Recent Tasks</h3>
          <a href="#/my-projects" class="btn">View All Tasks</a>
        </div>
        
        ${recentTasks.length > 0 ? `
          <!-- Lista de tarefas recentes -->
          <div class="task-list">
            ${recentTasks.map(task => {
              const project = projectService.getProjectById(task.projectId);
              return `
                <!-- Card de tarefa -->
                <div class="task-card" data-task-id="${task.id}" onclick="window.openTaskDetail('${task.id}')">
                  <div class="task-header">
                    <h4>${task.title}</h4>
                    <span class="task-status status-${task.status}">${task.status.replace('-', ' ')}</span>
                  </div>
                  <p>${task.description || 'No description'}</p>
                  <div class="task-footer">
                    <small>Project: ${project ? project.name : 'Unknown'}</small>
                    <small>Created: ${new Date(task.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <!-- Mensagem quando não há tarefas -->
          <p>No tasks yet. Create a new task in the My Projects section.</p>
        `}
      </div>
    </div>
    
    <!-- Modal de detalhes da tarefa -->
    <div id="task-detail-modal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 id="task-detail-title">Task Details</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body" id="task-detail-content">
        </div>
        <div class="modal-footer">
          <button class="btn" onclick="document.getElementById('task-detail-modal').classList.remove('active')">Close</button>
          <button class="btn btn-primary" id="view-project-btn">View Project</button>
        </div>
      </div>
    </div>
  `;
  
  // Adiciona estilos CSS específicos para o dashboard
  const style = document.createElement('style');
  style.textContent = `
    /* Layout do dashboard */
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }
    
    /* Estilos da seção de boas-vindas */
    .welcome-section {
      margin-bottom: var(--spacing-2);
    }
    
    /* Cabeçalho das seções */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-2);
    }
    
    /* Números das estatísticas */
    .stat-number {
      font-size: 2rem;
      font-weight: 600;
      color: var(--color-primary);
      margin-top: var(--spacing-1);
    }
    
    /* Container da barra de progresso */
    .progress-container {
      height: 8px;
      background-color: var(--color-gray-200);
      border-radius: 4px;
      margin: var(--spacing-1) 0;
      overflow: hidden;
    }
    
    /* Barra de progresso */
    .progress-bar {
      height: 100%;
      background-color: var(--color-success);
      border-radius: 4px;
      transition: width 0.5s ease-in-out;
    }
    
    /* Texto do progresso */
    .progress-text {
      font-weight: 600;
      color: var(--color-success);
    }
    
    /* Rodapé dos cards de tarefa */
    .task-footer {
      display: flex;
      justify-content: space-between;
      margin-top: var(--spacing-2);
      color: var(--color-gray-600);
    }
    
    /* Banner de boas-vindas */
    .welcome-banner {
      text-align: center;
      padding: var(--spacing-4);
      background-color: white;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-md);
    }
    
    .welcome-banner p {
      margin: var(--spacing-2) 0;
    }
  `;
  
  document.head.appendChild(style);
  
  // Função global para abrir os detalhes de uma tarefa
  window.openTaskDetail = (taskId) => {
    // Obtém os dados da tarefa e do projeto
    const task = taskService.getTaskById(taskId);
    const project = projectService.getProjectById(task.projectId);
    const modal = document.getElementById('task-detail-modal');
    const content = document.getElementById('task-detail-content');
    
    // Renderiza o conteúdo do modal
    content.innerHTML = `
      <div class="task-detail">
        <div class="task-status status-${task.status}">${task.status.replace('-', ' ')}</div>
        <h4>${task.title}</h4>
        <p>${task.description || 'No description'}</p>
        <div class="task-meta">
          <p><strong>Project:</strong> ${project ? project.name : 'Unknown'}</p>
          <p><strong>Created:</strong> ${new Date(task.createdAt).toLocaleDateString()}</p>
          ${task.updatedAt ? `
            <p><strong>Last Updated:</strong> ${new Date(task.updatedAt).toLocaleDateString()}</p>
          ` : ''}
        </div>
      </div>
    `;
    
    // Configura o botão de visualizar projeto
    const viewProjectBtn = document.getElementById('view-project-btn');
    viewProjectBtn.onclick = () => {
      // Navega para a página de projetos e destaca o projeto
      window.location.hash = '#/my-projects';
      setTimeout(() => {
        const projectElement = document.querySelector(`[data-project-id="${task.projectId}"]`);
        if (projectElement) {
          projectElement.scrollIntoView({ behavior: 'smooth' });
          projectElement.classList.add('highlight');
          setTimeout(() => projectElement.classList.remove('highlight'), 2000);
        }
      }, 100);
      modal.classList.remove('active');
    };
    
    // Exibe o modal
    modal.classList.add('active');
  };
}