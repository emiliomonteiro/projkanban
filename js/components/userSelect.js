// Componente de seleção de usuário - Gerencia a seleção e exibição do usuário atual
import { userService } from '../services/userService.js';
import { router } from '../utils/router.js';

export function loadUserSelect() {
  // Obtém referências aos elementos do DOM
  const userSelect = document.getElementById('user-select');
  const currentUserDisplay = document.getElementById('current-user-display');
  
  // Limpa as opções existentes e adiciona a opção padrão
  userSelect.innerHTML = '<option value="">Select a user</option>';
  
  // Obtém todos os usuários do serviço
  const users = userService.getAllUsers();
  
  // Adiciona cada usuário como uma opção no dropdown
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    userSelect.appendChild(option);
  });
  
  // Obtém o usuário atual
  const currentUser = userService.getCurrentUser();
  
  // Define o valor do select para o usuário atual, se existir
  if (currentUser) {
    userSelect.value = currentUser.id;
    currentUserDisplay.querySelector('.user-name').textContent = currentUser.name;
  } else {
    currentUserDisplay.querySelector('.user-name').textContent = 'No user selected';
  }
  
  // Gerencia a mudança de seleção do usuário
  userSelect.addEventListener('change', (e) => {
    const userId = e.target.value;
    
    if (userId) {
      // Atualiza o usuário atual e a exibição
      userService.setCurrentUser(userId);
      const user = userService.getUserById(userId);
      currentUserDisplay.querySelector('.user-name').textContent = user.name;
      
      // Recarrega a página atual para atualizar os dados
      router.handleRouteChange();
    } else {
      // Limpa o usuário atual se nenhum for selecionado
      userService.clearCurrentUser();
      currentUserDisplay.querySelector('.user-name').textContent = 'No user selected';
    }
  });
  
  // Redireciona para a página de perfil se não houver usuários e não estiver nela
  if (users.length === 0 && window.location.hash !== '#/profile') {
    router.navigate('#/profile');
  }
}