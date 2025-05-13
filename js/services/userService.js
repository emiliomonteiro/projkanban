// Serviço de gerenciamento de usuários - Gerencia operações CRUD e estado do usuário atual

class UserService {
  constructor() {
    // Chaves para armazenamento no localStorage
    this.storageKey = 'users';        // Armazena a lista de usuários
    this.currentUserKey = 'current-user'; // Armazena o ID do usuário atual
  }
  
  // Retorna todos os usuários cadastrados
  getAllUsers() {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : [];
  }
  
  // Busca um usuário específico pelo ID
  getUserById(id) {
    const users = this.getAllUsers();
    return users.find(user => user.id === id);
  }
  
  // Cria um novo usuário no sistema
  createUser(userData) {
    const users = this.getAllUsers();
    
    // Cria um novo objeto de usuário com dados padrão
    const newUser = {
      id: this.generateId(),          // Gera um ID único
      name: userData.name,            // Nome do usuário
      email: userData.email,          // Email do usuário
      bio: userData.bio || '',        // Biografia (opcional)
      avatar: userData.avatar || '',  // Avatar (opcional)
      createdAt: new Date().toISOString() // Data de criação
    };
    
    // Adiciona o novo usuário à lista
    users.push(newUser);
    
    // Salva a lista atualizada no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    
    return newUser;
  }
  
  // Atualiza os dados de um usuário existente
  updateUser(id, userData) {
    const users = this.getAllUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;
    
    // Atualiza os dados do usuário mantendo os dados existentes
    const updatedUser = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString() // Adiciona timestamp de atualização
    };
    
    // Substitui o usuário na lista
    users[index] = updatedUser;
    
    // Salva a lista atualizada no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    
    // Se o usuário atualizado for o usuário atual, atualiza também o usuário atual
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.setCurrentUser(id);
    }
    
    return updatedUser;
  }
  
  // Remove um usuário do sistema
  deleteUser(id) {
    const users = this.getAllUsers();
    // Filtra a lista removendo o usuário especificado
    const filteredUsers = users.filter(user => user.id !== id);
    
    // Salva a lista atualizada no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
    
    // Se o usuário removido for o usuário atual, limpa o usuário atual
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      this.clearCurrentUser();
    }
    
    return true;
  }
  
  // Retorna o usuário atualmente logado
  getCurrentUser() {
    const currentUserId = localStorage.getItem(this.currentUserKey);
    if (!currentUserId) return null;
    
    return this.getUserById(currentUserId);
  }
  
  // Define o usuário atual
  setCurrentUser(id) {
    localStorage.setItem(this.currentUserKey, id);
  }
  
  // Remove o usuário atual
  clearCurrentUser() {
    localStorage.removeItem(this.currentUserKey);
  }
  
  // Gera um ID único para novos usuários
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Exporta uma instância única do serviço de usuários
export const userService = new UserService();