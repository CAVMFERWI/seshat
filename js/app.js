// Seshat — comportamento compartilhado entre as páginas
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const cents = v => Math.round(v * 100) / 100;
const produto = id => PRODUTOS.find(p => p.id === id);
const capa = p => `img/capas/${p.capa || p.id}.jpg`;
const desconto = p => p.antigo ? Math.round((1 - p.preco / p.antigo) * 100) : 0;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// localStorage pode falhar (modo privado); nesse caso o site funciona sem guardar nada
const store = {
  get(k, d) { try { const v = localStorage.getItem('seshat-' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('seshat-' + k, JSON.stringify(v)); } catch {} },
};

// Carrinho começa com os mesmos itens do protótipo do Figma
if (store.get('cart') === undefined) store.set('cart', [{ id: 'boku-no-hero-25', q: 1 }, { id: 'frieren-01', q: 2 }, { id: 'vagabond-01', q: 1 }]);
const cart = {
  items: () => store.get('cart', []).filter(i => produto(i.id)),
  count: () => cart.items().reduce((s, i) => s + i.q, 0),
  subtotal: () => cents(cart.items().reduce((s, i) => s + produto(i.id).preco * i.q, 0)),
  add(id, q = 1) { const it = cart.items(); const f = it.find(i => i.id === id); f ? f.q += q : it.push({ id, q }); store.set('cart', it); updateCartCount(); },
  setQ(id, q) { store.set('cart', cart.items().map(i => i.id === id ? { ...i, q } : i).filter(i => i.q > 0)); updateCartCount(); },
  clear() { store.set('cart', []); updateCartCount(); },
};
const favs = {
  all: () => store.get('fav', ['one-punch-man-03', 'ataque-dos-titas-05', 'ajin-03', 'record-of-ragnarok-17', 'ashita-no-joe-08', 'kings-maker-02', 'uq-holder-01', 'destino-dos-viloes-05']),
  has: id => favs.all().includes(id),
  toggle(id) { const f = favs.all(); const on = !f.includes(id); store.set('fav', on ? [...f, id] : f.filter(x => x !== id)); return on; },
};
const CUPOM = 'BEMVINDO10';
const totals = () => {
  const sub = cart.subtotal();
  const codigo = store.get('cupom', null) === CUPOM ? CUPOM : null;
  const cupom = codigo ? cents(sub * 0.1) : 0;
  const base = cents(sub - cupom);
  const frete = base >= 199 || sub === 0 ? 0 : 19.9;
  const pix = cents(base * 0.1);
  const totalCartao = cents(base + frete);
  return { sub, codigo, cupom, frete, pix, totalPix: cents(base - pix + frete), totalCartao, parcela: cents(totalCartao / 6) };
};

function toast(msg) {
  $('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

// Ícones
const SIMBOLO = `<svg viewBox="0 0 45 45" fill="none" aria-hidden="true"><path d="M2.25 22.5C9.75 10.5 35.25 10.5 42.75 22.5C35.25 34.5 9.75 34.5 2.25 22.5Z" stroke="currentColor" stroke-width="3"/><path d="M22.5 30.75a8.25 8.25 0 1 0 0-16.5 8.25 8.25 0 0 0 0 16.5Z" stroke="currentColor" stroke-width="2.5"/><path d="M22.5 15.375L29.445 24.086L19.41 28.92L16.931 18.056H28.069L25.59 28.92L15.555 24.086L22.5 15.375Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="22.5" cy="22.5" r="1.69" fill="var(--logo-dot, #C9A24B)"/><path d="M22.5 5.25V9M9 9.75L11.25 12.75M36 9.75L33.75 12.75" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const SIMBOLO_RODAPE = SIMBOLO.replace('aria-hidden', 'style="color:#D6B264;--logo-dot:#E64054" aria-hidden');
const CORACAO = `<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M9 15S3.75 11.7 3.75 7.5a2.95 2.95 0 0 1 5.25-1.95A2.95 2.95 0 0 1 14.25 7.5C14.25 11.7 9 15 9 15Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const LUA = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 0c.21 0 .43.01.64.03A6 6 0 0 0 11 11c.69 0 1.35-.12 1.96-.33A7 7 0 1 1 7 0Z" fill="#14122B"/></svg>`;
const SOL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14122B" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>`;
const LIXEIRA = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 5.5h13M8 5.5V4h4v1.5M5 5.5l.8 11h8.4l.8-11M8.5 8.5v5M11.5 8.5v5"/></svg>`;
// Bandeiras aceitas (desenhos simplificados)
const BANDEIRAS = {
  Visa: `<svg viewBox="0 0 38 22"><text x="19" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="900" font-style="italic" fill="#1A1F71">VISA</text></svg>`,
  Mastercard: `<svg viewBox="0 0 38 22"><circle cx="15" cy="11" r="8" fill="#EB001B"/><circle cx="23" cy="11" r="8" fill="#F79E1B"/><path d="M19 4.1a8 8 0 0 1 0 13.8 8 8 0 0 1 0-13.8Z" fill="#FF5F00"/></svg>`,
  Elo: `<svg viewBox="0 0 38 22"><circle cx="9" cy="11" r="6" fill="#000"/><circle cx="9" cy="8" r="1.6" fill="#FFCB05"/><circle cx="6.5" cy="12.5" r="1.6" fill="#00A4E0"/><circle cx="11.5" cy="12.5" r="1.6" fill="#EF4123"/><text x="26" y="15.5" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#000">elo</text></svg>`,
  'American Express': `<svg viewBox="0 0 38 22"><rect width="38" height="22" rx="3" fill="#2E77BC"/><text x="19" y="14.5" text-anchor="middle" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#fff">AMEX</text></svg>`,
  Hipercard: `<svg viewBox="0 0 38 22"><rect width="38" height="22" rx="3" fill="#B3131B"/><text x="19" y="14" text-anchor="middle" font-family="Arial,sans-serif" font-size="6.6" font-weight="700" fill="#fff">Hipercard</text></svg>`,
  Pix: `<svg viewBox="0 0 38 22"><path d="M19 3.5l4 4-4 4-4-4 4-4Zm0 7l4 4-4 4-4-4 4-4Z" fill="#32BCAD" transform="translate(-8 0)"/><text x="25" y="15" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#32BCAD">pix</text></svg>`,
  Boleto: `<svg viewBox="0 0 38 22"><g fill="#14122B"><rect x="5" y="4" width="1.5" height="14"/><rect x="8" y="4" width="3" height="14"/><rect x="12.5" y="4" width="1" height="14"/><rect x="15" y="4" width="2.5" height="14"/><rect x="19" y="4" width="1" height="14"/><rect x="21.5" y="4" width="3" height="14"/><rect x="26" y="4" width="1.5" height="14"/><rect x="29" y="4" width="1" height="14"/><rect x="31.5" y="4" width="2" height="14"/></g></svg>`,
};
const flags = names => `<div class="flags">${names.map(n => `<span class="flag" title="${n}" aria-label="${n}" role="img">${BANDEIRAS[n]}</span>`).join('')}</div>`;
const CARTOES = ['Visa', 'Mastercard', 'Elo', 'American Express', 'Hipercard'];

const logo = (tag = true) => `<a href="index.html" class="logo" aria-label="Seshat — página inicial">${SIMBOLO}<span class="logo-text"><span class="logo-name">SESHAT</span>${tag ? '<span class="logo-tag">MANGÁS · RARIDADES</span>' : ''}</span></a>`;

// Tema claro/escuro
function themeLabel() {
  const dark = document.documentElement.dataset.theme === 'dark';
  return dark ? `${SOL} Modo claro` : `${LUA} Modo escuro`;
}
function toggleTheme() {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  store.set('theme', dark ? 'dark' : 'light');
  $$('.theme-toggle').forEach(b => b.innerHTML = themeLabel());
}

function header(ativo = '') {
  const link = (k, txt) => `<a href="categoria.html?g=${k}" class="${ativo === k ? 'ativo' : ''}">${txt}</a>`;
  const user = store.get('user', null);
  return `
  <a href="#conteudo" class="hidden">Pular para o conteúdo</a>
  <div class="topbar"><div class="wrap"><p>Frete grátis acima de R$ 199</p><p>10% OFF no Pix</p><p>Parcele em até 6x sem juros</p></div>
    <button class="theme-toggle" type="button">${themeLabel()}</button></div>
  <header class="header">
    <div class="wrap header-main">
      <button class="menu-btn" type="button" aria-label="Abrir menu" data-open="menu-mobile">☰</button>
      ${logo()}
      <form class="search" action="busca.html" role="search">
        <input name="q" type="search" placeholder="Busque por título, autor ou editora..." aria-label="Buscar" value="${esc(params.get('q') || '')}">
        <button type="submit">Buscar</button>
      </form>
      <nav class="actions" aria-label="Conta">
        <a href="${user ? 'conta.html' : 'login.html'}" class="hide-sm">${user ? 'Minha conta' : 'Entrar'}</a>
        <a href="favoritos.html" class="hide-sm">Favoritos</a>
        <a href="carrinho.html" class="cart-btn">Carrinho (<span data-cart-count>0</span>)</a>
      </nav>
    </div>
    <nav class="catmenu" aria-label="Categorias"><div class="wrap">
      ${link('lancamentos', 'Lançamentos')}${link('shounen', 'Shounen')}${link('shoujo', 'Shoujo')}${link('seinen', 'Seinen')}${link('isekai', 'Isekai')}${link('terror', 'Terror')}${link('romance', 'Romance')}${link('box', 'Box e Kits')}
      <a href="categoria.html?g=raridades" class="tag-raridades">★ Raridades</a>
    </div></nav>
  </header>`;
}

function footer() {
  return `
  <footer class="footer"><div class="wrap">
    <div class="footer-cols">
      <div class="footer-brand">${logo().replace(SIMBOLO, SIMBOLO_RODAPE)}<p>A livraria de mangás com gêneros para todos os leitores e raridades para colecionadores.</p></div>
      <div class="footer-col"><h4>Categorias</h4><a href="categoria.html?g=shounen">Shounen</a><a href="categoria.html?g=shoujo">Shoujo</a><a href="categoria.html?g=seinen">Seinen</a><a href="categoria.html?g=isekai">Isekai</a><a href="categoria.html?g=raridades">Raridades</a></div>
      <div class="footer-col"><h4>Ajuda</h4><a href="info.html#como-comprar">Como comprar</a><a href="info.html#prazos">Prazos de entrega</a><a href="info.html#trocas">Trocas e devoluções</a><a href="info.html#faq">Perguntas frequentes</a></div>
      <div class="footer-col"><h4>Institucional</h4><a href="info.html#sobre">Sobre a Seshat</a><a href="info.html#privacidade">Política de privacidade</a><a href="info.html#termos">Termos de uso</a><a href="info.html#contato">Fale conosco</a></div>
      <div class="footer-col"><h4>Pagamento</h4><span>Pix</span><span>Cartão de crédito</span><span>Cartão de débito</span><span>Boleto</span>${flags([...CARTOES, 'Pix', 'Boleto'])}</div>
    </div>
    <div class="footer-line"></div>
    <small>© 2026 Seshat Mangás — projeto acadêmico, sem fins comerciais.</small>
  </div></footer>`;
}

function card(p) {
  const d = desconto(p);
  const selo = p.importado ? '<span class="seal importado">IMPORTADO</span>' : d ? `<span class="seal">-${d}%</span>` : p.novo ? '<span class="seal novo">Novo</span>' : p.rara ? '<span class="seal rara">★ Rara</span>' : '';
  const url = `produto.html?id=${p.id}`;
  return `<article class="card">
    <div class="card-cover"><a href="${url}" tabindex="-1"><img src="${capa(p)}" alt="Capa de ${esc(p.titulo)}" loading="lazy"></a>${selo}
      <button class="fav ${favs.has(p.id) ? 'on' : ''}" data-fav="${p.id}" aria-label="Favoritar ${esc(p.titulo)}" aria-pressed="${favs.has(p.id)}">${CORACAO}</button></div>
    <a href="${url}" class="card-title" title="${esc(p.titulo)}">${esc(p.titulo)}</a>
    <span class="price-old">${p.antigo ? brl(p.antigo) : ''}</span>
    <span class="price">${brl(p.preco)}</span>
    <button class="btn" data-add="${p.id}">Adicionar ao carrinho</button>
  </article>`;
}
function renderCards(el, ids) {
  el.innerHTML = ids.map(produto).filter(Boolean).map(card).join('');
}

function updateCartCount() {
  $$('[data-cart-count]').forEach(e => {
    if (e.textContent && e.textContent != cart.count()) { const b = e.closest('a, button') || e; b.classList.remove('bump'); b.offsetWidth; b.classList.add('bump'); }
    e.textContent = cart.count();
  });
}

// Overlays
function overlay(id, html) {
  let o = document.getElementById(id);
  if (!o) { o = document.createElement('div'); o.id = id; o.className = 'overlay'; document.body.append(o); }
  o.innerHTML = html;
  o.classList.add('open');
  document.body.style.overflow = 'hidden';
  (o.querySelector('[autofocus]') || o.querySelector('button, a'))?.focus();
  return o;
}
function closeOverlays() { $$('.overlay.open').forEach(o => o.classList.remove('open')); document.body.style.overflow = ''; }

function openMiniCart() {
  const it = cart.items();
  overlay('mini-carrinho', `<aside class="drawer" role="dialog" aria-modal="true" aria-label="Carrinho">
    <div class="drawer-head"><h2>Adicionado ao carrinho</h2><button class="close" data-close aria-label="Fechar">✕</button></div>
    <div class="success">✓ Item adicionado com sucesso</div>
    <div class="mini-items">${it.map(i => { const p = produto(i.id); return `<div class="mini-item"><img src="${capa(p)}" alt=""><div><b>${esc(p.titulo)}</b><span>Qtd: ${i.q}</span></div><b>${brl(cents(p.preco * i.q))}</b></div>`; }).join('<div class="hr"></div>')}</div>
    <div class="spacer"></div>
    <div class="sub">Subtotal <b>${brl(cart.subtotal())}</b></div>
    <a href="carrinho.html" class="btn btn-dark btn-block">Ver carrinho</a>
    <button class="btn btn-outline btn-block" data-close>Continuar comprando</button>
  </aside>`);
}

function openGenres() {
  const item = (k) => { const c = CATEGORIAS[k]; return `<a class="mega-item" href="categoria.html?g=${k}" style="--c1:${c.cor[0]};--c2:${c.cor[1]}"><img src="img/capas/${c.capa}.jpg" alt=""><b>${c.nome}</b><span>${c.menu}</span></a>`; };
  overlay('menu-generos', `<div class="mega" role="dialog" aria-modal="true" aria-label="Gêneros"><div class="wrap">
    <div class="mega-list"><div><h2>Explore por gênero</h2><p>Escolha o estilo de história que combina com você</p></div>
      <div class="mega-grid">${Object.keys(CATEGORIAS).map(item).join('')}</div></div>
    <div class="mega-rare"><span class="eyebrow">★ RARIDADES</span><h3>Edições de colecionador e primeiras tiragens</h3><a href="categoria.html?g=raridades" class="btn btn-gold btn-sm">Ver raridades</a></div>
  </div></div>`);
}

function openMobileMenu() {
  overlay('menu-mobile', `<aside class="drawer left" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drawer-head" style="padding-bottom:18px">${logo(false)}<button class="close" data-close aria-label="Fechar">✕</button></div>
    <a class="mob-item" href="categoria.html?g=lancamentos">Lançamentos <span>›</span></a>
    <p class="mob-label">GÊNEROS</p>
    ${Object.entries(CATEGORIAS).map(([k, c]) => `<a class="mob-item" href="categoria.html?g=${k}">${c.nome} <span>›</span></a>`).join('')}
    <a class="mob-item" href="categoria.html?g=box">Box e Kits <span>›</span></a>
    <a class="mob-item" href="favoritos.html">Favoritos <span>›</span></a>
    <a class="mob-item" href="${store.get('user', null) ? 'conta.html' : 'login.html'}">${store.get('user', null) ? 'Minha conta' : 'Entrar'} <span>›</span></a>
    <a class="mob-rare" href="categoria.html?g=raridades">★ Raridades</a>
  </aside>`);
}

// Delegação de cliques comuns a todas as páginas
document.addEventListener('click', e => {
  const t = e.target;
  const add = t.closest('[data-add]');
  if (add) { cart.add(add.dataset.add); openMiniCart(); return; }
  const fav = t.closest('[data-fav]');
  if (fav) {
    e.preventDefault();
    const on = favs.toggle(fav.dataset.fav);
    $$(`[data-fav="${fav.dataset.fav}"]`).forEach(b => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.classList.remove('pop'); b.offsetWidth; b.classList.add('pop'); });
    toast(on ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
    document.dispatchEvent(new Event('favs'));
    return;
  }
  if (t.closest('.theme-toggle')) return toggleTheme();
  if (t.closest('[data-open="menu-mobile"]')) return openMobileMenu();
  if (t.closest('[data-open="generos"]')) { e.preventDefault(); return openGenres(); }
  if (t.closest('[data-close]') || t.classList.contains('overlay')) return closeOverlays();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlays(); });

function mountLayout(ativo) {
  $('#header')?.insertAdjacentHTML('afterbegin', header(ativo));
  $('#footer')?.insertAdjacentHTML('afterbegin', footer());
  updateCartCount();
  requestAnimationFrame(revelar); // espera os cards da página serem desenhados
}

// Seções e cards aparecem suavemente quando entram na tela
function revelar() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('main section, main .grid > *').forEach((el, i) => {
    if (el.getBoundingClientRect().top < innerHeight) return; // o que já está visível não pisca
    el.classList.add('reveal');
    if (el.parentElement.classList.contains('grid')) el.style.transitionDelay = (i % 5) * 60 + 'ms';
    io.observe(el);
  });
}

// Lista com filtros e ordenação (categoria, busca, favoritos)
function mountList(root, ids, opts = {}) {
  const base = ids.map(produto).filter(Boolean);
  const grid = $('.grid', root), info = $('[data-info]', root), sort = $('select', root);
  const range = $('.range', root), max = $('[data-max]', root);
  function run() {
    const eds = $$('[data-editora]:checked', root).map(i => i.dataset.editora);
    const limite = range ? +range.value : Infinity;
    let list = base.filter(p => (!eds.length || eds.includes(p.editora)) && p.preco <= limite);
    const s = sort?.value;
    if (s === 'menor') list = [...list].sort((a, b) => a.preco - b.preco);
    if (s === 'maior') list = [...list].sort((a, b) => b.preco - a.preco);
    if (s === 'az') list = [...list].sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
    if (s === 'desconto') list = [...list].sort((a, b) => desconto(b) - desconto(a));
    if (max) max.textContent = range.value >= range.max ? `R$ ${range.max}+` : `R$ ${range.value}`;
    info.textContent = opts.label ? opts.label(list.length) : `Exibindo ${list.length} ${list.length === 1 ? 'título' : 'títulos'}`;
    if (list.length) renderCards(grid, list.map(p => p.id));
    else grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><strong>${opts.vazio || 'Nenhum título encontrado'}</strong><span>Tente tirar algum filtro ou buscar por outro nome.</span><a href="index.html" class="btn btn-dark btn-sm">Voltar para a loja</a></div>`;
  }
  root.addEventListener('input', run);
  run();
}
function filtersHTML(ids) {
  const list = ids.map(produto).filter(Boolean);
  const eds = [...new Set(list.map(p => p.editora))].sort();
  const vis = (n, c) => `<label class="check"><input type="checkbox"> ${n} <small>(${c})</small></label>`;
  const top = Math.ceil(Math.max(...list.map(p => p.preco), 120) / 10) * 10;
  return `<aside class="filters" aria-label="Filtros">
    <h3>Filtrar por</h3>
    <div class="filter-group"><h4>Subgênero</h4>${vis('Aventura', 42)}${vis('Ação', 38)}${vis('Fantasia', 27)}${vis('Esportes', 14)}${vis('Comédia', 7)}</div>
    <div class="filter-group"><h4>Editora</h4>${eds.map(e => `<label class="check"><input type="checkbox" data-editora="${e}"> ${e} <small>(${list.filter(p => p.editora === e).length})</small></label>`).join('')}</div>
    <div class="filter-group"><h4>Formato</h4>${vis('Volume único', 19)}${vis('Box / Kit', 12)}${vis('Edição especial', 9)}</div>
    <div class="filter-group"><h4>Faixa de preço</h4><input class="range" type="range" min="20" max="${top}" step="5" value="${top}" aria-label="Preço máximo"><div class="range-labels"><span>R$ 20</span><span data-max></span></div></div>
  </aside>`;
}
const sortHTML = `<label>Ordenar por <select class="select" aria-label="Ordenar por"><option value="vendidos">Mais vendidos</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="desconto">Maior desconto</option><option value="az">A–Z</option></select></label>`;

function accountMenu(ativo) {
  const it = (href, k, txt) => `<a href="${href}" class="${ativo === k ? 'ativo' : ''}">${txt}</a>`;
  return `<nav class="acc-menu" aria-label="Minha conta">${it('conta.html', 'pedidos', 'Meus pedidos')}${it('conta.html?aba=dados', 'dados', 'Dados pessoais')}${it('conta.html?aba=enderecos', 'enderecos', 'Endereços')}${it('favoritos.html', 'fav', 'Favoritos')}<button class="sair" data-sair>Sair</button></nav>`;
}
document.addEventListener('click', e => { if (e.target.closest('[data-sair]')) { store.set('user', null); location.href = 'login.html'; } });
