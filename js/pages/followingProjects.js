// Página de Projetos Seguidos - Gerencia projetos que o usuário está seguindo
import { userService } from '../services/userService.js';
import { projectService } from '../services/projectService.js';
import { taskService } from '../services/taskService.js';

export function renderFollowingProjectsPage() {
  // Obtém referência ao conteúdo principal e usuário atual
  const mainContent = document.getElementById('main-content');
  const currentUser = userService.getCurrentUser();
  
  // Se não houver usuário selecionado, exibe mensagem
  if (!currentUser) {
    mainContent.innerHTML = `
      <div class="alert">
        <p>Please select a user to view following projects.</p>
        <a href="#/profile" class="btn">Go to Profile Page</a>
      </div>
    `;
    return;
  }
  
  // Obtém os projetos que o usuário está seguindo
  const followingProjects = projectService.getFollowingProjects(currentUser.id);
  
  // Obtém lista de todos os projetos de outros usuários que o usuário não está seguindo
  const allProjects = projectService.getAllProjects();
  const otherProjects = allProjects.filter(project => 
    project.userId !== currentUser.id && 
    (!project.followers || !project.followers.includes(currentUser.id))
  );
  
  mainContent.innerHTML = `
    <div class="following-page">
      <!-- Seção de projetos seguidos -->
      <div class="section">
        <h2>Projects I'm Following</h2>
        
        ${followingProjects.length > 0 ? `
          <!-- Lista de projetos seguidos -->
          <div class="project-list">
            ${followingProjects.map(project => {
              // Calcula estatísticas das tarefas do projeto
              const tasks = taskService.getTasksByProjectId(project.id);
              const completedTasks = tasks.filter(task => task.status === 'completed').length;
              const totalTasks = tasks.length;
              const progressPercentage = totalTasks > 0 
                ? Math.round((completedTasks / totalTasks) * 100) 
                : 0;
                
              const owner = userService.getUserById(project.userId);
                
              return `
                <!-- Card do projeto seguido -->
                <div class="project-card">
                  <div class="project-header">
                    <h3>${project.name}</h3>
                    <button class="unfollow-btn btn-danger" data-id="${project.id}">
                      <span class="material-icons">star</span> Unfollow
                    </button>
                  </div>
                  <p>${project.description || 'No description'}</p>
                  <!-- Estatísticas do projeto -->
                  <div class="project-stats">
                    <div class="progress-container">
                      <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <div class="progress-text">
                      ${completedTasks} of ${totalTasks} tasks completed (${progressPercentage}%)
                    </div>
                  </div>
                  <!-- Rodapé do projeto -->
                  <div class="project-footer">
                    <span class="owner-info">
                      <span class="material-icons">person</span>
                      ${owner ? owner.name : 'Unknown user'}
                    </span>
                    <button class="view-project-btn btn-secondary" data-id="${project.id}">
                      <span class="material-icons">visibility</span> View Details
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <!-- Mensagem quando não há projetos seguidos -->
          <div class="empty-state">
            <p>You're not following any projects yet. Browse other users' projects below.</p>
          </div>
        `}
      </div>
      
      <!-- Seção de descoberta de projetos -->
      <div class="section">
        <h2>Discover Projects</h2>
        
        ${otherProjects.length > 0 ? `
          <!-- Lista de projetos disponíveis -->
          <div class="project-list">
            ${otherProjects.map(project => {
              const owner = userService.getUserById(project.userId);
              
              return `
                <!-- Card do projeto disponível -->
                <div class="project-card">
                  <div class="project-header">
                    <h3>${project.name}</h3>
                    <button class="follow-btn btn-primary" data-id="${project.id}">
                      <span class="material-icons">star_border</span> Follow
                    </button>
                  </div>
                  <p>${project.description || 'No description'}</p>
                  <!-- Rodapé do projeto -->
                  <div class="project-footer">
                    <span class="owner-info">
                      <span class="material-icons">person</span>
                      ${owner ? owner.name : 'Unknown user'}
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <!-- Mensagem quando não há projetos disponíveis -->
          <div class="empty-state">
            <p>There are no other projects available to follow.</p>
          </div>
        `}
      </div>
    </div>
    
    <!-- Modal de detalhes do projeto -->
    <div id="project-detail-modal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 id="project-detail-title">Project Detail</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div id="project-detail-content"></div>
          
          <!-- Seção de tarefas -->
          <div class="task-section">
            <h4>Tasks</h4>
            <div id="task-list-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Adiciona estilos CSS específicos para a página
  const style = document.createElement('style');
  style.textContent = `
    /* Layout da página de projetos seguidos */
    .following-page {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-4);
    }
    
    /* Seção da página */
    .section {
      margin-bottom: var(--spacing-2);
    }
    
    /* Rodapé do projeto */
    .project-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--spacing-2);
      padding-top: var(--spacing-2);
      border-top: 1px solid var(--color-gray-200);
    }
    
    /* Informações do proprietário */
    .owner-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
      color: var(--color-gray-700);
    }
    
    /* Botões de seguir/deixar de seguir */
    .follow-btn, .unfollow-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }
    
    /* Tarefa somente leitura */
    .read-only-task {
      padding: var(--spacing-2);
      margin-bottom: var(--spacing-1);
      background-color: var(--color-gray-100);
      border-radius: var(--border-radius-md);
    }
    
    /* Cabeçalho da tarefa somente leitura */
    .read-only-task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
  document.head.appendChild(style);
  
  // Configura os eventos da página
  setupFollowingEventListeners();
}

// Função para configurar os eventos da página
function setupFollowingEventListeners() {
  const currentUser = userService.getCurrentUser();
  
  // Eventos dos botões de seguir
  document.querySelectorAll('.follow-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const projectId = e.currentTarget.dataset.id;
      projectService.followProject(projectId, currentUser.id);
      renderFollowingProjectsPage();
    });
  });
  
  // Eventos dos botões de deixar de seguir
  document.querySelectorAll('.unfollow-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const projectId = e.currentTarget.dataset.id;
      projectService.unfollowProject(projectId, currentUser.id);
      renderFollowingProjectsPage();
    });
  });
  
  // Eventos dos botões de visualizar projeto
  document.querySelectorAll('.view-project-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const projectId = e.currentTarget.dataset.id;
      openProjectDetail(projectId);
    });
  });
  
  // Evento do botão de fechar modal
  document.querySelector('#project-detail-modal .modal-close').addEventListener('click', () => {
    document.getElementById('project-detail-modal').classList.remove('active');
  });
}

// Função para abrir os detalhes do projeto
function openProjectDetail(projectId) {
  const project = projectService.getProjectById(projectId);
  const tasks = taskService.getTasksByProjectId(projectId);
  const owner = userService.getUserById(project.userId);
  
  const projectDetailModal = document.getElementById('project-detail-modal');
  const projectDetailTitle = document.getElementById('project-detail-title');
  const projectDetailContent = document.getElementById('project-detail-content');
  const taskListContainer = document.getElementById('task-list-container');
  
  // Atualiza o título e conteúdo do modal
  projectDetailTitle.textContent = project.name;
  projectDetailContent.innerHTML = `
    <p>${project.description || 'No description'}</p>
    <p><small>Created by: ${owner ? owner.name : 'Unknown user'}</small></p>
    <p><small>Created: ${new Date(project.createdAt).toLocaleDateString()}</small></p>
  `;
  
  // Renderiza as tarefas (somente leitura)
  taskListContainer.innerHTML = tasks.length > 0 
    ? tasks.map(task => `
      <div class="read-only-task">
        <div class="read-only-task-header">
          <div class="task-title">
            <span class="${task.status === 'completed' ? 'completed-task' : ''}">${task.title}</span>
          </div>
          <span class="task-status status-${task.status}">${task.status.replace('-', ' ')}</span>
        </div>
        ${task.description ? `<p>${task.description}</p>` : ''}
      </div>
    `).join('')
    : '<p>No tasks yet.</p>';
  
  // Exibe o modal
  projectDetailModal.classList.add('active');
}