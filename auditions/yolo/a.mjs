import { C, ICONS, icon, esc } from './content.mjs';

// A · Linhagem — o visitante voa por uma pipeline: cada projeto é um portão.
const qa = (p, withHold) => `
<dl class="qa">
  <dt>${C.questions[0]}</dt><dd>${esc(p.problem)}</dd>
  <dt>${C.questions[1]}</dt><dd><ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></dd>
  <dt>${C.questions[2]}</dt><dd>${esc(p.result)}</dd>
</dl>${withHold ? `
<div class="act" id="act" data-state="idle">
  <button class="hold" id="hold" type="button" aria-describedby="act-hint">${icon('hold')}<span id="hold-label">Segure para rodar a pipeline</span></button>
  <button class="skip" id="skip" type="button">Pular</button>
  <span class="ring" aria-hidden="true"><i id="ring"></i></span>
  <p id="act-hint" class="hint">Mantenha o clique, o toque ou a tecla Espaço. Sem segurar, ela roda sozinha em instantes.</p>
</div>` : ''}`;

const proj = (p, i) => `
<section class="beat ${i % 2 ? 'right' : ''}" id="${p.id}" data-node="${esc(p.node)}">
  <article class="card">
    <p class="meta"><span>${String(i + 1).padStart(2, '0')}/04</span> ${esc(p.kind)}</p>
    <h3>${esc(p.name)}</h3>
    ${p.image ? `<img class="shot" src="${p.image}" alt="${esc(p.imageAlt)}" width="1440" height="900" loading="lazy">` : ''}
    ${qa(p, p.id === 'm')}
    ${p.href ? `<a class="link" href="${p.href}" target="_blank" rel="noreferrer">Ver amostra pública ${icon('arrow-ur')}</a>` : ''}
  </article>
</section>`;

const lab = C.lab.items
  .map(
    (p) => `
  <article class="card mini">
    <p class="meta">${esc(p.kind)}</p>
    <h3>${esc(p.name)}</h3>
    <dl class="qa">
      <dt>${C.questions[0]}</dt><dd>${esc(p.problem)}</dd>
      <dt>${C.questions[1]}</dt><dd><ol>${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></dd>
      <dt>${C.questions[2]}</dt><dd>${esc(p.result)}</dd>
    </dl>
    ${p.href ? `<a class="link" href="${p.href}" target="_blank" rel="noreferrer">Abrir no GitHub ${icon('arrow-ur')}</a>` : '<p class="meta">Repositório público em breve</p>'}
  </article>`
  )
  .join('');

export const pageA = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>A · Linhagem — ${C.title}</title>
<meta name="color-scheme" content="dark">
<meta name="description" content="Nilson Lopes — dados, BI e automação com contexto de operação.">
<style>
:root{
  --ground:#081321;--panel:#0c1d31;--line:#1d3955;--ink:#e8f1fb;--mute:#93abc4;
  --signal:#58a6ff;--cyan:#91dcff;--ok:#6fe3b4;--veil:rgb(8 19 33 / .9);
  --mono:"Cascadia Code","JetBrains Mono",ui-monospace,Consolas,monospace;
  --display:"Bahnschrift","Segoe UI Variable Display","Segoe UI",system-ui,sans-serif;
  --text:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif;
}
*{box-sizing:border-box}
html{background:var(--ground);color:var(--ink);scroll-behavior:smooth;overflow-x:clip}
body{margin:0;overflow-x:clip;font:1.0625rem/1.6 var(--text);-webkit-font-smoothing:antialiased}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
.ic{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
a{color:var(--cyan)}
:focus-visible{outline:2px solid var(--cyan);outline-offset:3px;border-radius:2px}
.skip-link{position:absolute;left:1rem;top:-4rem;background:var(--signal);color:var(--ground);padding:.6rem 1rem;z-index:20}
.skip-link:focus{top:1rem}
#stage{position:fixed;inset:0;width:100%;height:100%;z-index:0;display:block}
header.bar{position:fixed;inset:0 0 auto;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.9rem clamp(1rem,4vw,2.5rem);background:linear-gradient(var(--ground),transparent)}
.mark{font:700 1.05rem var(--display);color:var(--ink);text-decoration:none}
.mark b{color:var(--signal);font-weight:700}
nav{display:flex;gap:clamp(.8rem,3vw,1.8rem);font:.95rem var(--mono)}
nav a{color:var(--mute);text-decoration:none;padding:.35rem 0;border-bottom:1px solid transparent}
nav a:hover{color:var(--ink);border-color:var(--signal)}
main{position:relative;z-index:1}
.beat{min-height:100svh;display:flex;align-items:center;padding:6rem clamp(1rem,5vw,4rem) 4rem;width:min(100%,90rem);margin-inline:auto}
.beat.right{justify-content:flex-end}
.card{width:min(34rem,100%);background:var(--veil);border:1px solid var(--line);padding:clamp(1.2rem,3vw,2rem)}
.card h3{font:700 clamp(1.5rem,3.4vw,2.2rem)/1.1 var(--display);margin:.2rem 0 1rem;letter-spacing:-.02em}
.meta{font:.82rem var(--mono);color:var(--mute);margin:0}
.meta span{color:var(--signal);margin-right:.6rem}
.qa{margin:0}
.qa dt{font:700 .92rem var(--mono);color:var(--cyan);margin-top:1rem}
.qa dd{margin:.25rem 0 0;color:var(--ink)}
.qa ol{margin:.1rem 0 0;padding-left:1.2rem}
.qa li{margin:.25rem 0}
.shot{display:block;width:100%;height:auto;border:1px solid var(--line);margin:0 0 .6rem}
.link{display:inline-flex;gap:.4rem;align-items:center;margin-top:1.2rem;font:.95rem var(--mono)}
/* hero */
.hero{min-height:100svh}
.hero .wrap{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:clamp(1.5rem,4vw,4rem);align-items:center;width:min(70rem,100%)}
.hero h1{font:700 clamp(2.6rem,7.4vw,6rem)/.96 var(--display);letter-spacing:-.045em;margin:0 0 1.4rem;max-width:12ch}
.hero p{max-width:34rem;color:var(--mute);margin:0 0 1.6rem}
.hero .flow{font:1rem var(--mono);color:var(--signal);margin:0 0 1.4rem;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
.hero .flow .ic{width:1em}
.portrait{width:min(19rem,60vw);aspect-ratio:1;object-fit:cover;border:1px solid var(--line);justify-self:center;display:block}
.cta{display:flex;flex-wrap:wrap;gap:.8rem}
.btn{display:inline-flex;gap:.5rem;align-items:center;padding:.8rem 1.1rem;font:600 .98rem var(--text);text-decoration:none;border-radius:6px;border:1px solid var(--signal);color:var(--ink);transition:background-color .2s,color .2s}
.btn.main{background:var(--signal);color:var(--ground)}
.btn:hover{background:var(--cyan);border-color:var(--cyan);color:var(--ground)}
.intro{min-height:60svh}
.intro .card{width:min(44rem,100%)}
.intro h2{font:700 clamp(1.8rem,4.4vw,3rem)/1.05 var(--display);letter-spacing:-.03em;margin:0 0 .8rem}
.intro p{margin:0;color:var(--mute)}
/* act */
.act{margin-top:1.4rem;display:grid;grid-template-columns:auto auto 1fr;gap:.8rem;align-items:center}
.hold{display:inline-flex;gap:.55rem;align-items:center;padding:.85rem 1.1rem;background:transparent;color:var(--ink);border:1px solid var(--cyan);border-radius:6px;font:600 .98rem var(--text);cursor:pointer;touch-action:none;user-select:none}
.hold:active,.act[data-state=holding] .hold{background:var(--panel)}
.act[data-state=done] .hold{border-color:var(--ok);color:var(--ok)}
.skip{background:none;border:0;color:var(--mute);font:.9rem var(--mono);cursor:pointer;text-decoration:underline;padding:.5rem}
.ring{height:6px;background:var(--line);border-radius:3px;overflow:hidden}
.ring i{display:block;height:100%;width:0;background:var(--cyan)}
.act[data-state=done] .ring i{background:var(--ok)}
.hint{grid-column:1/-1;margin:0;font:.85rem var(--mono);color:var(--mute)}
.lab{padding:6rem clamp(1rem,5vw,4rem);width:min(100%,90rem);margin-inline:auto}
.lab h2,.contact h2{font:700 clamp(1.8rem,4.4vw,3rem)/1.05 var(--display);letter-spacing:-.03em;margin:0 0 .5rem}
.lab>p{color:var(--mute);margin:0 0 2rem}
.lab .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:1.5rem;max-width:72rem}
.lab .card{width:auto}
.contact{min-height:80svh;width:min(100%,90rem);margin-inline:auto;display:flex;align-items:center;padding:6rem clamp(1rem,5vw,4rem) 3rem}
.contact .card{width:min(44rem,100%)}
.contact p{color:var(--mute)}
footer{position:relative;z-index:1;padding:1.5rem clamp(1rem,5vw,4rem) 2.5rem;font:.85rem var(--mono);color:var(--mute);background:var(--ground)}
@media (max-width:760px){
  .hero .wrap{grid-template-columns:minmax(0,1fr)}
  .portrait{justify-self:start;width:12rem;order:-1}
  nav a:nth-child(2){display:none}
  .beat.right{justify-content:flex-start}
  .act{grid-template-columns:1fr auto}.ring{grid-column:1/-1}
}
</style>
</head>
<body>
${ICONS}
<a class="skip-link" href="#projetos">Pular para o conteúdo</a>
<canvas id="stage" aria-hidden="true"></canvas>
<header class="bar">
  <a class="mark" href="#top" aria-label="${C.name} — início">${C.name.split(' ')[0]}<b>.</b>${C.name.split(' ')[1]}</a>
  <nav aria-label="Navegação principal">${C.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
</header>
<main>
  <section class="beat hero" id="top" data-node="Planilha">
    <div class="wrap">
      <div>
        <p class="flow">${C.hero.flow.map((t) => esc(t)).join(` ${icon('arrow-r')} `)}</p>
        <h1>${esc(C.hero.h1)}</h1>
        <p>${esc(C.hero.intro)}</p>
        <div class="cta">
          <a class="btn main" href="#projetos">Ver projetos ${icon('arrow-r')}</a>
          <a class="btn" href="${C.contact.linkedin}" target="_blank" rel="noreferrer">${icon('chat')} Conversar no LinkedIn</a>
        </div>
      </div>
      <img class="portrait" src="../../site/assets/images/nilson-lopes.jpg" width="400" height="400" alt="${C.hero.portraitAlt}">
    </div>
  </section>
  <section class="beat intro" id="projetos" data-skip>
    <div class="card">
      <h2>${C.alloha.title}</h2>
      <p>${esc(C.alloha.lead)}</p>
    </div>
  </section>
  ${C.projects.map(proj).join('')}
  <section class="lab beat-lab" id="lab" data-node="Ação">
    <h2>${C.lab.title}</h2>
    <p>${C.lab.lead}</p>
    <div class="grid">${lab}</div>
  </section>
  <section class="contact" id="contato">
    <div class="card">
      <h2>${C.contact.title}</h2>
      <p>${C.contact.body}</p>
      <div class="cta">
        <a class="btn main" href="${C.contact.linkedin}" target="_blank" rel="noreferrer">${icon('chat')} ${C.contact.cta}</a>
        <a class="btn" href="${C.contact.github}" target="_blank" rel="noreferrer">${icon('branch')} GitHub</a>
      </div>
    </div>
  </section>
</main>
<footer>${C.contact.footer}</footer>
<script>
(() => {
  const root = document.documentElement;
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const cv = document.getElementById('stage'), cx = cv.getContext('2d');
  const css = getComputedStyle(root), col = (n) => css.getPropertyValue(n).trim();
  const nodes = [...document.querySelectorAll('[data-node]')];
  const labels = nodes.map((n) => n.dataset.node);
  let W = 0, H = 0, dpr = 1, f = 0, fT = 0, speed = 1, done = mq.matches, prog = 0, holding = false;
  const P = Array.from({ length: 180 }, () => ({ lane: Math.random() * 2 - 1, h: Math.random(), z: Math.random() * 9, v: 0.15 + Math.random() * 0.5 }));
  function size() { dpr = Math.min(devicePixelRatio || 1, 2); W = cv.width = Math.round(innerWidth * dpr); H = cv.height = Math.round(innerHeight * dpr); }
  function target() {
    const y = scrollY + innerHeight * 0.5;
    const ps = nodes.map((n) => { const r = n.getBoundingClientRect(); return scrollY + r.top + r.height / 2; });
    if (y <= ps[0]) return 0;
    for (let i = 0; i < ps.length - 1; i++) if (y < ps[i + 1]) return i + (y - ps[i]) / (ps[i + 1] - ps[i]);
    return ps.length - 1;
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function draw(t) {
    const hz = H * 0.46, base = H * 0.30;
    cx.clearRect(0, 0, W, H);
    // chão em perspectiva
    cx.lineWidth = dpr; cx.strokeStyle = col('--line');
    for (let k = 0; k < 14; k++) {
      const d = k - (f % 1) + 0.8; if (d < 0.2) continue;
      const y = hz + base / d; cx.globalAlpha = clamp(1.1 / d, 0, 0.9);
      cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke();
    }
    cx.globalAlpha = 0.55;
    for (let l = -9; l <= 9; l++) { cx.beginPath(); cx.moveTo(W / 2, hz); cx.lineTo(W / 2 + l * W * 0.16, H); cx.stroke(); }
    // partículas = dado em fluxo
    cx.fillStyle = col('--signal');
    for (const p of P) {
      let d = p.z - f + 0.8; if (d < 0.1) { p.z += 9; d += 9; } if (d > 9) { p.z -= 9; d -= 9; }
      const s = 1 / d, x = W / 2 + p.lane * W * 0.55 * s * 0.6, y = hz + base * s - p.h * H * 0.34 * s;
      cx.globalAlpha = clamp(1.2 * s, 0.05, 0.95); cx.fillRect(x, y, Math.max(1, 2.4 * dpr * s), Math.max(1, 2.4 * dpr * s));
      if (!mq.matches) p.z -= p.v * speed * 0.016;
    }
    // portões = projetos
    cx.textAlign = 'center';
    nodes.forEach((n, i) => {
      const d = i - f + 0.8; if (d < 0.18) return;
      const s = 1 / d, w = W * 0.34 * s, h = H * 0.34 * s, x = W / 2 - w / 2, y = hz + base * s - h;
      const on = Math.abs(i - f) < 0.45, ok = n.id === 'm' && done;
      cx.globalAlpha = clamp(d / 0.8, 0, 1) * (on ? 1 : 0.55);
      cx.lineWidth = (on ? 3 : 1.5) * dpr * Math.min(s, 2);
      cx.strokeStyle = ok ? col('--ok') : on ? col('--cyan') : col('--signal');
      cx.strokeRect(x, y, w, h);
      cx.fillStyle = ok ? col('--ok') : col('--cyan');
      cx.font = '600 ' + Math.round(clamp(14 * s, 9, 30) * dpr) + 'px ' + col('--mono');
      cx.fillText(labels[i] + (ok ? '  ✓' : ''), W / 2, y - 10 * dpr * Math.min(s, 2));
    });
    cx.globalAlpha = 1;
  }
  let last = 0;
  function frame(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    fT = target(); f += (fT - f) * (mq.matches ? 1 : 1 - Math.pow(0.0005, dt));
    if (holding && !done) {
      prog = Math.min(1, prog + dt / 2.2); speed = 7;
      if (prog >= 1) finish();
    } else { speed = 1 + (done ? 0 : 0); if (!done) prog = Math.max(0, prog - dt * 0.6); }
    ring.style.width = (done ? 100 : prog * 100) + '%';
    draw(t);
    if (!mq.matches) requestAnimationFrame(frame);
  }
  const act = document.getElementById('act'), hold = document.getElementById('hold'), ring = document.getElementById('ring'), lbl = document.getElementById('hold-label');
  function finish() { done = true; holding = false; act.dataset.state = 'done'; lbl.textContent = 'Pipeline executada'; }
  function start() { if (done) return; holding = true; act.dataset.state = 'holding'; }
  function stop() { holding = false; if (!done) act.dataset.state = 'idle'; }
  hold.addEventListener('pointerdown', (e) => { hold.setPointerCapture(e.pointerId); start(); });
  hold.addEventListener('pointerup', stop); hold.addEventListener('pointercancel', stop);
  hold.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } });
  hold.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') stop(); });
  document.getElementById('skip').addEventListener('click', finish);
  // a ação nunca prende o scroll: resolve sozinha depois de um tempo
  let idle = setTimeout(() => {}, 0);
  new IntersectionObserver((es) => es.forEach((e) => { clearTimeout(idle); if (e.isIntersecting && !done) idle = setTimeout(finish, 9000); }), { threshold: 0.6 }).observe(act);
  if (done) finish();
  addEventListener('resize', () => { size(); draw(0); });
  addEventListener('scroll', () => { if (mq.matches) { f = target(); draw(0); } }, { passive: true });
  mq.addEventListener('change', () => location.reload());
  size(); f = target();
  if (mq.matches) draw(0); else requestAnimationFrame(frame);
  root.classList.add('js');
})();
</script>
</body>
</html>
`;
