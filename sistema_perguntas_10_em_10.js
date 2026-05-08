/*
  SISTEMA DE PERGUNTAS ABERTAS - 10 EM 10
  Usa o array perguntasAbertas250 do arquivo perguntas_abertas_250.js.
*/

const QUANTIDADE_PERGUNTAS_POR_BLOCO = 10;
const XP_PERGUNTA_ABERTA = 20;

function normalizarTextoPergunta(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function pegarPerguntasConcluidas() {
    return JSON.parse(localStorage.getItem("perguntasConcluidas") || "[]");
}

function salvarPerguntasConcluidas(lista) {
    localStorage.setItem("perguntasConcluidas", JSON.stringify(lista));
}

function perguntaFoiConcluida(id) {
    return pegarPerguntasConcluidas().includes(id);
}

function marcarPerguntaComoConcluida(id) {
    const concluidas = pegarPerguntasConcluidas();

    if (!concluidas.includes(id)) {
        concluidas.push(id);
        salvarPerguntasConcluidas(concluidas);
    }
}

function obterPerguntasDisponiveis(linguagem) {
    return perguntasAbertas250.filter(function(pergunta) {
        return pergunta.linguagem === linguagem && !perguntaFoiConcluida(pergunta.id);
    });
}

function pegarProximasPerguntas(linguagem) {
    return obterPerguntasDisponiveis(linguagem).slice(0, QUANTIDADE_PERGUNTAS_POR_BLOCO);
}

function respostaTemPalavrasChave(respostaUsuario, pergunta) {
    const resposta = normalizarTextoPergunta(respostaUsuario);

    if (resposta.length < 15) {
        return {
            aprovado: false,
            mensagem: "Sua resposta ficou muito curta. Explique melhor antes de enviar."
        };
    }

    const palavrasEncontradas = pergunta.palavrasChave.filter(function(palavra) {
        return resposta.includes(normalizarTextoPergunta(palavra));
    });

    const passouPorPalavras =
        palavrasEncontradas.length >= (pergunta.minPalavrasChave || 2);

    const passouPorFrase = pergunta.frasesChave.some(function(grupo) {
        const encontradasDoGrupo = grupo.filter(function(palavra) {
            return resposta.includes(normalizarTextoPergunta(palavra));
        });

        return encontradasDoGrupo.length >= Math.min(2, grupo.length);
    });

    if (passouPorPalavras || passouPorFrase) {
        return {
            aprovado: true,
            mensagem: "Resposta aceita! Você usou pontos importantes na explicação."
        };
    }

    return {
        aprovado: false,
        mensagem: "Resposta ainda incompleta. Tente usar mais palavras importantes do conteúdo."
    };
}

function criarCardPerguntaAberta(pergunta) {
    const card = document.createElement("article");
    card.className = "task-card pergunta-aberta-card";

    card.innerHTML = `
        <div class="task-meta">
            <span>${escaparHTML(pergunta.linguagem)}</span>
            <span>${escaparHTML(pergunta.nivel)}</span>
        </div>

        <h4>${escaparHTML(pergunta.titulo)}</h4>

        <p>${escaparHTML(pergunta.pergunta)}</p>

        <textarea class="resposta-aberta"
                  placeholder="Digite sua resposta com suas palavras..."
                  rows="4"></textarea>

        <div class="acoes-pergunta">
            <button class="btn-responder-pergunta">Enviar resposta</button>
        </div>

        <p class="feedback-pergunta"></p>

        <details class="dica-pergunta">
            <summary>Ver dica</summary>
            <p>
                Tente usar ideias como:
                <strong>${pergunta.palavrasChave.slice(0, 5).map(escaparHTML).join(", ")}</strong>
            </p>
        </details>

        <div class="task-meta">
            <strong>${pergunta.xp || XP_PERGUNTA_ABERTA} XP</strong>
            <span>Pendente</span>
        </div>
    `;

    const textarea = card.querySelector(".resposta-aberta");
    const botao = card.querySelector(".btn-responder-pergunta");
    const feedback = card.querySelector(".feedback-pergunta");

    botao.addEventListener("click", function() {
        const resultado = respostaTemPalavrasChave(textarea.value, pergunta);

        feedback.textContent = resultado.mensagem;
        feedback.className = "feedback-pergunta " + (resultado.aprovado ? "ok" : "erro");

        if (!resultado.aprovado) {
            return;
        }

        marcarPerguntaComoConcluida(pergunta.id);

        if (!progresso.perguntas.includes(pergunta.id)) {
            progresso.perguntas.push(pergunta.id);
            progresso.xp += pergunta.xp || XP_PERGUNTA_ABERTA;
            salvarProgresso();
            atualizarResumo();
            renderizarEvolucao();
        }

        setTimeout(function() {
            renderizarPerguntas(pergunta.linguagem);
        }, 700);
    });

    return card;
}

function renderizarPerguntas(filtro) {
    const linguagemAtual = filtro || LINGUAGENS[0];

    const container =
        document.getElementById("questionsList") ||
        document.getElementById("perguntasList") ||
        document.getElementById("perguntaList");

    if (!container) {
        console.error("Não encontrei o container das perguntas. Crie uma div com id='questionsList' na área de perguntas.");
        return;
    }

    container.innerHTML = "";

    const perguntas = pegarProximasPerguntas(linguagemAtual);

    if (perguntas.length === 0) {
        container.innerHTML = `
            <article class="task-card">
                <h4>Todas as perguntas foram concluídas!</h4>
                <p>Parabéns! Você completou todas as perguntas disponíveis desta categoria.</p>
            </article>
        `;
        return;
    }

    perguntas.forEach(function(pergunta) {
        container.appendChild(criarCardPerguntaAberta(pergunta));
    });
}

function configurarFiltrosPerguntas() {
    const container =
        document.getElementById("questionFilters") ||
        document.getElementById("perguntaFilters");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    LINGUAGENS.forEach(function(linguagem, index) {
        const botao = document.createElement("button");
        botao.className = "filter-btn" + (index === 0 ? " active" : "");
        botao.textContent = linguagem;

        botao.addEventListener("click", function() {
            container.querySelectorAll("button").forEach(function(btn) {
                btn.classList.remove("active");
            });

            botao.classList.add("active");
            renderizarPerguntas(linguagem);
        });

        container.appendChild(botao);
    });
}

function iniciarSistemaPerguntasAbertas() {
    configurarFiltrosPerguntas();
    renderizarPerguntas(LINGUAGENS[0]);
}
