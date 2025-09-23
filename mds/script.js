// Scroll suave acessível
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(!id || id === '#') return;
    const el = document.querySelector(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      // Ajuste de foco para acessibilidade
      el.setAttribute('tabindex', '-1');
      el.focus({preventScroll:true});
    }
  });
});

// Notícias (mock local). Depois trocamos por Firestore se quiser.
const NEWS_JSON_URL = "news.json"; // opcional: substitua por endpoint ou Firestore

const months = ["janeiro","fevereiro","março","abril","maio","junho",
                "julho","agosto","setembro","outubro","novembro","dezembro"];

const fmtDate = (iso) => {
  try{
    const d = new Date(iso);
    return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
  }catch{ return iso; }
};

const renderNews = (items=[])=>{
  const list = document.getElementById("news-list");
  const tpl = document.getElementById("news-item-tpl");
  const empty = document.getElementById("news-empty");

  list.innerHTML = "";
  if(!items.length){
    empty.classList.remove("d-none");
    return;
  }
  empty.classList.add("d-none");

  items.forEach((n, idx)=>{
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector("img");
    const meta = node.querySelector(".news-meta");
    const title = node.querySelector(".news-title");
    const excerpt = node.querySelector(".news-excerpt");
    const link = node.querySelector(".news-link");

    img.src = n.thumb || "https://placehold.co/300x300?text=MDS";
    img.alt = n.title || "Notícia";
    meta.textContent = fmtDate(n.date || "");
    title.textContent = n.title || "Sem título";
    excerpt.textContent = n.excerpt || "";
    link.href = n.url || "#";

    list.appendChild(node);

    // Remove a última divisória
    if(idx === items.length - 1){
      const lastDivider = list.querySelector(".divider:last-child");
      lastDivider?.remove();
    }
  });
};

const loadNews = async()=>{
  try{
    const res = await fetch(NEWS_JSON_URL, {cache:"no-store"});
    const data = await res.json();
    const ordered = [...data].sort((a,b)=> new Date(b.date) - new Date(a.date));
    renderNews(ordered);
  }catch(e){
    console.error("Erro ao carregar notícias:", e);
    renderNews([]);
  }
};

window.addEventListener("DOMContentLoaded", loadNews);
