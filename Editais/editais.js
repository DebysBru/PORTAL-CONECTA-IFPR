/* ============================
   EDITAIS TRADUZIDOS — Portal Conecta
   ============================ */

// Mock de dados (substitua futuramente por Firestore/JSON externo)
const DATA = [
  {
    id: "ed1",
    titulo: "Edital de Auxílio Permanência 2025",
    categoria: "Assistência Estudantil",
    curso: "Todos os cursos",
    status: "aberto",
    prazo: "2025-10-08",
    publicado: "2025-09-20",
    link: "#",
    tags: ["benefício", "auxílio", "renda"],
    traducao: {
      oque: "Auxílio financeiro para apoiar estudantes em situação de vulnerabilidade a permanecerem no curso.",
      quem: "Estudantes regularmente matriculados no IFPR, conforme critérios socioeconômicos do edital.",
      como: "Preencher formulário online, anexar a documentação exigida e enviar dentro do prazo.",
      prazo: "Até 08/10/2025 (23h59). Recomenda-se enviar com antecedência.",
      docs: "RG, CPF, comprovante de matrícula, comprovantes de renda e demais documentos listados no edital."
    }
  },
  {
    id: "ed2",
    titulo: "Seleção de Bolsistas — Projeto de Extensão X",
    categoria: "Extensão",
    curso: "Sistemas de Informação",
    status: "aberto",
    prazo: "2025-09-30",
    publicado: "2025-09-18",
    link: "#",
    tags: ["bolsa", "extensão", "projeto"],
    traducao: {
      oque: "Seleção de estudantes para atuarem como bolsistas em projeto de extensão com foco em tecnologia e comunidade.",
      quem: "Estudantes de SI com disponibilidade de 12h semanais e CRA acima do mínimo previsto.",
      como: "Inscrição via formulário e entrevista. Anexar histórico escolar e carta de motivação.",
      prazo: "Até 30/09/2025.",
      docs: "Histórico escolar, carta de motivação, RG e CPF."
    }
  },
  {
    id: "ed3",
    titulo: "Seleção de alunos especiais para os cursos de graduação no segundo semestre letivo de 2025",
    categoria: "Assitencia Estudantil",
    curso: "Todos os cursos",
    status: "encerrado",
    prazo: "2025-08-20",
    publicado: "2025-08-13",
    link: "#",
    tags: ["bolsa", "pibic"],
    traducao: {
      oque: "Programa de bolsas para estudantes participarem de projetos de pesquisa com orientação docente.",
      quem: "Estudantes do IFPR que atendam aos critérios do edital (matrícula ativa, disponibilidade, etc.).",
      como: "Submeter plano de trabalho com o orientador no sistema indicado.",
      prazo: "Encerrado em 20/08/2025.",
      docs: "Plano de trabalho, histórico escolar e documentos pessoais."
    }
  },
  {
    id: "ed4",
    titulo: "Monitoria Acadêmica — Edital 2025/2",
    categoria: "Ensino",
    curso: "Engenharia Agronômica",
    status: "aberto",
    prazo: "2025-10-15",
    publicado: "2025-09-10",
    link: "#",
    tags: ["monitoria", "ensino"],
    traducao: {
      oque: "Seleção de monitores para apoio a disciplinas com alta demanda de atendimento.",
      quem: "Estudantes com aprovação prévia na disciplina e rendimento acadêmico satisfatório.",
      como: "Inscrever-se pelo formulário e entregar comprovantes solicitados.",
      prazo: "Até 15/10/2025.",
      docs: "Histórico escolar, declaração do docente e documentos pessoais."
    }
  }
];

// Estado e elementos
const grid = document.getElementById("grid");
const q = document.getElementById("q");
const fStatus = document.getElementById("fStatus");
const fCategoria = document.getElementById("fCategoria");
const ordem = document.getElementById("ordem");
const btnMais = document.getElementById("btnMais");
const ultimaAtt = document.getElementById("ultimaAtt");

const modal = new bootstrap.Modal(document.getElementById("modalTradu"));
const elTitle = document.getElementById("modalTitle");
const elMeta = document.getElementById("modalMeta");
const elOque = document.getElementById("t_oque");
const elQuem = document.getElementById("t_quem");
const elComo = document.getElementById("t_como");
const elPrazo = document.getElementById("t_prazo");
const elDocs = document.getElementById("t_docs");
const elOficial = document.getElementById("linkOficial");

let page = 1;
const PAGE_SIZE = 6;

// Utilitários
const parseISO = s => new Date(s);
const hoje = () => new Date();
const diffDias = (f) => {
  const ms = parseISO(f) - hoje();
  return Math.ceil(ms / (1000*60*60*24));
};
const formatDate = (dISO) => {
  const d = parseISO(dISO);
  const m = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"][d.getMonth()];
  return `${d.getDate()} ${m} ${d.getFullYear()}`;
};

// Filtro + ordenação
const aplicarFiltros = () => {
  const termo = q.value.trim().toLowerCase();
  const st = fStatus.value;
  const cat = fCategoria.value;

  let lista = DATA.filter(ed => {
    const busca = [ed.titulo, ed.categoria, ed.curso, ...(ed.tags||[])].join(" ").toLowerCase();
    const okBusca = !termo || busca.includes(termo);
    const okStatus = !st || ed.status === st;
    const okCat = !cat || ed.categoria === cat;
    return okBusca && okStatus && okCat;
  });

  // Ordenação
  const ord = ordem.value;
  if(ord === "prazo"){
    lista.sort((a,b) => diffDias(a.prazo) - diffDias(b.prazo));
  }else if(ord === "novo"){
    lista.sort((a,b) => parseISO(b.publicado) - parseISO(a.publicado));
  }else if(ord === "titulo"){
    lista.sort((a,b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
  }
  return lista;
};

// Render
const renderCards = (items, reset=false) => {
  if(reset) grid.innerHTML = "";
  const start = (page-1)*PAGE_SIZE;
  const slice = items.slice(start, start+PAGE_SIZE);

  slice.forEach(ed => {
    const dias = diffDias(ed.prazo);
    const encerrado = ed.status === "encerrado" || dias < 0;
    const statusClass = encerrado ? "badge-encerrado" : "badge-aberto";
    const statusLabel = encerrado ? "Encerrado" : "Aberto";

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    col.innerHTML = `
      <article class="card-edital h-100" aria-labelledby="t_${ed.id}">
        <div class="card-top">
          <span class="badge-status ${statusClass}">
            <i class="bi ${encerrado ? "bi-lock-fill" : "bi-unlock-fill"}"></i>${statusLabel}
          </span>
          <button class="btn btn-sm btn-outline-cta btn-fav" aria-label="Salvar edital" data-id="${ed.id}">
            <i class="bi bi-bookmark"></i>
          </button>
        </div>

        <div class="meta mt-2">
          Publicado: <strong>${formatDate(ed.publicado)}</strong> •
          Prazo: <strong>${formatDate(ed.prazo)}</strong>
          ${!encerrado ? `• <span class="text-success">(${dias} dia${dias===1?"":"s"} restantes)</span>` : ""}
        </div>

        <h3 id="t_${ed.id}" class="titulo">${ed.titulo}</h3>
        <div class="meta">${ed.categoria} • ${ed.curso}</div>

        <div class="tags">
          ${(ed.tags||[]).map(t=>`<span class="tag">${t}</span>`).join("")}
        </div>

        <div class="card-actions mt-3">
          <a href="${ed.link}" target="_blank" rel="noopener" class="btn btn-mini btn-outline-cta">
            <i class="bi bi-box-arrow-up-right me-1"></i> Edital oficial
          </a>
          <button class="btn btn-mini btn-cta" data-open="${ed.id}">
            <i class="bi bi-chat-text me-1"></i> Ver tradução
          </button>
        </div>
      </article>
    `;
    grid.appendChild(col);
  });

  // Paginação
  const total = items.length;
  if(page * PAGE_SIZE < total){
    btnMais.classList.remove("d-none");
  }else{
    btnMais.classList.add("d-none");
  }
};

// Modal de tradução
const openModal = (id) => {
  const ed = DATA.find(x => x.id === id);
  if(!ed) return;
  elTitle.textContent = ed.titulo;
  elMeta.textContent = `${ed.categoria} • ${ed.curso} • Publicado em ${formatDate(ed.publicado)} • Prazo ${formatDate(ed.prazo)}`;
  elOque.textContent = ed.traducao.oque;
  elQuem.textContent = ed.traducao.quem;
  elComo.textContent = ed.traducao.como;
  elPrazo.textContent = ed.traducao.prazo;
  elDocs.textContent = ed.traducao.docs;
  elOficial.href = ed.link || "#";
  modal.show();
};

// Eventos
[q, fStatus, fCategoria, ordem].forEach(el => {
  el.addEventListener("input", () => {
    page = 1;
    const filtrados = aplicarFiltros();
    renderCards(filtrados, true);
  });
});

btnMais.addEventListener("click", () => {
  page += 1;
  renderCards(aplicarFiltros(), false);
});

// Delegação para botões de abrir modal e favoritos
grid.addEventListener("click", (e) => {
  const openId = e.target.closest("[data-open]")?.getAttribute("data-open");
  if(openId){ openModal(openId); return; }

  const favBtn = e.target.closest(".btn-fav");
  if(favBtn){
    favBtn.classList.toggle("active");
    const icon = favBtn.querySelector("i");
    icon.classList.toggle("bi-bookmark");
    icon.classList.toggle("bi-bookmark-fill");
  }
});

// Boot
window.addEventListener("DOMContentLoaded", () => {
  ultimaAtt.textContent = new Date().toLocaleString("pt-BR");
  const filtrados = aplicarFiltros();
  renderCards(filtrados, true);
});
