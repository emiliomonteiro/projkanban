// Serviço de API para busca de dados - Gerencia a comunicação com APIs externas e dados de exemplo

class ApiService {
  constructor() {
    // Dados JSON de exemplo (usado como fallback quando não há internet)
    this.sampleData = {
      projects: [
        {
          id: 'sample1',
          name: 'E-commerce Platform',
          description: 'Build a full-featured e-commerce platform with product listings, cart, and checkout',
          tasks: [
            { id: 't1', title: 'Design Database Schema', status: 'completed' },
            { id: 't2', title: 'Implement User Authentication', status: 'in-progress' },
            { id: 't3', title: 'Create Product Listing Page', status: 'pending' }
          ]
        },
        {
          id: 'sample2',
          name: 'Budget Tracker App',
          description: 'Personal finance app to track income and expenses',
          tasks: [
            { id: 't4', title: 'Design UI Mockups', status: 'completed' },
            { id: 't5', title: 'Implement Transaction Entry', status: 'completed' },
            { id: 't6', title: 'Create Reports Dashboard', status: 'in-progress' }
          ]
        },
        {
          id: 'sample3',
          name: 'Social Media Dashboard',
          description: 'Unified dashboard for tracking social media metrics across platforms',
          tasks: [
            { id: 't7', title: 'API Integration Research', status: 'completed' },
            { id: 't8', title: 'Data Visualization Components', status: 'in-progress' },
            { id: 't9', title: 'User Settings Page', status: 'pending' }
          ]
        }
      ]
    };
  }
  
  // Busca dados de uma API externa (JSONPlaceholder)
  async fetchExternalData() {
    try {
      // Faz a requisição para a API
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Converte a resposta para JSON
      const data = await response.json();
      
      // Transforma os dados da API para corresponder à estrutura do nosso app
      const transformedData = {
        projects: [
          {
            id: 'api1',
            name: 'API Imported Tasks',
            description: 'Tasks imported from JSONPlaceholder API',
            tasks: data.slice(0, 10).map(item => ({
              id: `api-${item.id}`,
              title: item.title,
              status: item.completed ? 'completed' : 'pending'
            }))
          }
        ]
      };
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching data:', error);
      // Retorna os dados de exemplo como fallback em caso de erro
      return this.sampleData;
    }
  }
  
  // Carrega os dados JSON de exemplo
  loadSampleData() {
    return new Promise(resolve => {
      // Simula um atraso de carregamento
      setTimeout(() => {
        resolve(this.sampleData);
      }, 500);
    });
  }
}

// Exporta uma instância única do serviço
export const apiService = new ApiService();