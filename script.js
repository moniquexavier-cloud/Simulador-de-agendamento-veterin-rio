// 1. Dados iniciais em memória (RNF05)
let pets = [
  { id: 1, nome: 'Pipoca', tutor: 'Fulano', codigo: 'PET-101', status: 'em_atendimento', servico: 'Banho e Tosa' },
  { id: 2, nome: 'Thor', tutor: 'Mariana Lima', codigo: 'PET-102', status: 'aguardando', servico: '' },
  { id: 3, nome: 'Luna', tutor: 'Carlos Souza', codigo: 'PET-103', status: 'aguardando', servico: '' }
];

//Função para mostrar alerta 
//"function mostrarAlerta(mensagem, tipo = 'sucesso')": Define a função. Ela recebe o texto da mensagem e o tipo do alerta (como 'sucesso' ou 'erro').
//"const alerta ": Busca elemento ID que contenha 'alerta'
//"alerta.textContent = mensagem": Insere o texto que você passou no parâmetro dentro desse elemento HTML.
//"alerta.className = alerta ${tipo}": Substitui todas as classes CSS do elemento. Ele garante que a classe base alerta fique ativa junto com a classe do tipo escolhido
// 2. Função de Banner de Alerta (RF08)
function mostrarAlerta(mensagem, tipo = 'sucesso') {
  const alerta = document.getElementById('alerta');
  alerta.textContent = mensagem;
  alerta.className = `alerta ${tipo}`;

  setTimeout(() => {
    alerta.classList.add('oculto');
  }, 4000);
}

// 3. Atualiza o <select> (RF04) e os Cards (RF06 e RF07)
function atualizarTela() {
  const selectPet = document.getElementById('select-pet');
  const listaCards = document.getElementById('lista-cards');

// Limpa antes de redesenhar
// "selectPet.innerHTML": Apaga todas as opções que estivessem no "selecione um pet"
// "listaCards.innerHTML": Remove completamente todos os cards (<article>) que estavam sendo exibidos na tela
// Limpa antes de redesenhar
  selectPet.innerHTML = '<option value="">Selecione um Pet...</option>';
  listaCards.innerHTML = '';

  pets.forEach(pet => {
    // RF04: Adiciona no <select> APENAS quem está "aguardando"
    if (pet.status === 'aguardando') {
      const option = document.createElement('option');
      option.value = pet.id;
      option.textContent = `${pet.nome} (${pet.codigo}) - Tutor: ${pet.tutor}`;
      selectPet.appendChild(option);
    }

    // RF06: Monta o cartão (<article>) para todos os pets
    const card = document.createElement('article');
    card.className = `card ${pet.status}`;

    const textoStatus = pet.status === 'aguardando' ? 'Aguardando' : 'Em Atendimento';

    // RF07: Se estiver em atendimento, mostra o serviço e o botão de concluir
    const htmlAtendimento = pet.status === 'em_atendimento'
      ? `
        <p><strong>Serviço:</strong> ${pet.servico}</p>
        <button type="button" class="btn-concluir" onclick="concluirAtendimento(${pet.id})">
          Concluir Atendimento
        </button>
      `
      : '';

    card.innerHTML = `
      <h3>${pet.nome} <small>(${pet.codigo})</small></h3>
      <p><strong>Tutor:</strong> ${pet.tutor}</p>
      <span class="badge ${pet.status}">${textoStatus}</span>
      ${htmlAtendimento}
    `;

    listaCards.appendChild(card);
  });
}

// 4. Cadastro de Novo Pet (RF01, RF02, RF03)
document.getElementById('form-cadastro').addEventListener('submit', function (event) {
  event.preventDefault();

  const nome = document.getElementById('nome-pet').value.trim();
  const tutor = document.getElementById('nome-tutor').value.trim();
  const codigo = document.getElementById('codigo-pet').value.trim().toUpperCase();

  // RF02: Validação de campos vazios ou só com espaços
  if (nome === '' || tutor === '' || codigo === '') {
    mostrarAlerta('Preencha todos os campos do pet antes de cadastrar!', 'erro');
    return;
  }

  // RF03: Validação de código de ficha único
  const codigoExiste = pets.some(pet => pet.codigo === codigo);
  if (codigoExiste) {
    mostrarAlerta(`O código ${codigo} já está cadastrado!`, 'erro');
    return;
  }

  // RF01: Adiciona o novo pet com status inicial "aguardando"
  const novoPet = {
    id: Date.now(),
    nome: nome,
    tutor: tutor,
    codigo: codigo,
    status: 'aguardando',
    servico: ''
  };

  pets.unshift(novoPet);
  this.reset();
  mostrarAlerta('Pet cadastrado com sucesso!', 'sucesso');
  atualizarTela();
});

// 5. Registrar Atendimento (RF02, RF05)
document.getElementById('form-atendimento').addEventListener('submit', function (event) {
  event.preventDefault();

  const petId = Number(document.getElementById('select-pet').value);
  const servico = document.getElementById('select-servico').value;

  if (!petId || servico === '') {
    mostrarAlerta('Selecione um pet disponível e um serviço!', 'erro');
    return;
  }

  const pet = pets.find(p => p.id === petId);
  if (pet) {
    pet.status = 'em_atendimento';
    pet.servico = servico;
  }

  this.reset();
  mostrarAlerta('Atendimento iniciado com sucesso!', 'sucesso');
  atualizarTela();
});

// 6. Concluir Atendimento (RF07)
function concluirAtendimento(petId) {
  const pet = pets.find(p => p.id === petId);
  if (pet) {
    pet.status = 'aguardando';
    pet.servico = '';
    mostrarAlerta('Atendimento concluído! Pet disponível na recepção.', 'sucesso');
    atualizarTela();
  }
}

// Inicializa a interface ao abrir a página
atualizarTela();