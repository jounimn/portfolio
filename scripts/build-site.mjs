// Gera site/index.html (PT) e site/scripts/copy.js (tabelas PT/EN). Uso: node scripts/build-site.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { T, FIXED, PROJECTS, LAB } from './site-content.mjs';
import { demo } from './demos.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pt = T.pt;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// um elemento de texto traduzível
const k = (key) => `data-k="${key}"`;
const t = (key) => esc(pt[key]);
const ka = (pairs) => `data-ka="${pairs}"`;
const icon = (id) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${id}"/></svg>`;

const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<symbol id="i-arrow-d" viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></symbol>
<symbol id="i-arrow-ur" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></symbol>
<symbol id="i-branch" viewBox="0 0 24 24"><path d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a9 9 0 0 1-9 9"/></symbol>
<symbol id="i-file" viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9ZM14 3v6h6"/></symbol>
</defs></svg>`;

const panel = (p, i, group) => {
  const name = p.name ?? t(`${p.key}name`);
  const nameAttr = p.name ? '' : k(`${p.key}name`);
  return `
    <article class="proj" id="proj-${p.id}" ${group === 'alloha' ? `role="tabpanel" aria-labelledby="tab-${p.id}"` : ''} data-i="${i}" data-group="${group}">
      <header>
        <h3 ${nameAttr}>${name}</h3>
        <p class="kind"><span ${k(p.kindKey)}>${t(p.kindKey)}</span>${p.statusKey ? ` <span class="status" ${k(p.statusKey)}>${t(p.statusKey)}</span>` : ''}</p>
      </header>
      <p class="story" ${k(p.key + 'text')}>${t(p.key + 'text')}</p>
      ${demo(p.key, { k, t })}
      ${p.image ? `<figure class="shot"><img src="${p.image}" width="1440" height="900" loading="lazy" alt="${esc(pt.p3img)}" ${ka('alt:p3img')}></figure>` : ''}
      ${p.href ? `<a class="link" href="${p.href}" target="_blank" rel="noreferrer"><span ${k(p.linkKey)}>${t(p.linkKey)}</span> ${icon('arrow-ur')}</a>` : ''}
    </article>`;
};

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t('docTitle')}</title>
<meta name="description" content="${t('docDesc')}">
<meta property="og:title" content="${t('docTitle')}">
<meta property="og:description" content="${t('docDesc')}">
<meta name="color-scheme" content="dark">
<link rel="preload" href="assets/fonts/fraunces-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="demos.css">
<script>document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion');setTimeout(function(){if(!document.documentElement.dataset.ready)document.documentElement.classList.remove('motion')},4000)}</script>
</head>
<body>
${sprite}
<a class="skip-link" href="#sinal" ${k('skip')}>${t('skip')}</a>
<canvas id="fiber" aria-hidden="true"></canvas>
<header class="bar">
  <a class="mark" href="#sinal" aria-label="${FIXED.name}">${FIXED.name}</a>
  <nav aria-label="Principal">
    <a href="#origem" ${k('navOrigem')}>${t('navOrigem')}</a>
    <a href="#papel" ${k('navPapel')}>${t('navPapel')}</a>
    <a href="#alloha" ${k('navAlloha')}>${t('navAlloha')}</a>
    <a href="#lab" ${k('navLab')}>${t('navLab')}</a>
    <a href="#contato" ${k('navContato')}>${t('navContato')}</a>
  </nav>
  <button class="lang" id="lang" type="button" ${k('langBtn')} ${ka('aria-label:langAria')} aria-label="${esc(pt.langAria)}">${t('langBtn')}</button>
</header>
<main>
  <section class="ch hero" id="sinal" data-t="0">
    <div class="wrap hero-grid">
      <div class="rv">
        <h1 class="name">${FIXED.name}</h1>
        <p class="lead" ${k('heroLead')}>${t('heroLead')}</p>
        <p class="intro" ${k('heroIntro')}>${t('heroIntro')}</p>
        <div class="cta">
          <a class="btn main" href="#origem">${`<span ${k('ctaFollow')}>${t('ctaFollow')}</span>`} ${icon('arrow-d')}</a>
          <a class="btn" href="${FIXED.linkedin}" target="_blank" rel="noreferrer">${icon('chat')} <span ${k('ctaLinkedin')}>${t('ctaLinkedin')}</span></a>
        </div>
      </div>
      <figure class="portrait rv">
        <img src="assets/images/nilson-lopes.jpg" width="400" height="400" alt="${esc(pt.portraitAlt)}" ${ka('alt:portraitAlt')}>
      </figure>
    </div>
    <p class="hint" ${k('scrollHint')}>${t('scrollHint')}</p>
  </section>

  <section class="ch" id="origem" data-t="0.22">
    <div class="wrap">
      <h2 class="rv" ${k('orgTitle')}>${t('orgTitle')}</h2>
      <ol class="tl">
        ${[0, 1, 2, 3].map((n) => `<li class="rv"><span class="yr" ${k(`tl${n}y`)}>${t(`tl${n}y`)}</span><h3 ${k(`tl${n}t`)}>${t(`tl${n}t`)}</h3><p ${k(`tl${n}b`)}>${t(`tl${n}b`)}</p></li>`).join('')}
      </ol>
      <p class="close rv" ${k('orgClose')}>${t('orgClose')}</p>
    </div>
  </section>

  <section class="ch" id="papel" data-t="0.36">
    <div class="wrap">
      <h2 class="rv" ${k('roleTitle')}>${t('roleTitle')}</h2>
      <p class="lede rv" ${k('roleLead')}>${t('roleLead')}</p>
      <ol class="tl roles">
        ${[0, 1, 2, 3, 4, 5].map((n) => `<li class="rv"><h3 ${k(`role${n}t`)}>${t(`role${n}t`)}</h3><p ${k(`role${n}b`)}>${t(`role${n}b`)}</p></li>`).join('')}
      </ol>
    </div>
  </section>

  <section class="ch" id="alloha" data-t="0.5">
    <div class="wrap">
      <h2 class="rv" ${k('allTitle')}>${t('allTitle')}</h2>
      <p class="lede rv" ${k('allLead')}>${t('allLead')}</p>
      <p class="pick" ${k('allPick')}>${t('allPick')}</p>
      <div class="rack" role="tablist" ${ka('aria-label:allPick')} aria-label="${esc(pt.allPick)}">
        ${PROJECTS.map((p, i) => `<button role="tab" type="button" id="tab-${p.id}" aria-controls="proj-${p.id}" aria-selected="${i === 0}" data-i="${i}" tabindex="${i === 0 ? 0 : -1}"><i class="led" aria-hidden="true"></i><span ${p.name ? '' : k(`${p.key}name`)}>${p.name ?? t(`${p.key}name`)}</span></button>`).join('')}
      </div>
      <div class="panels">
        ${PROJECTS.map((p, i) => panel(p, i, 'alloha')).join('')}
      </div>
    </div>
  </section>

  <section class="ch" id="lab" data-t="0.78">
    <div class="wrap">
      <h2 class="rv" ${k('labTitle')}>${t('labTitle')}</h2>
      <p class="lede rv" ${k('labLead')}>${t('labLead')}</p>
      <div class="lab-grid">
        ${LAB.map((p, i) => panel(p, i, 'lab')).join('')}
      </div>
    </div>
  </section>

  <section class="ch end" id="contato" data-t="1">
    <div class="wrap">
      <h2 class="rv" ${k('conTitle')}>${t('conTitle')}</h2>
      <p class="lede rv" ${k('conBody')}>${t('conBody')}</p>
      <div class="cta rv">
        <a class="btn main" href="${FIXED.linkedin}" target="_blank" rel="noreferrer">${icon('chat')} <span ${k('conCta')}>${t('conCta')}</span></a>
        <a class="btn" href="${FIXED.github}" target="_blank" rel="noreferrer">${icon('branch')} <span ${k('conGh')}>${t('conGh')}</span></a>
        <button class="btn" id="print" type="button">${icon('file')} <span ${k('conPrint')}>${t('conPrint')}</span></button>
      </div>
      <div class="caps">
        <h3 ${k('capTitle')}>${t('capTitle')}</h3>
        <ul>${[0, 1, 2].map((n) => `<li><strong ${k(`cap${n}t`)}>${t(`cap${n}t`)}</strong><span ${k(`cap${n}b`)}>${t(`cap${n}b`)}</span></li>`).join('')}</ul>
        <h3 ${k('toolsTitle')}>${t('toolsTitle')}</h3>
        <p class="tools">${FIXED.tools.join(', ')}</p>
      </div>
    </div>
  </section>
</main>
<footer><span ${k('footer')}>${t('footer')}</span></footer>
<script type="module" src="scripts/portfolio.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'site', 'index.html'), html);
fs.mkdirSync(path.join(root, 'site', 'scripts'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'site', 'scripts', 'copy.js'),
  `// Gerado por scripts/build-site.mjs a partir de scripts/site-content.mjs. Não edite à mão.\nexport const copy = ${JSON.stringify(T, null, 2)};\n`
);
console.log('site/index.html e site/scripts/copy.js gerados');
