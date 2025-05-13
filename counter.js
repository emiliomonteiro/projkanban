// Função que configura o contador no elemento especificado
export function setupCounter(element) {
  // Variável que armazena o valor atual do contador
  let counter = 0
  
  // Função que atualiza o contador e o texto do elemento
  const setCounter = (count) => {
    counter = count
    // Atualiza o texto do elemento com o valor atual do contador
    element.innerHTML = `count is ${counter}`
  }
  
  // Adiciona um evento de clique ao elemento que incrementa o contador
  element.addEventListener('click', () => setCounter(counter + 1))
  
  // Inicializa o contador com o valor 0
  setCounter(0)
}
