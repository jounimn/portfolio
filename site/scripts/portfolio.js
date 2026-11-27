import { copy } from './copy.js';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
root.dataset.ready = '1';

/* ── idioma: PT é o HTML; EN troca o texto pelas chaves data-k ── */
let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'pt';
const langBtn = document.getElementById('lang');
function applyLang() {
  const dict = copy[lang];
  root.lang = lang === 'en' ? 'en' : 'pt-BR';
  document.querySelectorAll('[data-k]').forEach((el) => { if (dict[el.dataset.k] != null) el.textContent = dict[el.dataset.k]; });
  document.querySelectorAll('[data-ka]').forEach((el) => {
    el.dataset.ka.split(';').forEach((pair) => { const [attr, key] = pair.split(':'); if (dict[key] != null) el.setAttribute(attr, dict[key]); });
  });
  document.title = dict.docTitle;
  document.querySelector('meta[name=description]')?.setAttribute('content', dict.docDesc);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', dict.docTitle);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', dict.docDesc);
}
langBtn.addEventListener('click', () => {
  lang = lang === 'pt' ? 'en' : 'pt';
  applyLang();
  const u = new URL(location.href); lang === 'en' ? u.searchParams.set('lang', 'en') : u.searchParams.delete('lang');
  history.replaceState(null, '', u);
});
if (lang === 'en') applyLang();

/* ── alloha: escolher uma ferramenta acende o caminho até ela ── */
const tabs = [...document.querySelectorAll('.rack [role=tab]')];
const panels = [...document.querySelectorAll('.proj[data-group=alloha]')];
let selected = 0;
function select(i, { focus = false, fromUser = true } = {}) {
  selected = i;
  tabs.forEach((t, n) => {
    const on = n === i;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on) t.classList.add('lit');
  });
  panels.forEach((p, n) => { p.hidden = n !== i; });
  if (focus) tabs[i].focus();
  window.dispatchEvent(new CustomEvent('fiber:select', { detail: { index: i, fromUser } }));
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => select(i));
  t.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); select((i + 1) % tabs.length, { focus: true }); }
    if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, { focus: true }); }
    if (k === 'Home') { e.preventDefault(); select(0, { focus: true }); }
    if (k === 'End') { e.preventDefault(); select(tabs.length - 1, { focus: true }); }
  });
});
select(0, { fromUser: false });

/* ── demonstrações: rodam só à vista; escolher a ferramenta reinicia o pulso do começo ── */
const demos = [...document.querySelectorAll('.demo')];
if (!reduced.matches && demos.length) {
  const see = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('seen', e.isIntersecting)), { threshold: 0.25 });
  demos.forEach((d) => see.observe(d));
  window.addEventListener('fiber:select', (e) => {
    const d = panels[e.detail.index]?.querySelector('.demo');
    if (!d) return;
    // tirar a animação, forçar o layout e devolvê-la faz o pulso partir do começo
    d.classList.add('restart'); void d.offsetWidth; d.classList.remove('restart');
  });
}

/* ── imprimir: todos os painéis aparecem pela folha de estilo de impressão ── */
document.getElementById('print')?.addEventListener('click', () => window.print());

/* ── entrada dos blocos, só com movimento permitido ── */
if (!reduced.matches) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
  document.querySelectorAll('.rv').forEach((el) => io.observe(el));
}

/* ── a cena 3D: só com WebGL2 e movimento permitido ── */
function hasWebGL2() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}
async function boot() {
  if (reduced.matches || !hasWebGL2()) return;
  try {
    const { startFiber } = await import('./fiber.js');
    const chapters = [...document.querySelectorAll('.ch')].map((el) => ({ el, t: parseFloat(el.dataset.t) }));
    startFiber({ canvas: document.getElementById('fiber'), chapters, getSelected: () => selected });
    root.classList.add('scene');
  } catch (err) {
    console.warn('Cena 3D indisponível; segue a versão em texto.', err);
  }
}
boot();
reduced.addEventListener('change', () => location.reload());
