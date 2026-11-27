import { C, ICONS, icon, esc } from './content.mjs';

// B · Mesa de controle — a mesa de operação: cada projeto é um tíquete que se despacha.
const qa = (p) => `
<dl class="qa">
  <div><dt>${C.questions[0]}</dt><dd>${esc(p.problem)}</dd></div>
  <div><dt>${C.questions[1]}</dt><dd><ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></dd></div>
  <div><dt>${C.questions[2]}</dt><dd>${esc(p.result)}</dd></div>
</dl>`;

const ticket = (p, i, total, extra = '') => `
<article class="ticket" id="${p.id}" style="--i:${i}">
  <div class="body">
    <h3>${esc(p.name)}</h3>
    <p class="meta"><span class="flap" data-text="${String(i + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}">${String(i + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}</span> ${esc(p.kind)}</p>
    ${p.image ? `<img class="shot" src="${p.image}" alt="${esc(p.imageAlt)}" width="1440" height="900" loading="lazy">` : ''}
    ${qa(p)}
    ${p.href ? `<a class="link" href="${p.href}" target="_blank" rel="noreferrer">Ver amostra pública ${icon('arrow-ur')}</a>` : ''}
    ${extra}
  </div>
  <div class="stub">
    <button class="tear" type="button" aria-label="Despachar o tíquete ${esc(p.name)}">${icon('grip')}<span>Arraste para despachar</span></button>
    <span class="stamp" aria-hidden="true">${icon('check')} Despachado</span>
  </div>
</article>`;

export const pageB = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>B · Mesa de controle — ${C.title}</title>
<meta name="color-scheme" content="light">
<meta name="description" content="Nilson Lopes — dados, BI e automação com contexto de operação.">
<style>
:root{
  --paper:#ece6d8;--card:#f7f3e9;--ink:#17130e;--mute:#5d564a;--line:#cbc2ad;
  --signal:#d9431a;--signal-ink:#a52f0f;--board:#17130e;--board-2:#2a251c;--board-ink:#f1e9d4;--ok:#1d6b3f;
  --display:"Bahnschrift","Arial Narrow","Segoe UI",sans-serif;
  --text:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif;
  --mono:"Cascadia Mono",Consolas,ui-monospace,monospace;
}
*{box-sizing:border-box}
html{background:var(--paper);color:var(--ink);scroll-behavior:smooth;overflow-x:clip}
body{margin:0;overflow-x:clip;font:1.0625rem/1.6 var(--text);background:
  repeating-linear-gradient(0deg,transparent 0 31px,rgb(23 19 14 / .045) 31px 32px)}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
.ic{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
a{color:var(--signal-ink)}
:focus-visible{outline:3px solid var(--signal);outline-offset:3px}
.skip-link{position:absolute;left:1rem;top:-4rem;background:var(--ink);color:var(--paper);padding:.6rem 1rem;z-index:30}
.skip-link:focus{top:1rem}
header.bar{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.8rem clamp(1rem,4vw,2.5rem);background:var(--board);color:var(--board-ink)}
.mark{font:700 1.2rem var(--display);color:var(--board-ink);text-decoration:none;text-transform:uppercase}
.mark b{color:var(--signal)}
nav{display:flex;gap:clamp(.8rem,3vw,2rem);font:.95rem var(--mono)}
nav a{color:var(--board-ink);text-decoration:none;padding:.35rem 0;border-bottom:2px solid transparent}
nav a:hover{border-color:var(--signal)}
main{padding:0 clamp(1rem,5vw,4rem)}
.hero{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:clamp(1.5rem,4vw,4rem);align-items:center;min-height:calc(100svh - 4rem);padding:3rem 0;max-width:74rem;margin:0 auto}
.hero h1{font:700 clamp(3rem,8.4vw,7rem)/.9 var(--display);text-transform:uppercase;letter-spacing:-.02em;margin:0 0 1.4rem}
.hero p{max-width:34rem;margin:0 0 1.6rem;color:var(--mute)}
.board{background:var(--board);color:var(--board-ink);padding:.9rem 1rem;margin:0 0 1.6rem;display:inline-flex;gap:.5rem;flex-wrap:wrap;align-items:center;font:700 1.15rem var(--mono)}
.flap{display:inline-block;font-family:var(--mono);font-weight:700;font-variant-numeric:tabular-nums}
.board .flap{background:var(--board-2);padding:.2rem .45rem;text-transform:uppercase}
.board .ic{color:var(--signal)}
.badge{background:var(--card);border:2px solid var(--ink);padding:1rem 1rem 1.4rem;transform:rotate(1.6deg);box-shadow:8px 8px 0 var(--ink);max-width:19rem;justify-self:center}
.badge img{display:block;width:100%;aspect-ratio:1;object-fit:cover;border:2px solid var(--ink)}
.badge p{margin:.8rem 0 0;font:700 1.05rem var(--display);text-transform:uppercase;color:var(--ink)}
.cta{display:flex;flex-wrap:wrap;gap:.8rem}
.btn{display:inline-flex;gap:.5rem;align-items:center;padding:.8rem 1.1rem;font:700 .98rem var(--text);text-decoration:none;border:2px solid var(--ink);color:var(--ink);background:var(--card);border-radius:4px;transition:background-color .15s,color .15s}
.btn.main{background:var(--signal);border-color:var(--ink);color:var(--ink)}
.btn:hover{background:var(--ink);color:var(--paper)}
.section-head{max-width:74rem;margin:5rem auto 1.5rem}
.section-head h2{font:700 clamp(2rem,5vw,3.6rem)/.95 var(--display);text-transform:uppercase;margin:0 0 .6rem}
.section-head p{max-width:42rem;margin:0;color:var(--mute)}
/* tíquetes empilhados */
.stack{max-width:74rem;margin:0 auto;padding-bottom:6rem}
.ticket{position:sticky;top:calc(4.6rem + var(--i) * 18px);display:grid;grid-template-columns:minmax(0,1fr) 11rem;background:var(--card);border:2px solid var(--ink);box-shadow:6px 6px 0 var(--ink);margin:0 0 4rem;transform:rotate(calc((var(--i) - 1.5) * .35deg));transition:transform .5s cubic-bezier(.2,.8,.2,1),opacity .4s}
.ticket .body{padding:clamp(1.2rem,3vw,2rem)}
.ticket h3{font:700 clamp(1.7rem,4vw,2.8rem)/1 var(--display);text-transform:uppercase;margin:.3rem 0 .4rem}
.ticket .meta{margin-bottom:1rem}
.meta{margin:0;font:.85rem var(--mono);color:var(--mute)}
.meta .flap{color:var(--signal-ink);margin-right:.5rem}
.qa{margin:0;display:grid;gap:.9rem}
.qa dt{font:700 .9rem var(--mono);color:var(--signal-ink)}
.qa dd{margin:.2rem 0 0;max-width:65ch}
.qa ol{margin:.1rem 0 0;padding-left:1.2rem}.qa li{margin:.2rem 0}
.shot{display:block;width:100%;max-width:34rem;height:auto;border:2px solid var(--ink);margin:0 0 1rem}
.link{display:inline-flex;gap:.4rem;align-items:center;margin-top:1.1rem;font:700 .95rem var(--mono)}
.stub{position:relative;border-left:2px dashed var(--ink);background:var(--paper);display:flex;align-items:center;justify-content:center;padding:1rem;overflow:visible}
.tear{display:flex;flex-direction:column;align-items:center;gap:.5rem;background:var(--signal);color:var(--ink);border:2px solid var(--ink);padding:1rem .7rem;font:700 .9rem var(--display);text-transform:uppercase;cursor:grab;touch-action:none;user-select:none;border-radius:2px;width:100%}
.tear:active{cursor:grabbing}
.tear .ic{width:1.6em;height:1.6em}
.stamp{position:absolute;inset:auto auto 1rem 1rem;display:none;gap:.35rem;align-items:center;font:700 1rem var(--display);text-transform:uppercase;color:var(--ok);border:3px solid var(--ok);padding:.2rem .5rem;transform:rotate(-8deg)}
.ticket.done .stamp{display:inline-flex;animation:stamp .35s cubic-bezier(.2,1.4,.4,1) both}
.ticket.done .tear{display:none}
.ticket.done .stub{background:var(--card)}
@keyframes stamp{from{transform:scale(2.2) rotate(-18deg);opacity:0}to{transform:scale(1) rotate(-8deg);opacity:1}}
@media (prefers-reduced-motion:reduce){.ticket,.ticket.done .stamp{transition:none;animation:none}}
.lab .stack .ticket{position:relative;top:auto}
.contact{max-width:74rem;margin:0 auto;padding:4rem 0 5rem}
.contact h2{font:700 clamp(2rem,5vw,3.6rem)/.95 var(--display);text-transform:uppercase;margin:0 0 .8rem;max-width:18ch}
.contact p{max-width:40rem;color:var(--mute)}
footer{background:var(--board);color:var(--board-ink);padding:1.4rem clamp(1rem,5vw,4rem);font:.85rem var(--mono)}
@media (max-width:760px){
  .hero{grid-template-columns:minmax(0,1fr)}
  .badge{justify-self:start;order:-1;max-width:13rem}
  .ticket{grid-template-columns:minmax(0,1fr);position:relative;top:auto}
  .stub{border-left:0;border-top:2px dashed var(--ink)}
  nav a:nth-child(2){display:none}
}
</style>
</head>
<body>
${ICONS}
<a class="skip-link" href="#projetos">Pular para o conteúdo</a>
<header class="bar">
  <a class="mark" href="#top" aria-label="${C.name} — início">${C.name.split(' ')[0]}<b>/</b>${C.name.split(' ')[1]}</a>
  <nav aria-label="Navegação principal">${C.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
</header>
<main>
  <section class="hero" id="top">
    <div>
      <div class="board" aria-label="${C.hero.flow.join(' → ')}">${C.hero.flow.map((t) => `<span class="flap" data-text="${esc(t)}">${esc(t)}</span>`).join(icon('arrow-r'))}</div>
      <h1>Eu conecto operação, dados e automação.</h1>
      <p>${esc(C.hero.intro)}</p>
      <div class="cta">
        <a class="btn main" href="#projetos">Ver projetos ${icon('arrow-r')}</a>
        <a class="btn" href="${C.contact.linkedin}" target="_blank" rel="noreferrer">${icon('chat')} Conversar no LinkedIn</a>
      </div>
    </div>
    <figure class="badge" style="margin:0">
      <img src="../../site/assets/images/nilson-lopes.jpg" width="400" height="400" alt="${C.hero.portraitAlt}">
      <p>${C.name}</p>
    </figure>
  </section>

  <div class="section-head" id="projetos">
    <h2>${C.alloha.title}</h2>
    <p>${esc(C.alloha.lead)}</p>
  </div>
  <div class="stack">
    ${C.projects.map((p, i) => ticket(p, i, C.projects.length)).join('')}
  </div>

  <section class="lab" id="lab">
    <div class="section-head" style="margin-top:2rem">
      <h2>${C.lab.title}</h2>
      <p>${C.lab.lead}</p>
    </div>
    <div class="stack">
      ${C.lab.items.map((p, i) => ticket(p, i, C.lab.items.length)).join('')}
    </div>
  </section>

  <section class="contact" id="contato">
    <h2>${C.contact.title}</h2>
    <p>${C.contact.body}</p>
    <div class="cta">
      <a class="btn main" href="${C.contact.linkedin}" target="_blank" rel="noreferrer">${icon('chat')} ${C.contact.cta}</a>
      <a class="btn" href="${C.contact.github}" target="_blank" rel="noreferrer">${icon('branch')} GitHub</a>
    </div>
  </section>
</main>
<footer>${C.contact.footer}</footer>
<script>
(() => {
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/';
  // painel de partidas: as letras giram e assentam quando entram na tela
  function flip(el) {
    const txt = el.dataset.text; if (mq.matches || el.dataset.ran) return; el.dataset.ran = 1;
    const t0 = performance.now();
    (function tick(t) {
      const k = (t - t0) / 700; let s = '';
      for (let i = 0; i < txt.length; i++) s += (txt[i] === ' ' || k > 0.25 + i / (txt.length * 1.6)) ? txt[i] : GL[Math.floor(Math.random() * GL.length)];
      el.textContent = s; if (k < 1.1) requestAnimationFrame(tick); else el.textContent = txt;
    })(t0);
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) flip(e.target); }), { threshold: 0.6 });
  document.querySelectorAll('.flap').forEach((el) => io.observe(el));
  // despachar: arrastar o canhoto, ou Enter/Espaço
  document.querySelectorAll('.ticket').forEach((tk) => {
    const btn = tk.querySelector('.tear'), body = tk.querySelector('.stub');
    const finish = () => { tk.classList.add('done'); btn.style.transform = ''; };
    let x0 = null, dx = 0;
    btn.addEventListener('pointerdown', (e) => { btn.setPointerCapture(e.pointerId); x0 = e.clientX; dx = 0; });
    btn.addEventListener('pointermove', (e) => { if (x0 === null) return; dx = Math.max(0, e.clientX - x0); btn.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 14 + 'deg)'; });
    const up = () => { if (x0 === null) return; x0 = null; if (dx > 110) finish(); else { btn.style.transition = 'transform .3s'; btn.style.transform = ''; setTimeout(() => (btn.style.transition = ''), 320); } };
    btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up);
    btn.addEventListener('click', () => { if (dx < 6) finish(); });
  });
})();
</script>
</body>
</html>
`;
