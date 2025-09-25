// Admin • Portal Conecta (MVP sem backend)
// Armazena os conteúdos em localStorage com exportação/importação JSON.

(function () {
  const LS_KEY = 'conecta.conteudos.v1';

  const el = {
    form: document.getElementById('form-conteudo'),
    tipo: document.getElementById('tipo'),
    categoria: document.getElementById('categoria'),
    data: document.getElementById('data'),
    titulo: document.getElementById('titulo'),
    responsavel: document.getElementById('responsavel'),
    capaUrl: document.getElementById('capaUrl'),
    linkPdf: document.getElementById('linkPdf'),
    resumo: document.getElementById('resumo'),
    conteudo: document.getElementById('conteudo'),
    publicado: document.getElementById('publicado'),
    btnSalvar: document.getElementById('btn-salvar'),
    btnNovo: document.getElementById('btn-novo'),
    btnPreview: document.getElementById('btn-preview'),
    btnExportar: document.getElementById('btn-exportar'),
    inputImportar: document.getElementById('input-importar'),
    btnImportarLabel: document.querySelector('label[for="input-importar"]'),
    btnLimpar: document.getElementById('btn-limpar'),
    btnAplicarTemplate: document.getElementById('btn-aplicar-template'),
    busca: document.getElementById('busca'),
    filtroTipo: document.getElementById('filtro-tipo'),
    tbody: document.getElementById('tbody')
  };

  let editId = null; // id do item em edição

  // Util
  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const read = () => {
    try{ return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch(e){ return []; }
  };
  const write = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));
  const today = () => new Date().toISOString().slice(0,10);

  // Templates por tipo
  const templates = {
    "Projeto": () => ({
      tipo: "Projeto",
      categoria: "Extensão",
      titulo: "Nome do Projeto",
      responsavel: "Equipe/Docente responsável",
      capaUrl: "",
      linkPdf: "",
      data: today(),
      resumo: "Resumo breve do projeto, objetivo, público-alvo e resultados esperados.",
      conteudo:
`# Sobre o projeto
Descreva missão, objetivos e metodologia.

## Atividades
- Oficina 1: ...
- Mentoria: ...

## Resultados & Impacto
- Indicador 1
- Indicador 2

## Contatos
E-mail, redes, horários de atendimento.
`,
      publicado: true
    }),
    "Edital traduzido": () => ({
      tipo: "Edital traduzido",
      categoria: "Oportunidades",
      titulo: "Título do Edital",
      responsavel: "Setor/Comissão",
      capaUrl: "",
      linkPdf: "nome-do-edital.pdf",
      data: today(),
      resumo: "Tradução do edital em linguagem simples: quem pode participar, prazos e como se inscrever.",
      conteudo:
`# Entenda o edital
**Quem pode participar:**  
**Inscrição:**  
**Prazos:**  
**Critérios de seleção:**  

> Dica: anexe o PDF oficial em "Link/Anexo".
`,
      publicado: true
    }),
    "Notícia": () => ({
      tipo: "Notícia",
      categoria: "Comunicados",
      titulo: "Título da notícia",
      responsavel: "Comunicação",
      capaUrl: "",
      linkPdf: "",
      data: today(),
      resumo: "Resumo do fato principal com linguagem objetiva.",
      conteudo:
`# Destaque
Parágrafo inicial com o essencial.

## Contexto
Detalhes, depoimentos e próximos passos.

*Atualizado em:* ${today()}
`,
      publicado: true
    }),
    "Evento": () => ({
      tipo: "Evento",
      categoria: "Agenda",
      titulo: "Nome do evento",
      responsavel: "Organização/Projeto",
      capaUrl: "",
      linkPdf: "",
      data: today(),
      resumo: "Data, local, público e como participar.",
      conteudo:
`# Informações do evento
- **Data:** ${today()}
- **Local:** 
- **Público:** 
- **Inscrições:** 

## Programação
- Abertura
- Palestra
- Oficina
`,
      publicado: true
    }),
    "Recurso/PDF": () => ({
      tipo: "Recurso/PDF",
      categoria: "Biblioteca",
      titulo: "Nome do recurso",
      responsavel: "Autor/Setor",
      capaUrl: "",
      linkPdf: "arquivo.pdf",
      data: today(),
      resumo: "Descrição curta do material e como pode ser usado.",
      conteudo:
`# Sobre o recurso
Objetivo, público e tópicos abordados.

> Vincule o PDF no campo "Link/Anexo".
`,
      publicado: true
    })
  };

  // Preenche o form com dados (edição ou template)
  function fillForm(data){
    el.tipo.value = data.tipo || "Projeto";
    el.categoria.value = data.categoria || "";
    el.data.value = data.data || "";
    el.titulo.value = data.titulo || "";
    el.responsavel.value = data.responsavel || "";
    el.capaUrl.value = data.capaUrl || "";
    el.linkPdf.value = data.linkPdf || "";
    el.resumo.value = data.resumo || "";
    el.conteudo.value = data.conteudo || "";
    el.publicado.checked = !!data.publicado;
  }

  function clearForm(){
    editId = null;
    el.form.reset();
    el.publicado.checked = true;
  }

  // Salvar
  el.form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!el.titulo.value.trim()){
      alert('Informe o título.');
      el.titulo.focus();
      return;
    }

    const item = {
      id: editId || uid(),
      tipo: el.tipo.value,
      categoria: el.categoria.value.trim(),
      data: el.data.value || today(),
      titulo: el.titulo.value.trim(),
      responsavel: el.responsavel.value.trim(),
      capaUrl: el.capaUrl.value.trim(),
      linkPdf: el.linkPdf.value.trim(),
      resumo: el.resumo.value.trim(),
      conteudo: el.conteudo.value,
      publicado: el.publicado.checked,
      updatedAt: new Date().toISOString()
    };

    const list = read();
    const i = list.findIndex(x=>x.id===item.id);
    if(i>=0){ list[i]=item; } else { list.unshift(item); }
    write(list);
    render();
    clearForm();
  });

  // Novo
  el.btnNovo.addEventListener('click', ()=>{
    clearForm();
    el.titulo.focus();
  });

  // Template do tipo selecionado
  el.btnAplicarTemplate.addEventListener('click', ()=>{
    const tipo = el.tipo.value;
    const tpl = templates[tipo] && templates[tipo]();
    if (tpl) fillForm(tpl);
  });

  // Preview (abre uma janela simples)
  el.btnPreview.addEventListener('click', ()=>{
    const payload = {
      titulo: el.titulo.value || '(sem título)',
      tipo: el.tipo.value,
      categoria: el.categoria.value,
      data: el.data.value,
      responsavel: el.responsavel.value,
      capaUrl: el.capaUrl.value,
      linkPdf: el.linkPdf.value,
      resumo: el.resumo.value,
      conteudo: el.conteudo.value
    };
    const w = window.open('', '_blank', 'width=900,height=700');
    if(!w) return;
    w.document.write(`<!doctype html><html lang="pt-BR"><head>
      <meta charset="utf-8"><title>Preview • ${payload.titulo}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        body{font-family:Roboto,Arial,sans-serif; margin:24px; line-height:1.6}
        h1,h2,h3{font-family:Poppins,Arial,sans-serif}
        .muted{color:#556070}
        .meta{display:flex; gap:16px; flex-wrap:wrap; margin:8px 0 18px}
        img{max-width:100%; border-radius:12px}
        a{color:#0E7C7B}
        pre{white-space:pre-wrap}
      </style>
    </head><body>
      <h1>${escapeHtml(payload.titulo)}</h1>
      <div class="meta muted">
        <span><strong>Tipo:</strong> ${escapeHtml(payload.tipo||'')}</span>
        <span><strong>Categoria:</strong> ${escapeHtml(payload.categoria||'')}</span>
        <span><strong>Data:</strong> ${escapeHtml(payload.data||'')}</span>
        <span><strong>Responsável:</strong> ${escapeHtml(payload.responsavel||'')}</span>
      </div>
      ${payload.capaUrl ? `<img src="${escapeAttr(payload.capaUrl)}" alt="capa">` : ''}
      ${payload.resumo ? `<p><em>${escapeHtml(payload.resumo)}</em></p>` : ''}
      <hr/>
      <pre>${escapeHtml(payload.conteudo)}</pre>
      ${payload.linkPdf ? `<p><a href="${escapeAttr(payload.linkPdf)}" target="_blank" rel="noopener">Abrir anexo</a></p>` : ''}
    </body></html>`);
    w.document.close();
  });

  // Exportar
  el.btnExportar.addEventListener('click', ()=>{
    const data = read();
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `conecta-conteudos-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // Importar
  el.inputImportar.addEventListener('change', (ev)=>{
    const file = ev.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const arr = JSON.parse(reader.result);
        if(!Array.isArray(arr)) throw new Error('Formato inválido');
        write(arr);
        render();
        alert('Importado com sucesso!');
      }catch(e){
        alert('Falha ao importar: ' + e.message);
      }
      el.inputImportar.value = '';
    };
    reader.readAsText(file, 'utf-8');
  });

  // Limpar tudo
  el.btnLimpar.addEventListener('click', ()=>{
    if(confirm('Isso vai apagar todos os conteúdos salvos neste navegador. Deseja continuar?')){
      write([]);
      render();
      clearForm();
    }
  });

  // Busca e filtro
  el.busca.addEventListener('input', render);
  el.filtroTipo.addEventListener('change', render);

  // Render da tabela
  function render(){
    const q = (el.busca.value || '').toLowerCase();
    const ft = el.filtroTipo.value;
    const list = read()
      .filter(x => !q || (x.titulo||'').toLowerCase().includes(q) || (x.categoria||'').toLowerCase().includes(q))
      .filter(x => !ft || x.tipo === ft);

    el.tbody.innerHTML = '';
    for(const item of list){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(item.titulo||'')}</td>
        <td>${escapeHtml(item.tipo||'')}</td>
        <td>${escapeHtml(item.categoria||'')}</td>
        <td>${escapeHtml(item.data||'')}</td>
        <td>${item.publicado ? '✅' : '—'}</td>
        <td>
          <button class="btn" data-act="edit" data-id="${item.id}" style="background:#eef4ff; color:#1e2b4a">Editar</button>
          <button class="btn" data-act="toggle" data-id="${item.id}" style="background:#D4F4DD; color:#0e513e">${item.publicado?'Despublicar':'Publicar'}</button>
          <button class="btn" data-act="del" data-id="${item.id}" style="background:#ffeaea; color:#7a1021">Excluir</button>
        </td>
      `;
      el.tbody.appendChild(tr);
    }
  }

  // Ações na tabela
  el.tbody.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button[data-act]');
    if(!btn) return;
    const act = btn.getAttribute('data-act');
    const id = btn.getAttribute('data-id');
    const list = read();
    const i = list.findIndex(x=>x.id===id);
    if(i<0) return;

    if(act==='edit'){
      const item = list[i];
      editId = item.id;
      fillForm(item);
      window.scrollTo({top:0, behavior:'smooth'});
      el.titulo.focus();
    }
    if(act==='toggle'){
      list[i].publicado = !list[i].publicado;
      write(list); render();
    }
    if(act==='del'){
      if(confirm('Excluir este item?')){
        list.splice(i,1);
        write(list); render();
      }
    }
  });

  // Helpers de segurança
  function escapeHtml(s=''){ return s.replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function escapeAttr(s=''){ return s.replace(/"/g,'&quot;'); }

  // Inicializa com exemplos (opcional) se vazio
  (function seedIfEmpty(){
    const list = read();
    if(list.length) { render(); return; }
    const seeds = [
      { ...templates["Projeto"](), titulo:"Colheita Digital MDS", categoria:"Extensão", resumo:"Resultados preliminares mostram impacto no engajamento e alcance local.", publicado:true },
      { ...templates["Edital traduzido"](), titulo:"Documento de Visão do Portal Conecta", linkPdf:"DOC-20250924-WA0031..pdf", publicado:true },
      { ...templates["Edital traduzido"](), titulo:"Análise de Viabilidade Técnica", linkPdf:"DOC-20250924-WA0032..pdf", publicado:true },
      { ...templates["Recurso/PDF"](), titulo:"Neurociência aplicada à educação", linkPdf:"NEUROCIÊNCIA-APLICADA-A-EDUCAÇÃO.pdf", publicado:true },
    ].map(x=>({id:uid(), updatedAt:new Date().toISOString(), ...x}));
    write(seeds);
    render();
  })();
})();
