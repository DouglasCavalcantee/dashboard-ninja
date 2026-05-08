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
function criarProgressoZerado() {
    return {
        xp: 0,
        missoes: [],
        exercicios: [],
        perguntas: [],
        perguntaAtual: 0,
        conquistas: []
    };
}

function pegarChaveProgresso() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        return null;
    }

    return "progressoNinja_" + usuarioLogado.login;
}

function carregarProgresso() {

    const chave = pegarChaveProgresso();

    if (!chave) {
        return criarProgressoZerado();
    }

    let progressoSalvo =
        JSON.parse(localStorage.getItem(chave));

    if (progressoSalvo) {
        return progressoSalvo;
    }

    const progressoAntigo =
        JSON.parse(localStorage.getItem("progressoNinja"));

    if (progressoAntigo) {

        localStorage.setItem(
            chave,
            JSON.stringify(progressoAntigo)
        );

        localStorage.removeItem("progressoNinja");

        return progressoAntigo;

    }

    return criarProgressoZerado();

}

let progresso = carregarProgresso();

/* =========================================================
   LOGIN E CONTAS
========================================================= */

const btnLogin = document.getElementById("btnLogin");
const btnAbrirModal = document.getElementById("btnAbrirModal");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnSalvarConta = document.getElementById("btnSalvarConta");

/* =========================
   EVENTOS
========================= */

if (btnLogin) {
    btnLogin.addEventListener("click", entrar);
}

if (btnAbrirModal) {
    btnAbrirModal.addEventListener("click", abrirModal);
}

if (btnFecharModal) {
    btnFecharModal.addEventListener("click", fecharModal);
}

if (btnSalvarConta) {
    btnSalvarConta.addEventListener("click", salvarConta);
}

document.addEventListener("keydown", function(evento) {

    if (evento.key === "Enter") {

        const modal = document.getElementById("modal-criar-conta");

        if (!modal) return;

        const modalAberto = modal.style.display === "flex";

        if (modalAberto) {
            salvarConta();
        } else {
            entrar();
        }

    }

});

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

    const novoLogin =
        document.getElementById("novoLogin").value.trim().toLowerCase();

    const novaSenha =
        document.getElementById("novaSenha").value.trim();

    const mensagem =
        document.getElementById("mensagem-criar-conta");
    
    const avatarSelecionado =
        document.querySelector('input[name="avatar"]:checked');

    if (novoLogin === "" || novaSenha === "" || !avatarSelecionado) {

        mensagem.textContent =
            "Preencha todos os campos e escolha um avatar.";

        return;

    }

    let usuarios =
        JSON.parse(localStorage.getItem("usuariosNinja")) || [];

    const contaExistente =
        usuarios.find(usuario => usuario.login === novoLogin);

    if (contaExistente) {

        mensagem.textContent =
            "Esse login já existe.";

        return;

    }

    const novoUsuario = {
        login: novoLogin,
        senha: novaSenha,
        avatar: avatarSelecionado.value
    };

    usuarios.push(novoUsuario);

    localStorage.setItem(
        "usuariosNinja",
        JSON.stringify(usuarios)
    );

    mensagem.textContent =
        "Conta criada com sucesso!";

    setTimeout(function() {

        fecharModal();

        document.getElementById("novoLogin").value = "";
        document.getElementById("novaSenha").value = "";
        document
        .querySelectorAll('input[name="avatar"]')
        .forEach(function(input) {

        input.checked = false;

    });

        mensagem.textContent = "";

    }, 1500);

}

/* =========================
   LOGIN
========================= */

function entrar() {

    const loginDigitado =
        document.getElementById("login")
        .value
        .trim()
        .toLowerCase();

    const senhaDigitada =
        document.getElementById("senha")
        .value
        .trim();

    const mensagem =
        document.getElementById("mensagem-login");

    let usuarios =
        JSON.parse(localStorage.getItem("usuariosNinja")) || [];

    mensagem.style.display = "block";

    if (loginDigitado === "" || senhaDigitada === "") {

        mensagem.textContent =
            "Digite login e senha.";

        return;

    }

    if (usuarios.length === 0) {

        mensagem.textContent =
            "Nenhuma conta foi criada ainda.";

        return;

    }

    const usuarioEncontrado =
        usuarios.find(function(usuario) {

            return usuario.login === loginDigitado;

        });

    if (!usuarioEncontrado) {

        mensagem.textContent =
            "Conta inexistente.";

        return;

    }

    if (usuarioEncontrado.senha !== senhaDigitada) {

        mensagem.textContent =
            "Senha incorreta.";

        return;

    }

    mensagem.style.display = "none";

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioEncontrado)
    );

    window.location.href = "dashboard.html";

}

/* =========================
   MOSTRAR NOME DO USUÁRIO
========================= */

function mostrarNomeUsuario() {

    const usuarioLogado =
        JSON.parse(localStorage.getItem("usuarioLogado"));

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    const avatarUsuario =
        document.getElementById("avatarUsuario");

    if (usuarioLogado && nomeUsuario) {

        nomeUsuario.textContent =
            usuarioLogado.login;

    }

    if (
        usuarioLogado &&
        avatarUsuario &&
        usuarioLogado.avatar
    ) {

        avatarUsuario.src =
            usuarioLogado.avatar;

    }

}

/* =========================
   SAIR DO SISTEMA
========================= */

function sairDoSistema() {

    localStorage.removeItem("usuarioLogado");

    window.location.href = "index.html";

}

/* =========================================================
   GERAÇÃO DE E EXERCÍCIOS
========================================================= */


function gerarExercicios() {
    return [
        {
            id: "html-1",
            linguagem: "HTML",
            nivel: "Básico",
            titulo: "HTML - Exercício 1",
            pergunta: "Qual tag cria o título principal de uma página?",
            alternativas: ["<p>", "<h1>", "<img>", "<div>"],
            correta: 1,
            xp: XP_EXERCICIO
        },
        {
            id: "css-1",
            linguagem: "CSS",
            nivel: "Básico",
            titulo: "CSS - Exercício 1",
            pergunta: "Qual propriedade muda a cor do texto?",
            alternativas: ["background", "color", "font-size", "border"],
            correta: 1,
            xp: XP_EXERCICIO
        },
        {
            id: "js-1",
            linguagem: "JavaScript",
            nivel: "Básico",
            titulo: "JavaScript - Exercício 1",
            pergunta: "Qual comando mostra uma mensagem no console?",
            alternativas: ["print()", "echo()", "console.log()", "mostrar()"],
            correta: 2,
            xp: XP_EXERCICIO
        },
        {
            id: "python-1",
            linguagem: "Python",
            nivel: "Básico",
            titulo: "Python - Exercício 1",
            pergunta: "Qual comando exibe uma mensagem na tela?",
            alternativas: ["echo()", "console.log()", "print()", "mostrar()"],
            correta: 2,
            xp: XP_EXERCICIO
        },
        {
            id: "ingles-1",
            linguagem: "Inglês",
            nivel: "Básico",
            titulo: "Inglês - Exercício 1",
            pergunta: "Qual é a tradução de 'variable'?",
            alternativas: ["Função", "Variável", "Tela", "Arquivo"],
            correta: 1,
            xp: XP_EXERCICIO
        }
    ];
}

const MISSOES = MISSOES_REAIS_150;

const EXERCICIOS = questoesMultiplaEscolha.map(function(questao, index) {
    return {
        id: questao.id,
        linguagem: questao.linguagem,
        nivel: questao.nivel,
        titulo: questao.linguagem + " - Exercício " + (index + 1),
        pergunta: questao.pergunta,
        alternativas: questao.alternativas,
        correta: questao.correta,
        xp: XP_EXERCICIO
    };
});

/* =========================================================
   INICIALIZAÇÃO DO DASHBOARD
========================================================= */
if (document.body.classList.contains("dashboard-body")) {
    iniciarDashboard();
}

function iniciarDashboard() {
    progresso = carregarProgresso();

    garantirEstruturaProgresso();

    mostrarNomeUsuario();

    configurarMenu();
    renderizarRanks();

    renderizarFiltros("missionFilters", renderizarMissoes);
    renderizarFiltros("exerciseFilters", renderizarExercicios);

    renderizarMissoes("Todos");
    renderizarExercicios("Todos");

    if (typeof iniciarSistemaPerguntasAbertas === "function") {
        iniciarSistemaPerguntasAbertas();
    }

    renderizarEvolucao();
    atualizarResumo();
    renderizarConquistasRecentes();
    configurarModalRankUp();
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
    const opcoes = LINGUAGENS;

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

    const dados = filtro === "Todos"
        ? EXERCICIOS
        : EXERCICIOS.filter(item => item.linguagem === filtro);

    const pendentes = dados.filter(function(exercicio) {
        return !progresso.exercicios.includes(exercicio.id);
    });

    lista.innerHTML = "";

    const quantidadePorTela = 10;

    const exerciciosParaMostrar = pendentes.slice(0, quantidadePorTela);

    if (exerciciosParaMostrar.length === 0) {
        lista.innerHTML = `
            <article class="task-card">
                <h4>Todos os exercícios foram concluídos!</h4>
                <p>Parabéns! Você completou todos os exercícios disponíveis desta categoria.</p>
            </article>
        `;
        return;
    }

    exerciciosParaMostrar.forEach(function(exercicio) {
        const card = criarCardExercicioQuiz(exercicio, false);
        lista.appendChild(card);
    });
}

function criarCardExercicioQuiz(exercicio, concluido) {

    const card = document.createElement("article");

    card.className =
        "task-card" + (concluido ? " done" : "");

    let alternativasHTML = "";

    console.log(exercicio);

    exercicio.alternativas.forEach(function(alternativa, index) {

        alternativasHTML += `
            <button class="alt-exercicio"
                    data-resposta="${index}">

                ${String.fromCharCode(65 + index)})
                ${escaparHTML(alternativa)}

            </button>
        `;

    });

    card.innerHTML = `

        <div class="task-meta">
            <span>${exercicio.linguagem}</span>
            <span>${exercicio.nivel}</span>
        </div>

        <h4>${exercicio.titulo}</h4>

        <p>${exercicio.pergunta}</p>

        <div class="alternativas-exercicio">
            ${alternativasHTML}
        </div>

        <p class="feedback-exercicio"></p>

        <div class="task-meta">
            <strong>${exercicio.xp} XP</strong>

            <span>
                ${concluido ? "Concluído" : "Pendente"}
            </span>
        </div>

    `;

    const botoes =
        card.querySelectorAll(".alt-exercicio");

    const feedback =
        card.querySelector(".feedback-exercicio");

    botoes.forEach(function(botao) {

        botao.addEventListener("click", function() {

            const respostaEscolhida =
                Number(botao.dataset.resposta);

            if (concluido) {

                feedback.textContent =
                    "Você já concluiu este exercício.";

                feedback.className =
                    "feedback-exercicio ok";

                return;

            }

            if (respostaEscolhida === exercicio.correta) {

                const xpAntes = progresso.xp;

                progresso.exercicios.push(exercicio.id);

                progresso.xp += exercicio.xp;

                verificarSubidaDeRank(xpAntes, progresso.xp);

                salvarProgresso();

                atualizarResumo();

                renderizarEvolucao();

                feedback.textContent =
                    `Resposta correta! +${exercicio.xp} XP`;

                feedback.className =
                    "feedback-exercicio ok";

                setTimeout(function() {

                    const filtroAtual =
                        document.querySelector(
                            "#exerciseFilters .active"
                        ).textContent;

                    renderizarExercicios(filtroAtual);

                }, 500);

            } else {

                feedback.textContent =
                    "Resposta incorreta. Tente novamente.";

                feedback.className =
                    "feedback-exercicio erro";

            }

        });

    });

    return card;

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

        <p><strong>Missão:</strong> ${escaparHTML(item.descricao)}</p>

        <p class="objetivo-missao">
            <strong>Objetivo:</strong>
            ${escaparHTML(item.objetivo)}
        </p>

        <textarea 
            class="resposta-missao"
            placeholder="${item.placeholder || "Digite sua resposta aqui..."}"
            rows="6"
            ${concluido ? "disabled" : ""}
        ></textarea>

        <button class="task-btn verificar-missao ${concluido ? "done" : ""}">
            ${concluido ? "Missão concluída" : "Verificar missão"}
        </button>

        <p class="feedback-missao"></p>

        <div class="task-meta">
            <strong>${item.xp} XP</strong>
            <span>${concluido ? "Concluído" : "Pendente"}</span>
        </div>
    `;

    const textarea = card.querySelector(".resposta-missao");
    const botao = card.querySelector(".verificar-missao");
    const feedback = card.querySelector(".feedback-missao");

    botao.addEventListener("click", function() {
        if (concluido) {
            feedback.textContent = "Essa missão já foi concluída.";
            feedback.className = "feedback-missao ok";
            return;
        }

        const resultado = corrigirMissao(item, textarea.value);

        feedback.textContent = resultado.mensagem;
        feedback.className = "feedback-missao " + (resultado.aprovado ? "ok" : "erro");

        if (!resultado.aprovado) {
            return;
        }

        progresso.missoes.push(item.id);
        progresso.xp += item.xp;

        salvarProgresso();
        atualizarResumo();
        renderizarEvolucao();

        setTimeout(function() {
            const filtroAtual = document.querySelector("#missionFilters .active").textContent;
            renderizarMissoes(filtroAtual);
        }, 700);
    });

    return card;    
}

function corrigirMissao(missao, respostaUsuario) {
    const resposta = normalizarRespostaMissao(respostaUsuario);

    if (resposta.length < 5) {
        return {
            aprovado: false,
            mensagem: "Digite sua resposta ou código antes de verificar."
        };
    }

    if (missao.linguagem === "Inglês") {
        return corrigirMissaoIngles(resposta);
    }

    return corrigirMissaoCodigo(missao, resposta);
}

function corrigirMissaoCodigo(missao, resposta) {
    const regras = missao.correcao || [];

    if (regras.length === 0) {
        return {
            aprovado: false,
            mensagem: "Essa missão ainda não possui regras de correção."
        };
    }

    const faltando = regras.filter(function(regra) {
        return !resposta.includes(normalizarRespostaMissao(regra));
    });

    if (faltando.length > 0) {
        return {
            aprovado: false,
            mensagem: "Ainda falta usar: " + faltando.join(", ")
        };
    }

    return {
        aprovado: true,
        mensagem: "Missão correta! +" + missao.xp + " XP"
    };
}

function corrigirMissaoIngles(resposta) {
    const palavrasIngles = [
        "i", "my", "name", "study", "programming", "developer",
        "technology", "project", "portfolio", "github", "linkedin",
        "code", "function", "system", "learning", "work", "future"
    ];

    const encontrouIngles = palavrasIngles.some(function(palavra) {
        return resposta.includes(palavra);
    });

    if (!encontrouIngles) {
        return {
            aprovado: false,
            mensagem: "A resposta precisa estar em inglês. Tente traduzir o texto com suas palavras."
        };
    }

    if (resposta.length < 15) {
        return {
            aprovado: false,
            mensagem: "Sua tradução ficou muito curta. Escreva uma frase mais completa."
        };
    }

    return {
        aprovado: true,
        mensagem: "Tradução aceita! +20 XP"
    };
}

function normalizarRespostaMissao(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function alternarConclusao(tipo, id, xp) {

    const lista =
        tipo === "missao"
            ? progresso.missoes
            : progresso.exercicios;

    const existe = lista.includes(id);

    if (existe) {

        const indice = lista.indexOf(id);

        lista.splice(indice, 1);

        progresso.xp -= xp;

    } else {

        lista.push(id);

        progresso.xp += xp;

    }

    if (progresso.xp < 0) {
        progresso.xp = 0;
    }

    salvarProgresso();

    renderizarMissoes(
        document.querySelector("#missionFilters .active").textContent
    );

    renderizarExercicios(
        document.querySelector("#exerciseFilters .active").textContent
    );

    renderizarEvolucao();

    atualizarResumo();

}


function escaparHTML(texto) {
    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
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

function garantirEstruturaProgresso() {
    if (!progresso.conquistas) {
        progresso.conquistas = [];
    }
}

function verificarSubidaDeRank(xpAntes, xpDepois) {
    const rankAntes = obterRankAtual(xpAntes);
    const rankDepois = obterRankAtual(xpDepois);

    if (rankAntes.nome !== rankDepois.nome) {
        registrarConquista("🏆 Subiu para " + rankDepois.nome);
        mostrarAnimacaoRank(rankAntes, rankDepois);
    }
}

function mostrarAnimacaoRank(rankAntes, rankDepois) {
    const modal = document.getElementById("rankUpModal");

    if (!modal) return;

    document.getElementById("rankAntigoNome").textContent = rankAntes.nome;
    document.getElementById("rankNovoNome").textContent = rankDepois.nome;
    document.getElementById("rankUpIcon").src = rankDepois.icon;

    document.getElementById("rankMensagem").textContent =
        criarMensagemRank(rankDepois.nome);

    modal.classList.add("ativo");
}

function criarMensagemRank(rankNome) {
    const mensagens = {
        "Chunnin": "Você deixou de ser iniciante e começou sua jornada como um verdadeiro ninja dos estudos!",
        "Jounnin": "Seu treinamento está ficando sério. Você já domina muitos fundamentos!",
        "Jounnin Épico": "Agora você está em um nível avançado. Continue firme!",
        "Jounnin Lendário": "Você está muito perto do topo. A vila reconhece seu esforço!",
        "Hokage": "Você alcançou o nível máximo. Você se tornou Hokage dos estudos!"
    };

    return mensagens[rankNome] || "Continue treinando para alcançar o próximo nível ninja!";
}

function configurarModalRankUp() {
    const botao = document.getElementById("btnFecharRankUp");
    const modal = document.getElementById("rankUpModal");

    if (!botao || !modal) return;

    botao.addEventListener("click", function() {
        modal.classList.remove("ativo");
    });
}

function registrarConquista(texto) {
    garantirEstruturaProgresso();

    const novaConquista = {
        texto: texto,
        data: new Date().toLocaleDateString("pt-BR")
    };

    progresso.conquistas.unshift(novaConquista);

    progresso.conquistas = progresso.conquistas.slice(0, 5);

    salvarProgresso();

    renderizarConquistasRecentes();
}

function renderizarConquistasRecentes() {
    const lista = document.getElementById("conquistasRecentes");

    if (!lista) return;

    garantirEstruturaProgresso();

    lista.innerHTML = "";

    if (progresso.conquistas.length === 0) {
        lista.innerHTML = "<li>Nenhuma conquista ainda.</li>";
        return;
    }

    progresso.conquistas.forEach(function(conquista) {
        const item = document.createElement("li");

        item.textContent =
            conquista.texto + " - " + conquista.data;

        lista.appendChild(item);
    });
}

function garantirEstruturaProgresso() {
    if (!progresso.conquistas) {
        progresso.conquistas = [];
    }
}

function verificarSubidaDeRank(xpAntes, xpDepois) {
    const rankAntes = obterRankAtual(xpAntes);
    const rankDepois = obterRankAtual(xpDepois);

    if (rankAntes.nome !== rankDepois.nome) {
        registrarConquista("🏆 Subiu para " + rankDepois.nome);
        mostrarAnimacaoRank(rankAntes, rankDepois);
    }
}

function mostrarAnimacaoRank(rankAntes, rankDepois) {
    const modal = document.getElementById("rankUpModal");

    if (!modal) return;

    document.getElementById("rankAntigoNome").textContent = rankAntes.nome;
    document.getElementById("rankNovoNome").textContent = rankDepois.nome;
    document.getElementById("rankUpIcon").src = rankDepois.icon;

    document.getElementById("rankMensagem").textContent =
        criarMensagemRank(rankDepois.nome);

    modal.classList.add("ativo");
}

function criarMensagemRank(rankNome) {
    const mensagens = {
        "Chunnin": "Você deixou de ser iniciante e começou sua jornada como um verdadeiro ninja dos estudos!",
        "Jounnin": "Seu treinamento está ficando sério. Você já domina muitos fundamentos!",
        "Jounnin Épico": "Agora você está em um nível avançado. Continue firme!",
        "Jounnin Lendário": "Você está muito perto do topo. A vila reconhece seu esforço!",
        "Hokage": "Você alcançou o nível máximo. Você se tornou Hokage dos estudos!"
    };

    return mensagens[rankNome] || "Continue treinando para alcançar o próximo nível ninja!";
}

function configurarModalRankUp() {
    const botao = document.getElementById("btnFecharRankUp");
    const modal = document.getElementById("rankUpModal");

    if (!botao || !modal) return;

    botao.addEventListener("click", function() {
        modal.classList.remove("ativo");
    });
}

function registrarConquista(texto) {
    garantirEstruturaProgresso();

    const novaConquista = {
        texto: texto,
        data: new Date().toLocaleDateString("pt-BR")
    };

    progresso.conquistas.unshift(novaConquista);

    progresso.conquistas = progresso.conquistas.slice(0, 5);

    salvarProgresso();

    renderizarConquistasRecentes();
}

function renderizarConquistasRecentes() {
    const lista = document.getElementById("conquistasRecentes");

    if (!lista) return;

    garantirEstruturaProgresso();

    lista.innerHTML = "";

    if (progresso.conquistas.length === 0) {
        lista.innerHTML = "<li>Nenhuma conquista ainda.</li>";
        return;
    }

    progresso.conquistas.forEach(function(conquista) {
        const item = document.createElement("li");

        item.textContent =
            conquista.texto + " - " + conquista.data;

        lista.appendChild(item);
    });
}

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
    const chave = pegarChaveProgresso();

    if (!chave) {
        return;
    }

    localStorage.setItem(chave, JSON.stringify(progresso));
}

function configurarBotoesGlobais() {
    const btnReset = document.getElementById("btnReset");

    btnReset.addEventListener("click", function() {
        const confirmar = confirm("Tem certeza que deseja resetar todo o progresso ninja?");
        if (!confirmar) return;

        progresso = criarProgressoZerado();

        salvarProgresso();
        renderizarMissoes("Todos");
        renderizarExercicios("Todos");
        renderizarEvolucao();
        atualizarResumo();
    });
}


