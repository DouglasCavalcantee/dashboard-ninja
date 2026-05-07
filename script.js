/* =========================================================
   CONFIGURAÇÕES PRINCIPAIS DO SISTEMA
========================================================= */
const LINGUAGENS = ["HTML", "CSS", "JavaScript", "Python", "Inglês"];

const XP_MISSAO = 20;
const XP_PERGUNTA = 20;
const XP_EXERCICIO = 10;
const XP_HOKAGE = 8000;

const RANKS = [
    { nome: "Gennin", xp: 0, icon: "icons/gennin.png" },
    { nome: "Chunnin", xp: 800, icon: "icons/chunnin.png" },
    { nome: "Jounnin", xp: 2000, icon: "icons/jounnin.png" },
    { nome: "Jounnin Épico", xp: 3600, icon: "icons/jounnin_epico.png" },
    { nome: "Jounnin Lendário", xp: 5600, icon: "icons/jounnin_lendario.png" },
    { nome: "Hokage", xp: 8000, icon: "icons/hokage.png" }
];

/* =========================================================
   BANCO LOCAL DO USUÁRIO
========================================================= */
let progresso = JSON.parse(localStorage.getItem("progressoNinja")) || {
    xp: 0,
    missoes: [],
    exercicios: [],
    perguntas: [],
    perguntaAtual: 0
};

/* =========================================================
   LOGIN E CONTAS
========================================================= */

const btnLogin = document.getElementById("btnLogin");

if (btnLogin) {

    btnLogin.addEventListener("click", entrar);

    document.addEventListener("keydown", function(evento) {

        if (evento.key === "Enter") {
            entrar();
        }

    });

}

/* =========================
   ABRIR MODAL
========================= */

function abrirModal() {

    document.getElementById("modal-criar-conta").style.display = "flex";

}

/* =========================
   FECHAR MODAL
========================= */

function fecharModal() {

    document.getElementById("modal-criar-conta").style.display = "none";

}

/* =========================
   CRIAR CONTA
========================= */

function salvarConta() {

    const novoLogin = document.getElementById("novoLogin").value.trim();
    const novaSenha = document.getElementById("novaSenha").value.trim();

    const mensagem = document.getElementById("mensagem-criar-conta");

    if (novoLogin === "" || novaSenha === "") {

        mensagem.textContent = "Preencha todos os campos.";
        return;

    }

    const usuario = {
        login: novoLogin,
        senha: novaSenha
    };

    localStorage.setItem("usuarioNinja", JSON.stringify(usuario));

    mensagem.textContent = "Conta criada com sucesso!";

    setTimeout(() => {

        fecharModal();

        document.getElementById("novoLogin").value = "";
        document.getElementById("novaSenha").value = "";

        mensagem.textContent = "";

    }, 1500);

}

/* =========================
   LOGIN
========================= */

function entrar() {

    const loginDigitado = document.getElementById("login").value.trim();
    const senhaDigitada = document.getElementById("senha").value.trim();

    const mensagem = document.getElementById("mensagem-login");

    const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioNinja"));

    if (!usuarioSalvo) {

        mensagem.style.display = "block";
        mensagem.textContent = "Nenhuma conta criada.";

        return;

    }

    if (
        loginDigitado === usuarioSalvo.login &&
        senhaDigitada === usuarioSalvo.senha
    ) {

        localStorage.setItem("usuarioLogado", "true");

        window.location.href = "dashboard.html";

    } else {

        mensagem.style.display = "block";
        mensagem.textContent = "Login ou senha incorretos.";

    }

}

/* =========================
   LOGOUT
========================= */

function sairDoSistema() {

    localStorage.removeItem("usuarioLogado");

    window.location.href = "index.html";

}

/* =========================================================
   GERAÇÃO DE MISSÕES E EXERCÍCIOS
========================================================= */
function gerarMissoes() {
    const modelos = {
        HTML: [
            "Criar uma estrutura completa com header, main e footer",
            "Montar uma página com títulos, parágrafos e links",
            "Criar um formulário com input, label e button",
            "Criar uma tabela organizada com dados fictícios",
            "Usar tags semânticas em uma página de portfólio",
            "Adicionar imagens com alt bem escrito",
            "Criar uma página de contato",
            "Criar uma lista ordenada e uma lista não ordenada"
        ],
        CSS: [
            "Estilizar uma página com cores e fontes",
            "Criar cards usando box-shadow e border-radius",
            "Montar layout com Flexbox",
            "Montar layout com CSS Grid",
            "Criar efeito hover em botões",
            "Criar página responsiva com media query",
            "Criar um menu de navegação estilizado",
            "Criar animação simples com transition"
        ],
        JavaScript: [
            "Criar um contador com botão de somar",
            "Manipular texto com innerText",
            "Criar evento de clique em botão",
            "Validar campo vazio em formulário",
            "Adicionar item em uma lista com array",
            "Remover item de uma lista",
            "Criar condição if e else em uma página",
            "Salvar informação no localStorage"
        ],
        Python: [
            "Criar programa que calcula média",
            "Criar tabuada usando for",
            "Criar lista de compras com append",
            "Usar while para repetir entrada do usuário",
            "Criar função simples com def",
            "Verificar número par ou ímpar",
            "Criar contador de números positivos",
            "Trabalhar com dicionários simples"
        ],
        Inglês: [
            "Estudar 10 palavras de tecnologia",
            "Traduzir 5 comandos comuns de programação",
            "Criar frases com simple present",
            "Treinar perguntas com do e does",
            "Ler uma documentação curta em inglês",
            "Anotar 10 termos usados no GitHub",
            "Praticar vocabulário de HTML e CSS",
            "Escrever uma apresentação curta em inglês"
        ]
    };

    const missoes = [];
    LINGUAGENS.forEach(function(linguagem) {
        for (let i = 1; i <= 40; i++) {
            const nivel = i <= 13 ? "Básico" : i <= 27 ? "Intermediário" : "Avançado";
            const textoBase = modelos[linguagem][(i - 1) % modelos[linguagem].length];
            missoes.push({
                id: `missao-${linguagem}-${i}`,
                linguagem,
                nivel,
                titulo: `${linguagem} - Missão ${i}`,
                descricao: textoBase,
                xp: XP_MISSAO
            });
        }
    });
    return missoes;
}

function gerarExercicios() {
    const exercicios = [];
    LINGUAGENS.forEach(function(linguagem) {
        for (let i = 1; i <= 20; i++) {
            const nivel = i <= 7 ? "Básico" : i <= 14 ? "Intermediário" : "Avançado";
            exercicios.push({
                id: `exercicio-${linguagem}-${i}`,
                linguagem,
                nivel,
                titulo: `${linguagem} - Exercício ${i}`,
                descricao: `Resolver um exercício prático de ${linguagem} no nível ${nivel.toLowerCase()}.`,
                xp: XP_EXERCICIO
            });
        }
    });
    return exercicios;
}

const MISSOES = gerarMissoes();
const EXERCICIOS = gerarExercicios();

/* =========================================================
   INICIALIZAÇÃO DO DASHBOARD
========================================================= */
if (document.body.classList.contains("dashboard-body")) {
    iniciarDashboard();
}

function iniciarDashboard() {
    mostrarNomeUsuario();

    configurarMenu();
    renderizarRanks();
    renderizarFiltros("missionFilters", renderizarMissoes);
    renderizarFiltros("exerciseFilters", renderizarExercicios);
    renderizarMissoes("Todos");
    renderizarExercicios("Todos");
    renderizarPergunta();
    renderizarEvolucao();
    atualizarResumo();
    configurarBotoesGlobais();
}

/* =========================================================
   MENU DE SEÇÕES
========================================================= */
function configurarMenu() {
    const botoes = document.querySelectorAll(".menu-btn");
    const secoes = document.querySelectorAll(".content-section");

    botoes.forEach(function(botao) {
        botao.addEventListener("click", function() {
            botoes.forEach(btn => btn.classList.remove("active"));
            secoes.forEach(secao => secao.classList.remove("active-section"));

            botao.classList.add("active");
            document.getElementById(botao.dataset.section).classList.add("active-section");
        });
    });
}

/* =========================================================
   FILTROS
========================================================= */
function renderizarFiltros(containerId, callback) {
    const container = document.getElementById(containerId);
    const opcoes = ["Todos", ...LINGUAGENS];

    container.innerHTML = "";

    opcoes.forEach(function(opcao) {
        const botao = document.createElement("button");
        botao.className = "filter-btn" + (opcao === "Todos" ? " active" : "");
        botao.textContent = opcao;
        botao.addEventListener("click", function() {
            container.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            botao.classList.add("active");
            callback(opcao);
        });
        container.appendChild(botao);
    });
}

/* =========================================================
   MISSÕES
========================================================= */
function renderizarMissoes(filtro = "Todos") {
    const lista = document.getElementById("missionsList");
    const dados = filtro === "Todos" ? MISSOES : MISSOES.filter(item => item.linguagem === filtro);

    lista.innerHTML = "";

    dados.forEach(function(missao) {
        const concluida = progresso.missoes.includes(missao.id);
        const card = criarTaskCard(missao, concluida, "missao");
        lista.appendChild(card);
    });
}

/* =========================================================
   EXERCÍCIOS
========================================================= */
function renderizarExercicios(filtro = "Todos") {
    const lista = document.getElementById("exercisesList");
    const dados = filtro === "Todos" ? EXERCICIOS : EXERCICIOS.filter(item => item.linguagem === filtro);

    lista.innerHTML = "";

    dados.forEach(function(exercicio) {
        const concluido = progresso.exercicios.includes(exercicio.id);
        const card = criarTaskCard(exercicio, concluido, "exercicio");
        lista.appendChild(card);
    });
}

function criarTaskCard(item, concluido, tipo) {
    const card = document.createElement("article");
    card.className = "task-card" + (concluido ? " done" : "");

    card.innerHTML = `
        <div class="task-meta">
            <span>${item.linguagem}</span>
            <span>${item.nivel}</span>
        </div>
        <h4>${item.titulo}</h4>
        <p>${item.descricao}</p>
        <div class="task-meta">
            <strong>${item.xp} XP</strong>
            <button class="task-btn ${concluido ? "done" : ""}">${concluido ? "Concluído" : "Concluir"}</button>
        </div>
    `;

    card.querySelector("button").addEventListener("click", function() {
        alternarConclusao(tipo, item.id, item.xp);
    });

    return card;
}

function alternarConclusao(tipo, id, xp) {
    const lista = tipo === "missao" ? progresso.missoes : progresso.exercicios;
    const existe = lista.includes(id);

    if (existe) {
        const indice = lista.indexOf(id);
        lista.splice(indice, 1);
        progresso.xp -= xp;
    } else {
        lista.push(id);
        progresso.xp += xp;
    }

    if (progresso.xp < 0) progresso.xp = 0;

    salvarProgresso();
    renderizarMissoes(document.querySelector("#missionFilters .active").textContent);
    renderizarExercicios(document.querySelector("#exerciseFilters .active").textContent);
    renderizarEvolucao();
    atualizarResumo();
}

/* =========================================================
   PERGUNTAS
========================================================= */
function obterPerguntas() {
    if (typeof questoes !== "undefined" && Array.isArray(questoes)) {
        return questoes.slice(0, 200);
    }
    return [];
}

function renderizarPergunta() {
    const perguntas = obterPerguntas();
    if (!perguntas.length) return;

    if (progresso.perguntaAtual >= perguntas.length) progresso.perguntaAtual = 0;

    const pergunta = perguntas[progresso.perguntaAtual];
    const alternativasBox = document.getElementById("alternativasBox");

    document.getElementById("questionCounter").textContent = `Pergunta ${progresso.perguntaAtual + 1}/200`;
    document.getElementById("questionSubject").textContent = pergunta.materia || "Geral";
    document.getElementById("questionText").textContent = pergunta.pergunta;
    document.getElementById("answerInput").value = "";
    document.getElementById("feedbackPergunta").textContent = "";
    document.getElementById("feedbackPergunta").className = "feedback";

    alternativasBox.innerHTML = "";

    if (pergunta.alternativas && pergunta.alternativas.length) {
        pergunta.alternativas.forEach(function(alt, index) {
            const div = document.createElement("div");
            div.className = "alt-item";
            div.textContent = `${String.fromCharCode(65 + index)}) ${alt}`;
            alternativasBox.appendChild(div);
        });
    }

    document.getElementById("btnResponder").onclick = responderPergunta;
    document.getElementById("btnProxima").onclick = proximaPergunta;
}

function responderPergunta() {
    const perguntas = obterPerguntas();
    const pergunta = perguntas[progresso.perguntaAtual];
    const respostaDigitada = normalizar(document.getElementById("answerInput").value);
    const respostaCorreta = normalizar(pergunta.resposta_correta || pergunta.resposta || "");
    const feedback = document.getElementById("feedbackPergunta");

    if (!respostaDigitada) {
        feedback.textContent = "Digite uma resposta antes de confirmar.";
        feedback.className = "feedback erro";
        return;
    }

    if (respostaDigitada === respostaCorreta) {
        const idPergunta = pergunta.id || `pergunta-${progresso.perguntaAtual}`;

        if (!progresso.perguntas.includes(idPergunta)) {
            progresso.perguntas.push(idPergunta);
            progresso.xp += XP_PERGUNTA;
        }

        feedback.textContent = `Resposta correta! +${XP_PERGUNTA} XP`;
        feedback.className = "feedback ok";
    } else {
        feedback.textContent = `Resposta incorreta. Resposta correta: ${pergunta.resposta_correta || pergunta.resposta}`;
        feedback.className = "feedback erro";
    }

    salvarProgresso();
    renderizarEvolucao();
    atualizarResumo();
}

function proximaPergunta() {
    const perguntas = obterPerguntas();
    progresso.perguntaAtual = (progresso.perguntaAtual + 1) % perguntas.length;
    salvarProgresso();
    renderizarPergunta();
}

function normalizar(texto) {
    return String(texto).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* =========================================================
   EVOLUÇÃO POR LINGUAGEM
========================================================= */
function renderizarEvolucao() {
    const container = document.getElementById("evolutionList");
    if (!container) return;

    container.innerHTML = "";

    LINGUAGENS.forEach(function(linguagem) {
        const missoesDaLinguagem = MISSOES.filter(m => m.linguagem === linguagem && progresso.missoes.includes(m.id)).length;
        const exerciciosDaLinguagem = EXERCICIOS.filter(e => e.linguagem === linguagem && progresso.exercicios.includes(e.id)).length;
        const pontos = missoesDaLinguagem + exerciciosDaLinguagem;

        const basico = calcularPorcentagem(pontos, 0, 16);
        const intermediario = calcularPorcentagem(pontos, 16, 32);
        const avancado = calcularPorcentagem(pontos, 32, 60);

        const card = document.createElement("article");
        card.className = "evolution-card";
        card.innerHTML = `
            <h4>${linguagem}</h4>
            <div class="evolution-stages">
                ${criarBarraEvolucao("Básico", basico)}
                ${criarBarraEvolucao("Intermediário", intermediario)}
                ${criarBarraEvolucao("Avançado", avancado)}
            </div>
        `;
        container.appendChild(card);
    });
}

function calcularPorcentagem(pontos, inicio, fim) {
    if (pontos <= inicio) return 0;
    if (pontos >= fim) return 100;
    return Math.round(((pontos - inicio) / (fim - inicio)) * 100);
}

function criarBarraEvolucao(nome, porcentagem) {
    return `
        <div class="evolution-stage">
            <strong>${nome}</strong>
            <div class="stage-track">
                <div class="stage-fill" style="width: ${porcentagem}%"></div>
            </div>
            <span>${porcentagem}%</span>
        </div>
    `;
}

/* =========================================================
   RESUMO, RANKS E XP
========================================================= */
function atualizarResumo() {
    const xpLimitado = Math.min(progresso.xp, XP_HOKAGE);
    const rank = obterRankAtual(progresso.xp);

    document.getElementById("xpTotal").textContent = progresso.xp;
    document.getElementById("rankAtual").textContent = rank.nome;
    document.getElementById("rankIcon").src = rank.icon;
    document.getElementById("missoesConcluidas").textContent = `${progresso.missoes.length}/200`;
    document.getElementById("perguntasCorretas").textContent = `${progresso.perguntas.length}/200`;
    document.getElementById("xpTexto").textContent = `${xpLimitado} / ${XP_HOKAGE} XP`;
    document.getElementById("xpBar").style.width = `${(xpLimitado / XP_HOKAGE) * 100}%`;
}

function obterRankAtual(xp) {
    let rankAtual = RANKS[0];
    RANKS.forEach(function(rank) {
        if (xp >= rank.xp) {
            rankAtual = rank;
        }
    });
    return rankAtual;
}

function renderizarRanks() {
    const lista = document.getElementById("rankList");
    lista.innerHTML = "";

    RANKS.forEach(function(rank) {
        const item = document.createElement("li");
        item.innerHTML = `<strong>${rank.nome}</strong> - ${rank.xp} XP`;
        lista.appendChild(item);
    });
}

/* =========================================================
   SALVAR, RESETAR E CONFIGURAÇÕES FINAIS
========================================================= */
function salvarProgresso() {
    localStorage.setItem("progressoNinja", JSON.stringify(progresso));
}

function configurarBotoesGlobais() {
    const btnReset = document.getElementById("btnReset");

    btnReset.addEventListener("click", function() {
        const confirmar = confirm("Tem certeza que deseja resetar todo o progresso ninja?");
        if (!confirmar) return;

        progresso = {
            xp: 0,
            missoes: [],
            exercicios: [],
            perguntas: [],
            perguntaAtual: 0
        };

        salvarProgresso();
        renderizarMissoes("Todos");
        renderizarExercicios("Todos");
        renderizarPergunta();
        renderizarEvolucao();
        atualizarResumo();
    });
}

function sairDoSistema() {
    window.location.href = "index.html";
}

function mostrarNomeUsuario() {
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuarioNinja"));
    const nomeUsuario = document.getElementById("nomeUsuario");

    if (usuarioSalvo && nomeUsuario) {
        nomeUsuario.textContent = usuarioSalvo.login;
    }
}
