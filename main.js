// Importando os arquivos necessários
// Importa o arquivo de estilo CSS
import './style.css'
// Importa o logo do JavaScript como um módulo
import javascriptLogo from './javascript.svg'
// Importa o logo do Vite como um módulo
import viteLogo from '/vite.svg'
// Importa a função setupCounter do arquivo counter.js
import { setupCounter } from './counter.js'

// Seleciona o elemento com id 'app' e insere o HTML da aplicação
// Este HTML cria a estrutura básica da página com logos e botão do contador
document.querySelector('#app').innerHTML = `
  <div>
    // Link para o site do Vite com seu logo
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    // Link para a documentação do JavaScript com seu logo
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    // Card contendo o botão do contador
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    // Texto de rodapé com link para a documentação
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

// Inicializa o contador no botão selecionado
setupCounter(document.querySelector('#counter'))
