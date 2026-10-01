let botoes = document.querySelectorAll(".botoes__modalidade button");
let modalidadePreDefinicao = document.querySelector(".resultado__pre__edicao");
let horarioEntrada = document.querySelector(".horario__entrada");
let horarioSaida = document.querySelector(".horario__saida");
let nomeUsuario = document.querySelector(".nome__usuario");
let infoAgendamento = document.querySelector(".agendamentos__confirmados");
let botaoConfirmar = document.querySelector(".botao__confirmar");
let contagemAgendamentos = document.querySelector(".contagem__agendamentos");
let botaoExcluir = document.querySelector(".botao__excluir__agendamento");
let containerAgendamento = document.querySelector(".agendamentos__container");

let modalidade = "Futebol";

function mostrarModalidade() {
  modalidadePreDefinicao.innerHTML = `${modalidade}. ${horarioEntrada.value} - ${horarioSaida.value}`;
}

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    botoes.forEach((botao) => {
      botao.classList.remove("ativo");
    });
    botao.classList.add("ativo");

    modalidade = botao.textContent;

    mostrarModalidade();
  });
});

horarioEntrada.addEventListener("change", mostrarModalidade);
horarioSaida.addEventListener("change", mostrarModalidade);

let numeroAgendamentos = 0;

botaoConfirmar.addEventListener("click", async () => {
  const cliente = {
    nome: nomeUsuario.value,
    esporte: modalidade,
    horario_entrada: horarioEntrada.value,
    horario_saida: horarioSaida.value,
  };

  if (!nomeUsuario.value) {
    return alert("Digite um nome para agendar o horário!");
  }

  const containerAgendamento = document.querySelector(
    ".agendamentos__container",
  );
  const cardAgendamento = document.createElement("div");
  cardAgendamento.classList.add("agendamentos__confirmados");

  const resposta = await fetch("http://localhost:3000/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  });
  const dados = await resposta.json();
  cardAgendamento.dataset.id = dados.id;

  cardAgendamento.innerHTML += `
            <p>${nomeUsuario.value} - ${modalidade}</p>
            <div class="info__agendamento">
              <p>${horarioEntrada.value} - ${horarioSaida.value}</p>
              <button class="botao__excluir__agendamento">Excluir</button>
            </div>
          `;
  numeroAgendamentos++;
  contagemAgendamentos.innerHTML = `AGENDAMENTOS CONFIRMADOS (${numeroAgendamentos})`;
  containerAgendamento.appendChild(cardAgendamento);
});

containerAgendamento.addEventListener("click", async (evento) => {
  numeroAgendamentos--;
  contagemAgendamentos.innerHTML = `AGENDAMENTOS CONFIRMADOS (${numeroAgendamentos})`;
  if (evento.target.closest(".botao__excluir__agendamento")) {
    const agendamento = evento.target.closest(".agendamentos__confirmados");
    const id = agendamento.dataset.id;

    const reeposta = await fetch(`http://localhost:3000/deletar/${id}`, {
      method: "DELETE",
    });
    agendamento.remove();
  }
});
