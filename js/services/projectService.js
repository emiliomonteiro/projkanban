// Serviço de gerenciamento de projetos - Gerencia operações CRUD e relacionamentos de projetos

class ProjectService {
  constructor() {
    // Chave para armazenamento dos projetos no localStorage
    this.storageKey = 'projects';
  }
  
  // Retorna todos os projetos cadastrados
  getAllProjects() {
    const projects = localStorage.getItem(this.storageKey);
    return projects ? JSON.parse(projects) : [];
  }
  
  // Busca um projeto específico pelo ID
  getProjectById(id) {
    const projects = this.getAllProjects();
    return projects.find(project => project.id === id);
  }
  
  // Retorna todos os projetos de um usuário específico
  getProjectsByUserId(userId) {
    const projects = this.getAllProjects();
    return projects.filter(project => project.userId === userId);
  }
  
  // Retorna os projetos que um usuário está seguindo
  getFollowingProjects(userId) {
    const projects = this.getAllProjects();
    return projects.filter(project => 
      project.followers && project.followers.includes(userId)
    );
  }
  
  // Cria um novo projeto no sistema
  createProject(projectData) {
    const projects = this.getAllProjects();
    
    // Cria um novo objeto de projeto com dados padrão
    const newProject = {
      id: this.generateId(),          // Gera um ID único
      name: projectData.name,         // Nome do projeto
      description: projectData.description || '', // Descrição (opcional)
      userId: projectData.userId,     // ID do usuário criador
      followers: [],                  // Lista inicial de seguidores vazia
      createdAt: new Date().toISOString() // Data de criação
    };
    
    // Adiciona o novo projeto à lista
    projects.push(newProject);
    
    // Salva a lista atualizada no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    
    return newProject;
  }
  
  // Atualiza os dados de um projeto existente
  updateProject(id, projectData) {
    const projects = this.getAllProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index === -1) return null;
    
    // Atualiza os dados do projeto mantendo os dados existentes
    const updatedProject = {
      ...projects[index],
      ...projectData,
      updatedAt: new Date().toISOString() // Adiciona timestamp de atualização
    };
    
    // Substitui o projeto na lista
    projects[index] = updatedProject;
    
    // Salva a lista atualizada no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    
    return updatedProject;
  }
  
  // Remove um projeto do sistema
  deleteProject(id) {
    const projects = this.getAllProjects();
    // Filtra a lista removendo o projeto especificado
    const filteredProjects = projects.filter(project => project.id !== id);
    
    // Salva a lista atualizada no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(filteredProjects));
    
    return true;
  }
  
  // Adiciona um usuário como seguidor de um projeto
  followProject(projectId, userId) {
    const project = this.getProjectById(projectId);
    if (!project) return null;
    
    // Cria o array de seguidores se não existir
    if (!project.followers) {
      project.followers = [];
    }
    
    // Adiciona o usuário aos seguidores se ainda não estiver seguindo
    if (!project.followers.includes(userId)) {
      project.followers.push(userId);
      this.updateProject(projectId, { followers: project.followers });
    }
    
    return project;
  }
  
  // Remove um usuário dos seguidores de um projeto
  unfollowProject(projectId, userId) {
    const project = this.getProjectById(projectId);
    if (!project || !project.followers) return null;
    
    // Remove o usuário da lista de seguidores
    project.followers = project.followers.filter(id => id !== userId);
    this.updateProject(projectId, { followers: project.followers });
    
    return project;
  }
  
  // Gera um ID único para novos projetos
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Exporta uma instância única do serviço de projetos
export const projectService = new ProjectService();