// Página de Login/Conta - Gerencia autenticação e informações do usuário
import { userService } from '../services/userService.js';
import { router } from '../utils/router.js';

export function renderLoginPage() {
  // Obtém referência ao conteúdo principal e usuário atual
  const mainContent = document.getElementById('main-content');
  const currentUser = userService.getCurrentUser();
  
  // Se o usuário já estiver logado, exibe a página de conta
  if (currentUser) {
    renderAccountPage(currentUser);
    return;
  }
  
  // Caso contrário, exibe as opções de login
  mainContent.innerHTML = `
    <div class="login-page">
      <div class="login-container">
        <h2>Select a User</h2>
        <p>Please select an existing user or create a new profile.</p>
        
        <!-- Lista de usuários disponíveis -->
        <div id="user-list" class="user-list">
          Loading users...
        </div>
        
        <!-- Botões de ação -->
        <div class="action-buttons">
          <a href="#/profile" class="btn btn-primary">Create New Profile</a>
        </div>
      </div>
    </div>
  `;
  
  // Adiciona estilos CSS específicos para a página
  const style = document.createElement('style');
  style.textContent = `
    /* Layout da página de login */
    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    
    /* Container do formulário de login */
    .login-container {
      background-color: white;
      padding: var(--spacing-3);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-md);
      width: 100%;
      max-width: 500px;
    }
    
    /* Lista de usuários */
    .user-list {
      margin: var(--spacing-3) 0;
    }
    
    /* Card de usuário */
    .user-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
      padding: var(--spacing-2);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--spacing-1);
      border: 1px solid var(--color-gray-300);
      cursor: pointer;
      transition: background-color var(--transition-fast), transform var(--transition-fast);
    }
    
    /* Efeito hover no card de usuário */
    .user-card:hover {
      background-color: var(--color-gray-100);
      transform: translateY(-2px);
    }
    
    /* Avatar do usuário */
    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--color-gray-300);
      overflow: hidden;
    }
    
    /* Imagem do avatar */
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Informações do usuário */
    .user-info {
      flex-grow: 1;
    }
    
    /* Nome do usuário */
    .user-name {
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    /* Email do usuário */
    .user-email {
      font-size: 0.9rem;
      color: var(--color-gray-600);
    }
    
    /* Botões de ação */
    .action-buttons {
      display: flex;
      justify-content: center;
      margin-top: var(--spacing-3);
    }
  `;
  document.head.appendChild(style);
  
  // Carrega e exibe a lista de usuários
  loadUsers();
}

// Função para carregar e exibir a lista de usuários
function loadUsers() {
  const userList = document.getElementById('user-list');
  const users = userService.getAllUsers();
  
  // Se não houver usuários, exibe mensagem
  if (users.length === 0) {
    userList.innerHTML = `
      <div class="empty-state">
        <p>No users found. Please create a new profile.</p>
      </div>
    `;
    return;
  }
  
  // Renderiza a lista de usuários
  userList.innerHTML = users.map(user => `
    <div class="user-card" data-id="${user.id}">
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
      <span class="material-icons">chevron_right</span>
    </div>
  `).join('');
  
  // Adiciona evento de clique nos cards de usuário
  document.querySelectorAll('.user-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const userId = e.currentTarget.dataset.id;
      userService.setCurrentUser(userId);
      router.navigate('#/home');
    });
  });
}

// Função para renderizar a página de conta do usuário
function renderAccountPage(user) {
  const mainContent = document.getElementById('main-content');
  
  mainContent.innerHTML = `
    <div class="account-page">
      <!-- Cabeçalho da página de conta -->
      <div class="account-header">
        <div class="user-profile">
          <div class="user-avatar large">
            ${user.avatar 
              ? `<img src="${user.avatar}" alt="${user.name}">`
              : `<span class="material-icons" style="font-size: 48px;">person</span>`
            }
          </div>
          <div class="user-details">
            <h2>${user.name}</h2>
            <p>${user.email}</p>
          </div>
        </div>
        <!-- Botões de ação da conta -->
        <div class="account-actions">
          <a href="#/profile" class="btn">Edit Profile</a>
          <button id="logout-btn" class="btn btn-danger">Log Out</button>
        </div>
      </div>
      
      <!-- Corpo da página de conta -->
      <div class="account-body">
        <div class="account-section">
          <h3>Account Information</h3>
          <!-- Grid de informações da conta -->
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Name</span>
              <span class="info-value">${user.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">${user.email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Account Created</span>
              <span class="info-value">${new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            ${user.bio ? `
              <div class="info-item full-width">
                <span class="info-label">Bio</span>
                <span class="info-value">${user.bio}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Adiciona estilos CSS específicos para a página de conta
  const style = document.createElement('style');
  style.textContent = `
    /* Layout da página de conta */
    .account-page {
      background-color: white;
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }
    
    /* Cabeçalho da página de conta */
    .account-header {
      padding: var(--spacing-3);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-gray-200);
    }
    
    /* Perfil do usuário */
    .user-profile {
      display: flex;
      align-items: center;
      gap: var(--spacing-2);
    }
    
    /* Avatar grande do usuário */
    .user-avatar.large {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: var(--color-gray-300);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    /* Imagem do avatar grande */
    .user-avatar.large img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Botões de ação da conta */
    .account-actions {
      display: flex;
      gap: var(--spacing-1);
    }
    
    /* Corpo da página de conta */
    .account-body {
      padding: var(--spacing-3);
    }
    
    /* Seção de informações da conta */
    .account-section {
      margin-bottom: var(--spacing-3);
    }
    
    /* Grid de informações */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-2);
      margin-top: var(--spacing-2);
    }
    
    /* Item de informação */
    .info-item {
      padding: var(--spacing-2);
      background-color: var(--color-gray-50);
      border-radius: var(--border-radius-sm);
    }
    
    /* Item de informação em largura total */
    .info-item.full-width {
      grid-column: 1 / -1;
    }
    
    /* Rótulo da informação */
    .info-label {
      display: block;
      font-size: 0.9rem;
      color: var(--color-gray-600);
      margin-bottom: 4px;
    }
    
    /* Valor da informação */
    .info-value {
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);
  
  // Adiciona evento de logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    userService.clearCurrentUser();
    router.navigate('#/login');
  });
}