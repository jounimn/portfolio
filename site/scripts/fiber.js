// A fibra: o currículo como um cabo que a câmera percorre. Cena procedural (sem modelos importados).
// Só roda com WebGL2 e movimento permitido; senão a página fica em texto, com a fibra desenhada em CSS.
import * as THREE from '../assets/vendor/three.module.min.js';

// Uma linha por nível de qualidade; cada recurso lê o seu próprio valor (pixel ratio, poeira).
const TIERS = [
  { pr: 1, dust: 260, packets: 24 },
  { pr: 1.5, dust: 700, packets: 48 },
  { pr: 2, dust: 1400, packets: 80 },
];
const SEG = 360, RAD = 6, MAX_DUST = 1400, MAX_PACKETS = 80;
const ease = (k) => k * k * (3 - 2 * k);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function pickTier() {
  const cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
  if (innerWidth < 768 || cores <= 4 || mem <= 2) return 0;
  return cores >= 8 && mem >= 8 ? 2 : 1;
}

export function startFiber({ canvas, chapters }) {
  const css = getComputedStyle(document.documentElement);
  const c = (n) => new THREE.Color(css.getPropertyValue(n).trim());
  let tier = pickTier();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: tier > 0, powerPreference: 'high-performance' });
  renderer.setClearColor(c('--ground'), 1);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(c('--ground'), 0.04);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 220);

  // o cabo principal
  const pts = [];
  for (let i = 0; i <= 10; i++) pts.push(new THREE.Vector3(Math.sin(i * 1.25) * 4.5, Math.cos(i * 0.9) * 1.6, -i * 12));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  const tube = (r, color, opacity, additive) => {
    const m = new THREE.MeshBasicMaterial({
      color, transparent: opacity < 1, opacity, depthWrite: opacity >= 1,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, SEG, r, RAD, false), m);
    scene.add(mesh);
    return mesh;
  };
  tube(0.03, c('--line'), 1, false);
  const lit = tube(0.032, c('--vfl'), 1, false);
  const halo = tube(0.07, c('--vfl'), 0.12, true);
  const setLit = (s) => {
    const n = Math.floor(clamp(s, 0, 1) * SEG) * RAD * 6;
    lit.geometry.setDrawRange(0, n);
    halo.geometry.setDrawRange(0, n);
  };


  // sprite de brilho redondo, reutilizado pela poeira e pelos nós
  const glowTex = (() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const x = cv.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(cv);
  })();
  const glow = (color, size, opacity) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
    sp.scale.setScalar(size);
    return sp;
  };

  // chão de circuito: uma grade distante dá profundidade e escala ao cabo
  const grid = new THREE.GridHelper(200, 100, c('--line'), c('--line'));
  grid.position.set(0, -6.5, -60);
  grid.material.transparent = true; grid.material.opacity = 0.35;
  scene.add(grid);

  // marcos da origem: um conector (ferrule e anéis) por etapa da carreira, ao longo do cabo
  const marks = [0.13, 0.2, 0.27, 0.34].map((t0) => {
    const P = curve.getPointAt(t0), T = curve.getTangentAt(t0).normalize();
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 14), new THREE.MeshBasicMaterial({ color: c('--glass') }));
    body.rotation.x = Math.PI / 2;
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.014, 6, 36), new THREE.MeshBasicMaterial({ color: c('--line') }));
    const r2 = r1.clone(); r2.material = r1.material; r2.position.z = 0.28; r1.position.z = -0.28;
    const halo = glow(c('--vfl'), 0, 0.0);
    g.add(body, r1, r2, halo);
    g.position.copy(P); g.lookAt(P.clone().add(T));
    scene.add(g);
    return { g, r1, r2, halo, t0, on: false };
  });

  // emblemas: cada ferramenta ganha um objeto 3D que repete o mecanismo da sua demonstração
  const matV = (k) => new THREE.MeshBasicMaterial({ color: c(k) });
  const lineMat = (k, o = 1) => new THREE.LineBasicMaterial({ color: c(k), transparent: o < 1, opacity: o });
  function emblem(kind) {
    const g = new THREE.Group(); let update = () => {};
    if (kind === 'p0') {
      const cubes = Array.from({ length: 9 }, (_, i) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.06), matV(i < 3 ? '--vfl-soft' : '--mute'));
        const a = i * 2.4, r = 0.9 + (i % 3) * 0.25;
        m.userData = { from: new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 1.3) * r * 0.8, ((i % 4) - 1.5) * 0.3), to: new THREE.Vector3(((i % 3) - 1) * 0.3, (1 - Math.floor(i / 3)) * 0.3, 0) };
        g.add(m); return m;
      });
      const slab = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 0.03), new THREE.MeshBasicMaterial({ color: c('--glass'), transparent: true, opacity: 0 }));
      slab.position.z = -0.06; g.add(slab);
      update = (k, t) => { const e = ease(k); slab.material.opacity = e * 0.9; cubes.forEach((m, i) => { m.position.lerpVectors(m.userData.from, m.userData.to, e); m.position.y += Math.sin(t * 1.4 + i) * 0.05 * (1 - e); m.rotation.z = (1 - e) * Math.sin(t + i) * 0.6; }); };
    } else if (kind === 'p1') {
      const bars = Array.from({ length: 4 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 0.12), matV('--vfl-soft')); m.position.x = (i - 1.5) * 0.32; g.add(m); return m; });
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.025, 0.12), matV('--line')); base.position.y = -0.52; g.add(base);
      const A = [0.5, 0.9, 0.65, 0.95], B = [0.9, 0.5, 0.95, 0.6];
      update = (k, t) => { const w = 0.5 + 0.5 * Math.sin(t * 0.7); bars.forEach((m, i) => { const h = Math.max(0.001, (A[i] + (B[i] - A[i]) * w) * ease(k)); m.scale.y = h; m.position.y = -0.5 + h / 2; }); };
    } else if (kind === 'p2') {
      const chips = ['--vfl', '--vfl-soft', '--pulse'].map((col, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.17, 0.05), matV(col)); g.add(m); return m; });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.012, 6, 48), matV('--line')); g.add(ring);
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), new THREE.MeshBasicMaterial({ color: c('--vfl'), wireframe: true })); g.add(core);
      update = (k, t) => { const e = ease(k); chips.forEach((m, i) => { const a = t * 0.8 + (i * Math.PI * 2) / 3; m.position.set(Math.cos(a) * 0.62 * e, Math.sin(a) * 0.62 * e, 0); m.scale.setScalar(Math.max(0.001, e)); }); ring.scale.setScalar(Math.max(0.001, e)); core.rotation.y = t; core.rotation.x = t * 0.6; core.scale.setScalar(Math.max(0.001, e)); };
    } else if (kind === 'p3') {
      const P = [[0, 0.55], [-0.5, 0.15], [0, 0.15], [0.5, 0.15], [-0.7, -0.35], [-0.3, -0.35], [-0.1, -0.35], [0.3, -0.35], [0.5, -0.35], [0.8, -0.35]];
      const edges = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [2, 7], [3, 8], [3, 9]];
      const lv = [0, 1, 1, 1, 2, 2, 2, 2, 2, 2];
      const dots = P.map(([x, y], i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(i === 0 ? 0.07 : 0.05, 10, 8), matV('--mute')); m.position.set(x, y, 0); g.add(m); return m; });
      const seg = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(edges.flatMap(([a, b]) => [new THREE.Vector3(P[a][0], P[a][1], 0), new THREE.Vector3(P[b][0], P[b][1], 0)])), lineMat('--line'));
      g.add(seg);
      const path = [6, 2, 0].map((i) => new THREE.Vector3(P[i][0], P[i][1], 0));
      const tr = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), matV('--pulse')); g.add(tr);
      update = (k, t) => { dots.forEach((m, i) => m.scale.setScalar(Math.max(0.001, ease(clamp(k * 3 - lv[i], 0, 1))))); seg.material.opacity = 1; const u = (t * 0.35) % 1, seg2 = u < 0.5 ? path[0].clone().lerp(path[1], u * 2) : path[1].clone().lerp(path[2], (u - 0.5) * 2); tr.position.copy(seg2); tr.visible = k > 0.9; };
    } else {
      const d20 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5), new THREE.MeshBasicMaterial({ color: c('--vfl-soft'), wireframe: true })); g.add(d20);
      const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3), new THREE.MeshBasicMaterial({ color: c('--glass') })); g.add(inner);
      update = (k, t) => { const e = Math.max(0.001, ease(k)); d20.scale.setScalar(e); inner.scale.setScalar(e); d20.rotation.set(t * 0.5, t * 0.7, 0); inner.rotation.copy(d20.rotation); };
    }
    return { g, update };
  }

  // os nós: quatro ferramentas da Alloha e um projeto fora do expediente
  const nodes = [];
  const up = new THREE.Vector3(0, 1, 0);
  function fan(t0, count, group, spread) {
    const B = curve.getPointAt(t0), T = curve.getTangentAt(t0).normalize();
    const side = new THREE.Vector3().crossVectors(T, up).normalize();
    for (let i = 0; i < count; i++) {
      const off = i - (count - 1) / 2;
      const end = B.clone().addScaledVector(T, 5 + Math.abs(off) * 1.0).addScaledVector(side, off * spread).addScaledVector(up, (i % 2 ? 1 : -1) * 1.3);
      const start = curve.getPointAt(Math.min(1, t0 + 0.004 * i));
      const mid = start.clone().lerp(end, 0.5).addScaledVector(up, i % 2 ? -0.6 : 0.6);
      const bc = new THREE.CatmullRomCurve3([start, mid, end]);
      const bt = new THREE.Mesh(new THREE.TubeGeometry(bc, 48, 0.026, 5, false), new THREE.MeshBasicMaterial({ color: c('--line') }));
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), new THREE.MeshBasicMaterial({ color: c('--glass') }));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.016, 8, 48), new THREE.MeshBasicMaterial({ color: c('--line') }));
      node.position.copy(end); ring.position.copy(end); ring.lookAt(end.clone().add(T));
      const em = emblem(group === 'lab' ? 'dnd' : 'p' + i);
      em.g.position.copy(end).addScaledVector(up, 1.15);
      em.g.scale.setScalar(2.4);
      const gl = glow(c('--vfl'), 0, 0.0); gl.position.copy(end);
      scene.add(bt, node, ring, em.g, gl);
      nodes.push({ group, i, bt, node, ring, bc, on: false, em, gl, k: 0 });
    }
  }
  fan(0.5, 4, 'alloha', 2.2);
  fan(0.78, 1, 'lab', 3.2);
  const lightNode = (n) => {
    if (n.on) return;
    n.on = true;
    n.bt.material.color.copy(c('--vfl'));
    n.node.material.color.copy(c('--pulse'));
    n.ring.material.color.copy(c('--vfl'));
  };

  // pulsos de luz no cabo principal e o pulso que o clique manda pelo ramo
  const pulseMat = new THREE.MeshBasicMaterial({ color: c('--pulse') });
  const pulses = Array.from({ length: 7 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), pulseMat); scene.add(m); return m; });
  const sent = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), pulseMat);
  sent.visible = false; scene.add(sent);
  let send = null;
  addEventListener('fiber:select', (e) => {
    const n = nodes.find((x) => x.group === 'alloha' && x.i === e.detail.index);
    if (!n) return;
    if (!e.detail.fromUser) return;
    send = { n, t: 0 };
  });

  // poeira: o dado em suspensão em volta do cabo
  const dust = new Float32Array(MAX_DUST * 3);
  for (let i = 0; i < MAX_DUST; i++) {
    const p = curve.getPointAt(Math.random()), r = 1.2 + Math.random() * 7, a = Math.random() * Math.PI * 2;
    dust.set([p.x + Math.cos(a) * r, p.y + Math.sin(a) * r * 0.7, p.z + (Math.random() - 0.5) * 4], i * 3);
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  const dot = document.createElement('canvas'); dot.width = dot.height = 32;
  const dx = dot.getContext('2d'); const gr = dx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); dx.fillStyle = gr; dx.fillRect(0, 0, 32, 32);
  scene.add(new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.07, map: new THREE.CanvasTexture(dot), color: c('--mute'), transparent: true, opacity: 0.55, sizeAttenuation: true, depthWrite: false })));

  // pacotes de dado: pequenos blocos que correm pelo cabo, só até onde a luz chegou
  const packets = new THREE.InstancedMesh(new THREE.BoxGeometry(0.045, 0.045, 0.14), new THREE.MeshBasicMaterial({ color: c('--vfl-soft') }), MAX_PACKETS);
  packets.frustumCulled = false;
  const pk = Array.from({ length: MAX_PACKETS }, (_, i) => ({ u: Math.random(), v: 0.012 + Math.random() * 0.03, a: Math.random() * Math.PI * 2, r: 0.12 + Math.random() * 0.16 }));
  scene.add(packets);
  const dummy = new THREE.Object3D();

  function applyTier() {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, TIERS[tier].pr));
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    // em telas largas a cena desloca para a direita, onde o texto não cobre
    if (innerWidth > 900) camera.setViewOffset(innerWidth, innerHeight, -innerWidth * 0.3, 0, innerWidth, innerHeight); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    dg.setDrawRange(0, TIERS[tier].dust);
    packets.count = TIERS[tier].packets;
  }
  applyTier();
  addEventListener('resize', applyTier);

  // o ponto da fibra em que a página está: interpola entre os centros dos capítulos
  function targetS() {
    const y = innerHeight / 2;
    const ms = chapters.map((ch) => { const r = ch.el.getBoundingClientRect(); return r.top + r.height / 2; });
    if (y <= ms[0]) return chapters[0].t;
    for (let i = 0; i < ms.length - 1; i++) {
      if (y <= ms[i + 1]) return chapters[i].t + (chapters[i + 1].t - chapters[i].t) * ((y - ms[i]) / (ms[i + 1] - ms[i]));
    }
    return chapters[ms.length - 1].t;
  }

  // a mão do visitante; até ela chegar, a câmera anda sozinha num caminho lento
  let mx = 0, my = 0, idle = 0;
  addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });

  let s = targetS(), last = performance.now(), acc = 0, frames = 0;
  function frame(now) {
    const dt = clamp((now - last) / 1000 || 0.016, 0.001, 0.05);
    last = now; idle += dt;
    s += (targetS() - s) * (1 - Math.pow(0.002, dt));
    setLit(s + 0.015);

    const p = curve.getPointAt(clamp(s - 0.012, 0, 1)), q = curve.getPointAt(clamp(s + 0.03, 0, 1));
    // a câmera anda ao lado do cabo, nunca dentro dele
    camera.position.set(p.x - 2.1 + Math.sin(idle * 0.35) * 0.18 + mx * 0.5, p.y + 1.0 + Math.cos(idle * 0.27) * 0.1 - my * 0.25, p.z + 1.8);
    camera.lookAt(q.x - 0.7, q.y + 0.8, q.z);

    pulses.forEach((m, k) => {
      const u = (((idle * 0.03 + k / pulses.length) % 1) + 1) % 1;
      m.visible = u <= s + 0.02;
      if (m.visible) m.position.copy(curve.getPointAt(u));
    });
    if (send) {
      send.t += dt / 1.1;
      sent.visible = send.t < 1;
      if (sent.visible) sent.position.copy(send.n.bc.getPointAt(send.t));
      else { lightNode(send.n); send = null; }
    }
    nodes.forEach((n) => {
      if (n.group === 'alloha' && n.i === 0 && s > 0.46) lightNode(n);
      if (n.group === 'lab' && s > 0.74) lightNode(n);
      n.node.scale.setScalar(n.on ? 1 + Math.sin(idle * 2.2 + n.i) * 0.12 : 1);
      // o emblema se monta quando o nó acende e olha para a câmera
      const want = n.on ? 1 : (n.group === 'alloha' && s > 0.46 ? 0.55 : 0);
      n.k += clamp(want - n.k, -dt / 0.8, dt / 1.6);
      n.em.g.visible = n.k > 0.001;
      if (n.em.g.visible) { n.em.g.lookAt(camera.position); n.em.update(n.k, idle); }
      n.gl.scale.setScalar(2.4 * n.k); n.gl.material.opacity = 0.55 * n.k;
    });
    marks.forEach((m) => {
      if (!m.on && s > m.t0) { m.on = true; m.r1.material.color.copy(c('--vfl')); }
      m.halo.scale.setScalar(m.on ? 1.8 + Math.sin(idle * 2 + m.t0 * 20) * 0.2 : 0.001);
      m.halo.material.opacity = m.on ? 0.5 : 0;
    });
    const nP = TIERS[tier].packets;
    for (let i = 0; i < nP; i++) {
      const q = pk[i]; q.u = (q.u + q.v * dt) % 1;
      const vis = q.u <= s;
      const pos = curve.getPointAt(q.u), tan = curve.getTangentAt(q.u);
      dummy.position.set(pos.x + Math.cos(q.a + idle * 0.5) * q.r, pos.y + Math.sin(q.a + idle * 0.5) * q.r, pos.z);
      dummy.lookAt(dummy.position.clone().add(tan));
      dummy.scale.setScalar(vis ? 1 : 0.0001);
      dummy.updateMatrix(); packets.setMatrixAt(i, dummy.matrix);
    }
    packets.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);

    // se os quadros demoram, desce uma linha da tabela de qualidade
    acc += dt; frames++;
    if (frames === 90) {
      if (acc / frames > 0.028 && tier > 0) { tier--; applyTier(); }
      acc = 0; frames = 0;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
