// ====== Fila FIFO de personagens ======
const fila = []; // estrutura de fila (FIFO) em JavaScript

const botaoAdicionar = document.getElementById('botao-adicionar');
const botaoRemover = document.getElementById('botao-remover');
const status = document.getElementById('status');
const listaFila = document.getElementById('lista-fila');
const inputId = document.getElementById('id-personagem');

// Função para adicionar um item à fila
function adicionarItem(personagem) {
  fila.push(personagem); // enqueue: adiciona no fim da fila
  mostrarStatus(`Adicionar: ${personagem.name}`);
  renderizarFila();
}

// Função para remover um item da fila
function removerItem() {
  if (fila.length === 0) {
    mostrarStatus('A fila já está vazia.', true);
    return;
  }
  const removido = fila.shift(); // dequeue: remove o primeiro elemento
  mostrarStatus(`Removido: ${removido.name}`);
  renderizarFila();
}

// Função para renderizar a fila na interface
function renderizarFila() {
  listaFila.innerHTML = '';

  if (fila.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'fila-vazia';
    vazio.textContent = 'A fila está vazia. Adicione personagens para começar.';
    listaFila.appendChild(vazio);
    return;
  }

  fila.forEach((personagem, index) => {
    const item = document.createElement('div');
    item.className = 'item-fila';
    if (index === 0) {
      item.classList.add('primeiro');
    }

    item.innerHTML = `
      <img class="imagem-personagem" src="${personagem.image}" alt="${personagem.name}" />
      <div class="conteudo-personagem">
        <h3 class="nome-personagem">${personagem.name}</h3>
        <p class="especie">${personagem.species} - ${personagem.status}</p>
        <p class="especie">Origem: ${personagem.origin.name}</p>
      </div>
    `;

    listaFila.appendChild(item);
  });
}

// Mostra mensagem de status com feedback visual
function mostrarStatus(texto, erro = false) {
  status.textContent = texto;
  status.style.color = erro ? '#fb7185' : '#4dd0a8';
}

// Busca personagem na API Rick and Morty pelo ID
function buscarPersonagemPorId(id) {
  const url = `https://rickandmortyapi.com/api/character/${id}`;

  mostrarStatus('Buscando personagem...');

  fetch(url)
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error('Personagem não encontrado');
      }
      return resposta.json();
    })
    .then((dados) => {
      adicionarItem(dados);
    })
    .catch((erro) => {
      mostrarStatus('Erro: ' + erro.message, true);
    });
}

// Evento do botão Adicionar
botaoAdicionar.addEventListener('click', () => {
  const id = Number(inputId.value);

  if (!id || id < 1 || id > 826) {
    const idAleatorio = Math.floor(Math.random() * 826) + 1;
    buscarPersonagemPorId(idAleatorio);
    return;
  }

  buscarPersonagemPorId(id);
});

// Evento do botão Remover
botaoRemover.addEventListener('click', () => {
  removerItem();
});

// Inicializa a interface com a fila vazia
renderizarFila();
