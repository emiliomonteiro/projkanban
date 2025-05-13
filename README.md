# Projeto Vite Starter

Uma aplicação web moderna construída com Vite, apresentando uma estrutura de projeto limpa e organizada.

## 🚀 Funcionalidades

- JavaScript moderno com módulos ES
- Servidor de desenvolvimento rápido com Hot Module Replacement (HMR)
- Builds otimizados para produção
- Estrutura de projeto limpa
- Arquitetura baseada em componentes

## 📁 Estrutura do Projeto

```
├── css/              # Folhas de estilo
│   └── main.css     # Estilo principal
├── js/              # Código fonte JavaScript
│   ├── components/  # Componentes UI reutilizáveis
│   ├── pages/       # Código específico de páginas
│   ├── services/    # Código relacionado a serviços
│   ├── utils/       # Funções utilitárias
│   └── main.js      # Ponto de entrada da aplicação
├── public/          # Arquivos estáticos
│   └── vite.svg     # Logo do Vite
└── index.html       # Arquivo HTML principal
```

## 🛠️ Pré-requisitos

- Node.js (Versão LTS mais recente recomendada)
- npm (vem com o Node.js)

## 🚀 Começando

1. Clone o repositório:
   ```bash
   git clone [url-do-seu-repositorio]
   cd [nome-do-seu-projeto]
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra seu navegador e acesse:
   ```
   http://localhost:5173
   ```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build para produção
- `npm run preview` - Visualiza o build de produção localmente

## 🏗️ Build

Para criar um build de produção:

```bash
npm run build
```

O resultado do build será gerado no diretório `dist`.

## 🔧 Desenvolvimento

O projeto utiliza Vite como ferramenta de build, que oferece:
- Servidor de desenvolvimento rápido
- Hot Module Replacement (HMR)
- Builds otimizados para produção
- Suporte a recursos modernos de JavaScript

## 📦 Dependências

- Vite ^5.4.2 - Ferramenta de build e servidor de desenvolvimento

## 🤝 Como Contribuir

1. Faça um fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/NovaFuncionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👥 Autores

- Seu Nome - Trabalho inicial

## 🙏 Agradecimentos

- [Vite](https://vitejs.dev/) - Pela incrível ferramenta de build
- Todos os contribuidores que ajudaram a moldar este projeto 


#To-Do:
Tornar e-mail do usuario em id único
Criar campo de senha e exigir validação no momento da troca de usuário
Ao fazer o logout do usuário, atualizar a página e exigir um novo login ou criação de usuário
