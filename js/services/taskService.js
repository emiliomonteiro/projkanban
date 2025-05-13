// Serviço de Gerenciamento de Tarefas - Gerencia operações CRUD para tarefas

class TaskService {
  constructor() {
    // Chave para armazenamento no localStorage
    this.storageKey = 'tasks';
  }
  
  // Obtém todas as tarefas armazenadas
  getAllTasks() {
    const tasks = localStorage.getItem(this.storageKey);
    return tasks ? JSON.parse(tasks) : [];
  }
  
  // Busca uma tarefa específica pelo ID
  getTaskById(id) {
    const tasks = this.getAllTasks();
    return tasks.find(task => task.id === id);
  }
  
  // Obtém todas as tarefas de um projeto específico
  getTasksByProjectId(projectId) {
    const tasks = this.getAllTasks();
    return tasks.filter(task => task.projectId === projectId);
  }
  
  // Obtém todas as tarefas de um usuário específico
  getTasksByUserId(userId) {
    const tasks = this.getAllTasks();
    return tasks.filter(task => task.userId === userId);
  }
  
  // Cria uma nova tarefa
  createTask(taskData) {
    const tasks = this.getAllTasks();
    
    // Cria um novo objeto de tarefa
    const newTask = {
      id: this.generateId(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending', // pending, in-progress, completed
      projectId: taskData.projectId,
      userId: taskData.userId,
      createdAt: new Date().toISOString()
    };
    
    // Adiciona à lista de tarefas
    tasks.push(newTask);
    
    // Salva no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    
    return newTask;
  }
  
  // Atualiza uma tarefa existente
  updateTask(id, taskData) {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) return null;
    
    // Atualiza os dados da tarefa
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    // Substitui a tarefa na lista
    tasks[index] = updatedTask;
    
    // Salva no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    
    return updatedTask;
  }
  
  // Remove uma tarefa específica
  deleteTask(id) {
    const tasks = this.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    // Salva no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));
    
    return true;
  }
  
  // Remove todas as tarefas de um projeto específico
  deleteTasksByProjectId(projectId) {
    const tasks = this.getAllTasks();
    const filteredTasks = tasks.filter(task => task.projectId !== projectId);
    
    // Salva no localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));
    
    return true;
  }
  
  // Gera um ID único para novas tarefas
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Exporta uma instância única do serviço
export const taskService = new TaskService();