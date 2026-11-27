import { C, ICONS, icon, esc } from './content.mjs';

// C · Planilha viva — o site é uma planilha; o botão Atualizar faz a manual virar automática.
const row = (n, label, html) => `<tr><th scope="row" class="rn">${n}</th><td class="k">${label}</td><td class="v">${html}</td></tr>`;

const sheet = (p, i, total, withAct = true) => `
<section class="sheet" id="${p.id}" data-cell="${String.fromCharCode(65 + i)}1" data-formula="=ANALISAR(&quot;${esc(p.name)}&quot;)">
  <div class="tab"><span>${String(i + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}</span> ${esc(p.kind)}</div>
  <h3>${esc(p.name)}</h3>
  ${p.image ? `<img class="shot" src="${p.image}" alt="${esc(p.imageAlt)}" width="1440" height="900" loading="lazy">` : ''}
  <table>
    <tbody>
      ${row(1, C.questions[0], `<span class="type">${esc(p.problem)}</span>`)}
      ${row(2, C.questions[1], `<ol class="type">${p.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`)}
      ${row(3, C.questions[2], `<span class="type">${esc(p.result)}</span>`)}
    </tbody>
  </table>
  <div class="foot">
    ${withAct ? `<span class="status" data-state="manual"><span class="dot"></span><b>Antes:</b> manual</span>
    <button class="refresh" type="button">${icon('refresh')} Atualizar</button>` : ''}
    ${p.href ? `<a class="link" href="${p.href}" target="_blank" rel="noreferrer">Ver amostra pública ${icon('arrow-ur')}</a>` : ''}
  </div>
</section>`;

export const pageC = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>C · Planilha viva — ${C.title}</title>
<meta name="color-scheme" content="light">
<meta name="description" content="Nilson Lopes — dados, BI e automação com contexto de operação.">
<style>
:root{
  --paper:#f5f1e6;--cell:#fbf9f2;--grid:#d9d2bf;--head:#e8e1cd;--ink:#1d2a22;--mute:#5a6659;
  --green:#1f6b45;--green-soft:#d5ead9;--red:#b3341f;--red-soft:#f3d9d2;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
  --mono:"Cascadia Mono",Consolas,ui-monospace,monospace;
  --ui:"Segoe UI Variable Text","Segoe UI",system-ui,sans-serif;
}
*{box-sizing:border-box}
html{background:var(--paper);color:var(--ink);overflow-x:clip;scroll-behavior:smooth;scroll-padding-top:7.5rem}
body{margin:0;overflow-x:clip;font:1.0625rem/1.55 var(--serif);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:100% 2rem,8rem 100%;background-color:var(--paper)}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
.ic{width:1.1em;height:1.1em;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
a{color:var(--green)}
:focus-visible{outline:3px solid var(--green);outline-offset:2px}
.skip-link{position:absolute;left:1rem;top:-4rem;background:var(--green);color:var(--paper);padding:.6rem 1rem;z-index:30}
.skip-link:focus{top:1rem}
.top{position:sticky;top:0;z-index:20;background:var(--head);border-bottom:1px solid var(--ink)}
.top .row1{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.55rem clamp(1rem,4vw,2.5rem)}
.mark{font:700 1.05rem var(--ui);color:var(--ink);text-decoration:none}
nav{display:flex;gap:clamp(.8rem,3vw,2rem);font:.92rem var(--ui)}
nav a{color:var(--ink);text-decoration:none;padding:.3rem 0;border-bottom:2px solid transparent}
nav a:hover{border-color:var(--green)}
.fx{display:flex;align-items:center;gap:.6rem;padding:.35rem clamp(1rem,4vw,2.5rem);background:var(--cell);border-top:1px solid var(--grid);font:.9rem var(--mono)}
.fx .cell{min-width:3.2rem;text-align:center;border-right:1px solid var(--grid);padding-right:.6rem;color:var(--green);font-weight:700}
.fx .fxl{color:var(--mute)}
.fx .formula{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
main{padding:0 clamp(1rem,5vw,4rem)}
.hero{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:clamp(1.5rem,4vw,4rem);align-items:center;min-height:calc(100svh - 7rem);max-width:72rem;margin:0 auto;padding:3rem 0}
.hero h1{font:700 clamp(2.6rem,7vw,5.6rem)/1.12 var(--serif);letter-spacing:-.03em;margin:0 0 1.2rem;display:block}
.hero>div:first-child{background:var(--paper);padding:1.4rem 1.6rem 1.6rem 0;margin-left:-.2rem}
.hero .lead{margin:1.3rem 0 1.6rem;max-width:34rem;color:var(--mute)}
.flow{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;font:.95rem var(--mono);margin:0 0 1.2rem;width:fit-content}
.flow span{border:1px solid var(--ink);padding:.15rem .55rem;background:var(--cell)}
.cta{display:flex;flex-wrap:wrap;gap:.8rem}
.btn{display:inline-flex;gap:.5rem;align-items:center;padding:.75rem 1.05rem;font:600 .98rem var(--ui);text-decoration:none;border:1px solid var(--ink);color:var(--ink);background:var(--cell);border-radius:3px;transition:background-color .15s,color .15s}
.btn.main{background:var(--green);border-color:var(--green);color:var(--paper)}
.btn:hover{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.portrait{border:1px solid var(--ink);background:var(--cell);padding:.5rem;max-width:18rem;justify-self:center;margin:0}
.portrait img{display:block;width:100%;aspect-ratio:1;object-fit:cover}
.portrait figcaption{font:.82rem var(--mono);color:var(--mute);padding:.5rem .1rem 0}
.head{max-width:72rem;margin:4rem auto 1.5rem}
.head h2{font:700 clamp(2rem,5vw,3.4rem)/1 var(--serif);letter-spacing:-.02em;margin:0 0 .6rem;display:inline-block;background:var(--paper);padding-right:.3em}
.head p{max-width:42rem;margin:0;color:var(--mute);background:var(--paper)}
.sheet{max-width:72rem;margin:0 auto 3.5rem;background:var(--cell);border:1px solid var(--ink);box-shadow:5px 5px 0 var(--grid)}
.tab{display:inline-block;margin:-1px 0 0 -1px;background:var(--ink);color:var(--paper);font:.85rem var(--mono);padding:.35rem .8rem}
.tab span{color:var(--green-soft);margin-right:.6rem}
.sheet h3{font:700 clamp(1.7rem,3.6vw,2.6rem)/1.05 var(--serif);margin:.9rem 1.2rem .8rem;letter-spacing:-.015em}
.shot{display:block;width:calc(100% - 2.4rem);max-width:36rem;height:auto;border:1px solid var(--ink);margin:0 1.2rem 1rem}
table{width:100%;max-width:48rem;border-collapse:collapse;border-top:1px solid var(--ink)}
tr{border-bottom:1px solid var(--grid)}
.rn{width:2.6rem;background:var(--head);border-right:1px solid var(--ink);font:.82rem var(--mono);color:var(--mute);text-align:center;vertical-align:top;padding:.7rem 0}
.k{width:min(14rem,30%);padding:.7rem 1rem;font:700 .9rem var(--ui);color:var(--green);vertical-align:top;border-right:1px solid var(--grid)}
.v{padding:.7rem 1rem;vertical-align:top}
.v ol{margin:0;padding-left:1.2rem}.v li{margin:.2rem 0}
.type{display:block;max-width:65ch}
.foot{display:flex;flex-wrap:wrap;gap:1rem;align-items:center;padding:.8rem 1rem;border-top:1px solid var(--ink);background:var(--head)}
.status{display:inline-flex;align-items:center;gap:.5rem;font:.9rem var(--mono);padding:.25rem .6rem;border:1px solid var(--red);background:var(--red-soft);color:var(--red)}
.status .dot{width:.6rem;height:.6rem;border-radius:50%;background:var(--red)}
.status[data-state=auto]{border-color:var(--green);background:var(--green-soft);color:var(--green)}
.status[data-state=auto] .dot{background:var(--green)}
.refresh{display:inline-flex;gap:.45rem;align-items:center;padding:.5rem .9rem;font:700 .92rem var(--ui);background:var(--ink);color:var(--paper);border:1px solid var(--ink);border-radius:3px;cursor:pointer}
.refresh:hover{background:var(--green);border-color:var(--green)}
.sheet.spin .refresh .ic{animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.link{display:inline-flex;gap:.4rem;align-items:center;font:700 .92rem var(--mono);margin-left:auto}
/* a onda de recálculo */
.sheet.wave tr{animation:wave .5s ease both}
.sheet.wave tr:nth-child(2){animation-delay:.18s}.sheet.wave tr:nth-child(3){animation-delay:.36s}
@keyframes wave{0%{background:var(--green-soft)}100%{background:transparent}}
@media (prefers-reduced-motion:reduce){.sheet.wave tr,.sheet.spin .refresh .ic{animation:none}}
.contact{max-width:72rem;margin:0 auto;padding:3rem 0 5rem}
.contact h2{font:700 clamp(2rem,5vw,3.4rem)/1 var(--serif);letter-spacing:-.02em;margin:0 0 .8rem;max-width:18ch;background:var(--paper);display:inline}
.contact p{max-width:40rem;color:var(--mute);background:var(--paper);margin:1rem 0 1.4rem}
footer{background:var(--ink);color:var(--paper);padding:1.4rem clamp(1rem,5vw,4rem);font:.85rem var(--mono)}
@media (max-width:760px){
  .hero{grid-template-columns:minmax(0,1fr)}
  .portrait{justify-self:start;max-width:11rem;order:-1}
  nav a:nth-child(2){display:none}
  .k{width:auto;display:block;border-right:0;padding-bottom:0}
  .v{display:block;padding-top:.3rem}
  tr{display:grid;grid-template-columns:2.4rem 1fr}
  .rn{grid-row:1/3}
}
</style>
</head>
<body>
${ICONS}
<a class="skip-link" href="#projetos">Pular para o conteúdo</a>
<div class="top">
  <div class="row1">
    <a class="mark" href="#top" aria-label="${C.name} — início">${C.name}</a>
    <nav aria-label="Navegação principal">${C.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
  </div>
  <div class="fx" aria-hidden="true"><span class="cell" id="cell">A1</span><span class="fxl">fx</span><span class="formula" id="formula">=OPERAÇÃO → DADOS → AÇÃO</span></div>
</div>
<main>
  <section class="hero" id="top" data-cell="A1" data-formula="=OPERAÇÃO → DADOS → AÇÃO">
    <div>
      <p class="flow">${C.hero.flow.map((t) => `<span>${esc(t)}</span>`).join(icon('arrow-r'))}</p>
      <h1>${esc(C.hero.h1)}</h1>
      <p class="lead">${esc(C.hero.intro)}</p>
      <div class="cta">
        <a class="btn main" href="#projetos">Ver projetos ${icon('arrow-r')}</a>
        <a class="btn" href="${C.contact.linkedin}" target="_blank" rel="noreferrer">${icon('chat')} Conversar no LinkedIn</a>
      </div>
    </div>
    <figure class="portrait">
      <img src="../../site/assets/images/nilson-lopes.jpg" width="400" height="400" alt="${C.hero.portraitAlt}">
      <figcaption>${C.name}</figcaption>
    </figure>
  </section>

  <div class="head" id="projetos">
    <h2>${C.alloha.title}</h2>
    <p>${esc(C.alloha.lead)}</p>
  </div>
  ${C.projects.map((p, i) => sheet(p, i, C.projects.length)).join('')}

  <div class="head" id="lab">
    <h2>${C.lab.title}</h2>
    <p>${C.lab.lead}</p>
  </div>
  ${C.lab.items.map((p, i) => sheet(p, i, C.lab.items.length, false)).join('')}

  <section class="contact" id="contato" data-cell="Z1" data-formula="=CONTATO(&quot;LinkedIn&quot;)">
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
  const cellEl = document.getElementById('cell'), fxEl = document.getElementById('formula');
  // a barra de fórmulas acompanha a seção em foco
  const secs = [...document.querySelectorAll('[data-cell]')];
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { cellEl.textContent = e.target.dataset.cell; fxEl.textContent = e.target.dataset.formula; }
  }), { rootMargin: '-40% 0px -50% 0px' });
  secs.forEach((s) => io.observe(s));
  // atualizar: onda de recálculo e o estado vira automático
  document.querySelectorAll('.sheet').forEach((sh) => {
    const btn = sh.querySelector('.refresh'), st = sh.querySelector('.status'); if (!btn) return;
    btn.addEventListener('click', () => {
      if (st.dataset.state === 'auto') return;
      const set = () => { st.dataset.state = 'auto'; st.innerHTML = '<span class="dot"></span><b>Agora:</b> automático'; sh.classList.remove('spin'); };
      if (mq.matches) return set();
      sh.classList.add('spin', 'wave'); setTimeout(set, 1100); setTimeout(() => sh.classList.remove('wave'), 1400);
    });
  });
})();
</script>
</body>
</html>
`;
