// Página de Perfil - Gerencia criação e edição de perfis de usuário
import { userService } from '../services/userService.js';
import { router } from '../utils/router.js';
import { loadUserSelect } from '../components/userSelect.js';

export function renderProfilePage() {
  // Obtém referência ao conteúdo principal e usuário atual
  const mainContent = document.getElementById('main-content');
  const currentUser = userService.getCurrentUser();
  
  // Verifica se estamos em modo de edição ou criação
  const isEditMode = !!currentUser;
  
  mainContent.innerHTML = `
    <div class="profile-page">
      <div class="profile-container">
        <!-- Cabeçalho da página -->
        <div class="profile-header">
          <h2>${isEditMode ? 'Edit Profile' : 'Create Profile'}</h2>
        </div>
        
        <!-- Formulário de perfil -->
        <form id="profile-form" class="profile-form">
          <!-- Campo de nome -->
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input type="text" id="name" class="form-control" value="${currentUser?.name || ''}" required>
          </div>
          
          <!-- Campo de email -->
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" value="${currentUser?.email || ''}" required>
          </div>
          
          <!-- Campo de avatar -->
          <div class="form-group">
            <label for="avatar" class="form-label">Avatar URL (optional)</label>
            <input type="url" id="avatar" class="form-control" value="${currentUser?.avatar || ''}">
            <small>Enter a URL to an image, or leave blank for default avatar.</small>
          </div>
          
          <!-- Campo de biografia -->
          <div class="form-group">
            <label for="bio" class="form-label">Bio (optional)</label>
            <textarea id="bio" class="form-control" rows="3">${currentUser?.bio || ''}</textarea>
          </div>
          
          <!-- Botões de ação -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              ${isEditMode ? 'Update Profile' : 'Create Profile'}
            </button>
            
            ${isEditMode ? `
              <button type="button" id="delete-profile-btn" class="btn btn-danger">Delete Profile</button>
            ` : ''}
            
            <button type="button" id="cancel-btn" class="btn">Cancel</button>
          </div>
        </form>
      </div>
      
      <!-- Lista de perfis existentes (apenas no modo de criação) -->
      ${!isEditMode && userService.getAllUsers().length > 0 ? `
        <div class="existing-profiles">
          <h3>Existing Profiles</h3>
          <div id="user-list" class="user-list"></div>
        </div>
      ` : ''}
    </div>
  `;
  
  // Adiciona estilos CSS específicos para a página
  const style = document.createElement('style');
  style.textContent = `
    /* Layout da página de perfil */
    .profile-page {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-3);
    }
    
    /* Container do formulário */
    .profile-container {
      background-color: white;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }
    
    /* Cabeçalho da página */
    .profile-header {
      padding: var(--spacing-2) var(--spacing-3);
      border-bottom: 1px solid var(--color-gray-200);
    }
    
    /* Formulário de perfil */
    .profile-form {
      padding: var(--spacing-3);
    }
    
    /* Botões de ação do formulário */
    .form-actions {
      display: flex;
      gap: var(--spacing-1);
      margin-top: var(--spacing-3);
    }
    
    /* Seção de perfis existentes */
    .existing-profiles {
      background-color: white;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
      padding: var(--spacing-3);
    }
    
    /* Título da seção de perfis existentes */
    .existing-profiles h3 {
      margin-bottom: var(--spacing-2);
    }
    
    /* Item de usuário na lista */
    .user-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2);
      border-bottom: 1px solid var(--color-gray-200);
    }
    
    /* Remove borda do último item */
    .user-item:last-child {
      border-bottom: none;
    }
    
    /* Avatar do usuário */
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--color-gray-300);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Imagem do avatar */
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;
  document.head.appendChild(style);
  
  // Exibe usuários existentes se não estiver em modo de edição
  if (!isEditMode && userService.getAllUsers().length > 0) {
    loadExistingUsers();
  }
  
  // Configura os eventos do formulário
  setupProfileEventListeners(isEditMode, currentUser);
}

// Função para carregar e exibir usuários existentes
function loadExistingUsers() {
  const userList = document.getElementById('user-list');
  const users = userService.getAllUsers();
  
  // Renderiza a lista de usuários
  userList.innerHTML = users.map(user => `
    <div class="user-item">
      <div class="user-avatar">
        ${user.avatar 
          ? `<img src="${user.avatar}" alt="${user.name}">`
          : `<span class="material-icons">person</span>`
        }
      </div>
      <div class="user-info">
        <div class="user-name">${user.name}</div>
        <div class="user-email">${user.email}</div>
      </div>
      <div class="user-actions">
        <button class="btn select-user-btn" data-id="${user.id}">Select</button>
        <button class="btn edit-user-btn" data-id="${user.id}">Edit</button>
      </div>
    </div>
  `).join('');
  
  // Adiciona evento de clique nos botões de seleção
  document.querySelectorAll('.select-user-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const userId = e.currentTarget.dataset.id;
      userService.setCurrentUser(userId);
      router.navigate('#/home');
    });
  });
  
  // Adiciona evento de clique nos botões de edição
  document.querySelectorAll('.edit-user-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const userId = e.currentTarget.dataset.id;
      userService.setCurrentUser(userId);
      renderProfilePage();
    });
  });
}

// Função para configurar os eventos do formulário
function setupProfileEventListeners(isEditMode, currentUser) {
  const profileForm = document.getElementById('profile-form');
  const cancelBtn = document.getElementById('cancel-btn');
  
  // Evento de envio do formulário
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Obtém os valores dos campos
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const avatar = document.getElementById('avatar').value.trim();
    const bio = document.getElementById('bio').value.trim();
    
    // Valida campos obrigatórios
    if (!name || !email) {
      alert('Name and email are required');
      return;
    }
    
    const userData = { name, email, avatar, bio };
    
    if (isEditMode) {
      // Atualiza usuário existente
      userService.updateUser(currentUser.id, userData);
    } else {
      // Cria novo usuário
      const newUser = userService.createUser(userData);
      userService.setCurrentUser(newUser.id);
    }
    
    // Recarrega o seletor de usuário
    loadUserSelect();
    
    // Redireciona para a página inicial
    router.navigate('#/home');
  });
  
  // Evento do botão cancelar
  cancelBtn.addEventListener('click', () => {
    // Se estiver em modo de edição, volta para a página de conta
    if (isEditMode) {
      router.navigate('#/login');
    } else {
      // Se houver usuários, vai para a página de login
      if (userService.getAllUsers().length > 0) {
        router.navigate('#/login');
      } else {
        // Caso contrário, permanece na página de perfil
        alert('You must create at least one profile to use the app.');
      }
    }
  });
  
  // Evento do botão de exclusão (apenas em modo de edição)
  if (isEditMode) {
    const deleteProfileBtn = document.getElementById('delete-profile-btn');
    
    deleteProfileBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this profile? All your projects and tasks will be deleted!')) {
        userService.deleteUser(currentUser.id);
        
        // Recarrega o seletor de usuário
        loadUserSelect();
        
        // Redireciona para a página de login
        router.navigate('#/login');
      }
    });
  }
}