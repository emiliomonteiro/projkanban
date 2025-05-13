// My Projects page
import { userService } from '../services/userService.js';
import { projectService } from '../services/projectService.js';
import { taskService } from '../services/taskService.js';

export function renderMyProjectsPage() {
  const mainContent = document.getElementById('main-content');
  const currentUser = userService.getCurrentUser();
  
  if (!currentUser) {
    mainContent.innerHTML = `
      <div class="alert">
        <p>Please select a user to view projects.</p>
        <a href="#/profile" class="btn">Go to Profile Page</a>
      </div>
    `;
    return;
  }
  
  // Get user's projects
  const projects = projectService.getProjectsByUserId(currentUser.id);
  
  // Create projects section
  mainContent.innerHTML = `
    <div class="projects-page">
      <div class="section-header">
        <h2>My Projects</h2>
        <button id="create-project-btn" class="btn">
          <span class="material-icons">add</span> New Project
        </button>
      </div>
      
      ${projects.length > 0 ? `
        <div class="project-list">
          ${projects.map(project => {
            const tasks = taskService.getTasksByProjectId(project.id);
            const completedTasks = tasks.filter(task => task.status === 'completed').length;
            const totalTasks = tasks.length;
            const progressPercentage = totalTasks > 0 
              ? Math.round((completedTasks / totalTasks) * 100) 
              : 0;
              
            return `
              <div class="project-card" data-project-id="${project.id}">
                <div class="project-header">
                  <h3>${project.name}</h3>
                  <div class="card-actions">
                    <button class="view-project-btn btn-secondary" data-id="${project.id}">
                      <span class="material-icons">visibility</span>
                    </button>
                    <button class="edit-project-btn" data-id="${project.id}">
                      <span class="material-icons">edit</span>
                    </button>
                    <button class="delete-project-btn btn-danger" data-id="${project.id}">
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                </div>
                <p>${project.description || 'No description'}</p>
                <div class="project-stats">
                  <div class="progress-container">
                    <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                  </div>
                  <div class="progress-text">
                    ${completedTasks} of ${totalTasks} tasks completed (${progressPercentage}%)
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <p>You don't have any projects yet. Create your first project to get started.</p>
        </div>
      `}
    </div>
    
    <div id="project-modal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 id="project-modal-title">New Project</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="project-form">
            <div class="form-group">
              <label for="project-name" class="form-label">Project Name</label>
              <input type="text" id="project-name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="project-description" class="form-label">Description</label>
              <textarea id="project-description" class="form-control" rows="3"></textarea>
            </div>
            <input type="hidden" id="project-id">
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn" id="cancel-project-btn">Cancel</button>
          <button class="btn btn-primary" id="save-project-btn">Save Project</button>
        </div>
      </div>
    </div>
    
    <div id="project-detail-modal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 id="project-detail-title">Project Detail</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div id="project-detail-content"></div>
          
          <div class="task-section">
            <div class="section-header">
              <h4>Tasks</h4>
              <button id="create-task-btn" class="btn">
                <span class="material-icons">add</span> New Task
              </button>
            </div>
            <div id="task-list-container"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="task-modal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3 id="task-modal-title">New Task</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="task-form">
            <div class="form-group">
              <label for="task-title" class="form-label">Task Title</label>
              <input type="text" id="task-title" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="task-description" class="form-label">Description</label>
              <textarea id="task-description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label for="task-status" class="form-label">Status</label>
              <select id="task-status" class="form-control">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <input type="hidden" id="task-id">
            <input type="hidden" id="task-project-id">
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn" id="cancel-task-btn">Cancel</button>
          <button class="btn btn-primary" id="save-task-btn">Save Task</button>
        </div>
      </div>
    </div>
  `;
  
  // Add custom CSS for this page
  const style = document.createElement('style');
  style.textContent = `
    .projects-page {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }
    
    .project-stats {
      margin-top: var(--spacing-2);
    }
    
    .empty-state {
      text-align: center;
      padding: var(--spacing-4);
      background-color: white;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
    }
    
    .task-section {
      margin-top: var(--spacing-3);
    }
    
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-2);
      margin-bottom: var(--spacing-1);
      background-color: var(--color-gray-100);
      border-radius: var(--border-radius-md);
    }
    
    .task-actions {
      display: flex;
      gap: var(--spacing-1);
    }
    
    .task-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }
    
    .task-checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
  
  // Setup event listeners
  setupProjectEventListeners();
}

function setupProjectEventListeners() {
  const currentUser = userService.getCurrentUser();
  
  // Project Modal
  const projectModal = document.getElementById('project-modal');
  const projectForm = document.getElementById('project-form');
  const projectIdInput = document.getElementById('project-id');
  const projectNameInput = document.getElementById('project-name');
  const projectDescriptionInput = document.getElementById('project-description');
  const projectModalTitle = document.getElementById('project-modal-title');
  
  // Project Detail Modal
  const projectDetailModal = document.getElementById('project-detail-modal');
  const projectDetailTitle = document.getElementById('project-detail-title');
  const projectDetailContent = document.getElementById('project-detail-content');
  const taskListContainer = document.getElementById('task-list-container');
  
  // Task Modal
  const taskModal = document.getElementById('task-modal');
  const taskForm = document.getElementById('task-form');
  const taskIdInput = document.getElementById('task-id');
  const taskTitleInput = document.getElementById('task-title');
  const taskDescriptionInput = document.getElementById('task-description');
  const taskStatusInput = document.getElementById('task-status');
  const taskProjectIdInput = document.getElementById('task-project-id');
  const taskModalTitle = document.getElementById('task-modal-title');
  
  // Create Project Button
  document.getElementById('create-project-btn').addEventListener('click', () => {
    projectModalTitle.textContent = 'New Project';
    projectForm.reset();
    projectIdInput.value = '';
    projectModal.classList.add('active');
  });
  
  // Save Project Button
  document.getElementById('save-project-btn').addEventListener('click', () => {
    if (!projectNameInput.value.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    const projectData = {
      name: projectNameInput.value.trim(),
      description: projectDescriptionInput.value.trim(),
      userId: currentUser.id
    };
    
    if (projectIdInput.value) {
      // Update existing project
      projectService.updateProject(projectIdInput.value, projectData);
    } else {
      // Create new project
      projectService.createProject(projectData);
    }
    
    projectModal.classList.remove('active');
    renderMyProjectsPage();
  });
  
  // Cancel Project Button
  document.getElementById('cancel-project-btn').addEventListener('click', () => {
    projectModal.classList.remove('active');
  });
  
  // Close Project Modal
  document.querySelector('#project-modal .modal-close').addEventListener('click', () => {
    projectModal.classList.remove('active');
  });
  
  // Edit Project Buttons
  document.querySelectorAll('.edit-project-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const projectId = e.currentTarget.dataset.id;
      const project = projectService.getProjectById(projectId);
      
      projectModalTitle.textContent = 'Edit Project';
      projectIdInput.value = project.id;
      projectNameInput.value = project.name;
      projectDescriptionInput.value = project.description || '';
      
      projectModal.classList.add('active');
    });
  });
  
  // Delete Project Buttons
  document.querySelectorAll('.delete-project-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const projectId = e.currentTarget.dataset.id;
      if (confirm('Are you sure you want to delete this project? All tasks will also be deleted.')) {
        projectService.deleteProject(projectId);
        taskService.deleteTasksByProjectId(projectId);
        renderMyProjectsPage();
      }
    });
  });
  
  // View Project Buttons
  document.querySelectorAll('.view-project-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const projectId = e.currentTarget.dataset.id;
      openProjectDetail(projectId);
    });
  });
  
  // Close Project Detail Modal
  document.querySelector('#project-detail-modal .modal-close').addEventListener('click', () => {
    projectDetailModal.classList.remove('active');
  });
  
  // Create Task Button
  document.getElementById('create-task-btn')?.addEventListener('click', () => {
    taskModalTitle.textContent = 'New Task';
    taskForm.reset();
    taskIdInput.value = '';
    taskModal.classList.add('active');
  });
  
  // Save Task Button
  document.getElementById('save-task-btn').addEventListener('click', () => {
    if (!taskTitleInput.value.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    const taskData = {
      title: taskTitleInput.value.trim(),
      description: taskDescriptionInput.value.trim(),
      status: taskStatusInput.value,
      projectId: taskProjectIdInput.value,
      userId: currentUser.id
    };
    
    if (taskIdInput.value) {
      // Update existing task
      taskService.updateTask(taskIdInput.value, taskData);
    } else {
      // Create new task
      taskService.createTask(taskData);
    }
    
    taskModal.classList.remove('active');
    openProjectDetail(taskProjectIdInput.value);
  });
  
  // Cancel Task Button
  document.getElementById('cancel-task-btn').addEventListener('click', () => {
    taskModal.classList.remove('active');
  });
  
  // Close Task Modal
  document.querySelector('#task-modal .modal-close').addEventListener('click', () => {
    taskModal.classList.remove('active');
  });
}

function openProjectDetail(projectId) {
  const project = projectService.getProjectById(projectId);
  const tasks = taskService.getTasksByProjectId(projectId);
  
  const projectDetailModal = document.getElementById('project-detail-modal');
  const projectDetailTitle = document.getElementById('project-detail-title');
  const projectDetailContent = document.getElementById('project-detail-content');
  const taskListContainer = document.getElementById('task-list-container');
  const taskProjectIdInput = document.getElementById('task-project-id');
  
  projectDetailTitle.textContent = project.name;
  projectDetailContent.innerHTML = `
    <p>${project.description || 'No description'}</p>
    <p><small>Created: ${new Date(project.createdAt).toLocaleDateString()}</small></p>
  `;
  
  // Render tasks
  taskListContainer.innerHTML = tasks.length > 0 
    ? tasks.map(task => `
      <div class="task-item">
        <div class="task-title">
          <input type="checkbox" class="task-checkbox" data-id="${task.id}" 
            ${task.status === 'completed' ? 'checked' : ''}>
          <span class="${task.status === 'completed' ? 'completed-task' : ''}">${task.title}</span>
        </div>
        <div class="task-actions">
          <button class="edit-task-btn" data-id="${task.id}">
            <span class="material-icons">edit</span>
          </button>
          <button class="delete-task-btn btn-danger" data-id="${task.id}">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </div>
    `).join('')
    : '<p>No tasks yet. Add a task to get started.</p>';
  
  // Set project ID for task creation
  taskProjectIdInput.value = projectId;
  
  // Show the modal
  projectDetailModal.classList.add('active');
  
  // Add custom CSS for tasks
  const style = document.createElement('style');
  style.textContent = `
    .completed-task {
      text-decoration: line-through;
      color: var(--color-gray-600);
    }
  `;
  document.head.appendChild(style);
  
  // Setup task event listeners
  setupTaskEventListeners(projectId);
}

function setupTaskEventListeners(projectId) {
  // Task Modal Elements
  const taskModal = document.getElementById('task-modal');
  const taskIdInput = document.getElementById('task-id');
  const taskTitleInput = document.getElementById('task-title');
  const taskDescriptionInput = document.getElementById('task-description');
  const taskStatusInput = document.getElementById('task-status');
  const taskModalTitle = document.getElementById('task-modal-title');
  
  // Edit Task Buttons
  document.querySelectorAll('.edit-task-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const taskId = e.currentTarget.dataset.id;
      const task = taskService.getTaskById(taskId);
      
      taskModalTitle.textContent = 'Edit Task';
      taskIdInput.value = task.id;
      taskTitleInput.value = task.title;
      taskDescriptionInput.value = task.description || '';
      taskStatusInput.value = task.status;
      
      taskModal.classList.add('active');
    });
  });
  
  // Delete Task Buttons
  document.querySelectorAll('.delete-task-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const taskId = e.currentTarget.dataset.id;
      if (confirm('Are you sure you want to delete this task?')) {
        taskService.deleteTask(taskId);
        openProjectDetail(projectId);
      }
    });
  });
  
  // Task Checkboxes
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const taskId = e.currentTarget.dataset.id;
      const task = taskService.getTaskById(taskId);
      
      // Update task status
      taskService.updateTask(taskId, {
        status: e.currentTarget.checked ? 'completed' : 'pending'
      });
      
      // Update the task item display
      const taskTitle = e.currentTarget.nextElementSibling;
      if (e.currentTarget.checked) {
        taskTitle.classList.add('completed-task');
      } else {
        taskTitle.classList.remove('completed-task');
      }
    });
  });
}