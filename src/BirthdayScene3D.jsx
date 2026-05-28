import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';

/* ─────────────────────────────────────────────────────────
   Rose petal — extruded bezier curve, vertex-curved
───────────────────────────────────────────────────────── */
function makePetal(color, scale = 1) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(-0.12 * scale, 0.10 * scale, -0.18 * scale, 0.28 * scale, 0, 0.38 * scale);
  shape.bezierCurveTo(0.18 * scale, 0.28 * scale, 0.12 * scale, 0.10 * scale, 0, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {
    steps: 1, depth: 0.01 * scale, bevelEnabled: true,
    bevelThickness: 0.005 * scale, bevelSize: 0.006 * scale, bevelSegments: 3,
  });
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const c = (y / (0.38 * scale)) ** 2;
    pos.setZ(i, pos.getZ(i) + c * 0.12 * scale);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshToonMaterial({
    color, side: THREE.DoubleSide,
  }));
}

/* ─────────────────────────────────────────────────────────
   Full rose with stem, leaves and layered petals
───────────────────────────────────────────────────────── */
function makeRose(baseColor) {
  const group = new THREE.Group();
  const dark = new THREE.Color(baseColor).multiplyScalar(0.6);
  const light = new THREE.Color(baseColor).multiplyScalar(1.15);

  // Curved stem
  const stemPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.02, 0.25, 0.01),
    new THREE.Vector3(-0.01, 0.55, -0.01), new THREE.Vector3(0, 0.85, 0),
  ]);
  group.add(new THREE.Mesh(
    new THREE.TubeGeometry(stemPath, 12, 0.025, 8, false),
    new THREE.MeshToonMaterial({ color: 0x2d5a1b, })
  ));

  // Leaves
  for (let l = 0; l < 2; l++) {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.05, 0.06, 0.12, 0.14, 0.06, 0.22);
    s.bezierCurveTo(0, 0.16, -0.04, 0.08, 0, 0);
    const leaf = new THREE.Mesh(
      new THREE.ShapeGeometry(s),
      new THREE.MeshToonMaterial({ color: 0x2d6a1a, side: THREE.DoubleSide, })
    );
    leaf.position.y = 0.35 + l * 0.15;
    leaf.rotation.y = l * Math.PI + Math.PI / 3;
    leaf.rotation.z = -Math.PI / 4;
    group.add(leaf);
  }

  // Sepal
  const sepal = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.12, 8),
    new THREE.MeshToonMaterial({ color: 0x2d5a1b, })
  );
  sepal.position.y = 0.87;
  group.add(sepal);

  // Layered petals
  [
    { count: 5, radius: 0.04, height: 0.93, scale: 0.55, tiltOut: 0.15, color: dark },
    { count: 6, radius: 0.085, height: 0.915, scale: 0.70, tiltOut: 0.40, color: baseColor },
    { count: 7, radius: 0.125, height: 0.895, scale: 0.85, tiltOut: 0.65, color: light },
    { count: 8, radius: 0.16, height: 0.875, scale: 1.0, tiltOut: 0.90, color: light },
  ].forEach(layer => {
    for (let p = 0; p < layer.count; p++) {
      const a = (p / layer.count) * Math.PI * 2;
      const petal = makePetal(layer.color, layer.scale);
      petal.position.set(Math.cos(a) * layer.radius, layer.height, Math.sin(a) * layer.radius);
      petal.rotation.y = a + Math.PI / 2;
      petal.rotation.x = layer.tiltOut;
      group.add(petal);
    }
  });

  // Central rosette
  const rosette = new THREE.Mesh(
    new THREE.ConeGeometry(0.035, 0.065, 8),
    new THREE.MeshToonMaterial({ color: dark, })
  );
  rosette.position.y = 0.965;
  rosette.rotation.x = Math.PI;
  group.add(rosette);

  group.userData.swayOffset = Math.random() * Math.PI * 2;
  return group;
}

/* ─────────────────────────────────────────────────────────
   Realistic moon mesh
───────────────────────────────────────────────────────── */
function makeMoon(scene) {
  const moonGroup = new THREE.Group();

  // Moon sphere
  const moonGeo = new THREE.SphereGeometry(4.5, 32, 32);
  const moonMat = new THREE.MeshToonMaterial({
    color: 0xf5f0e8,
    roughness: 0.9,
    metalness: 0.0,
    emissive: 0xfffcf0,
    emissiveIntensity: 4.0,
  });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonGroup.add(moonMesh);

  // Soft halo glow
  const haloGeo = new THREE.SphereGeometry(5.6, 24, 24);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xd8e8ff,
    transparent: true,
    opacity: 0.07,
    side: THREE.BackSide,
  });
  moonGroup.add(new THREE.Mesh(haloGeo, haloMat));

  // Small craters for realism
  const craterData = [
    { r: 0.4, pos: [1.2, 1.5, 4.0] },
    { r: 0.6, pos: [-2.0, 0.8, 3.8] },
    { r: 0.3, pos: [0.5, -1.8, 4.2] },
    { r: 0.25, pos: [-1.0, 2.5, 3.8] },
    { r: 0.5, pos: [2.2, -0.6, 3.8] },
  ];
  craterData.forEach(({ r, pos }) => {
    const cg = new THREE.SphereGeometry(r, 12, 12);
    const cm = new THREE.MeshBasicMaterial({ color: 0xccc0a0, transparent: true, opacity: 0.35 });
    const c = new THREE.Mesh(cg, cm);
    c.position.set(...pos);
    moonGroup.add(c);
  });

  // Place moon high in the sky (slightly to the side)
  moonGroup.position.set(-18, 35, -45);
  scene.add(moonGroup);

  // Directional light FROM the moon toward the scene
  const moonLight = new THREE.DirectionalLight(0xd0ddff, 2.5);
  moonLight.position.copy(moonGroup.position);
  moonLight.target.position.set(0, 0, 0);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(2048, 2048);
  moonLight.shadow.camera.near = 1;
  moonLight.shadow.camera.far = 120;
  moonLight.shadow.camera.left = -60;
  moonLight.shadow.camera.right = 60;
  moonLight.shadow.camera.top = 60;
  moonLight.shadow.camera.bottom = -60;
  moonLight.shadow.bias = -0.0005;
  scene.add(moonLight);
  scene.add(moonLight.target);

  // Soft ambient moonlight haze
  const moonAmbient = new THREE.HemisphereLight(0x5588ff, 0x01081a, 2.0);
  scene.add(moonAmbient);
  const fillLight = new THREE.DirectionalLight(0x1a5599, 1.5);
  fillLight.position.set(20, 10, 20);
  scene.add(fillLight);

  return { moonGroup, moonLight };
}

/* ─────────────────────────────────────────────────────────
   Birthday cake
───────────────────────────────────────────────────────── */
function makeCake() {
  const cakeGroup = new THREE.Group();
  const frostingWhite = new THREE.MeshToonMaterial({ color: 0xfdf8f0, });

  const tiers = [
    { r: 1.5, h: 0.85, y: 0, col: 0xf9a8d4 },
    { r: 1.1, h: 0.80, y: 0.85, col: 0xd8b4fe },
    { r: 0.72, h: 0.75, y: 1.65, col: 0xfde68a },
  ];

  tiers.forEach((t, ti) => {
    const mat = new THREE.MeshToonMaterial({ color: t.col, });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(t.r, t.r * 1.01, t.h, 64), mat);
    body.position.y = t.y + t.h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    cakeGroup.add(body);

    const topMat = new THREE.MeshToonMaterial({ color: new THREE.Color(t.col).multiplyScalar(1.12), });
    const top = new THREE.Mesh(new THREE.CircleGeometry(t.r, 64), topMat);
    top.rotation.x = -Math.PI / 2;
    top.position.y = t.y + t.h;
    cakeGroup.add(top);

    // Frosting drips
    const dripCount = 16 + ti * 4;
    for (let d = 0; d < dripCount; d++) {
      const a = (d / dripCount) * Math.PI * 2;
      const dripLen = 0.06 + Math.random() * 0.18;
      const drip = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, dripLen, 6, 8), frostingWhite);
      drip.position.set(Math.cos(a) * (t.r - 0.02), t.y + t.h - dripLen / 2 - 0.02, Math.sin(a) * (t.r - 0.02));
      cakeGroup.add(drip);
    }

    // Rosettes + pearls
    for (let r = 0; r < 8 + ti * 2; r++) {
      const a = (r / (8 + ti * 2)) * Math.PI * 2;
      const ros = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 10, 10),
        new THREE.MeshToonMaterial({ color: 0xffffff, })
      );
      ros.position.set(Math.cos(a) * t.r, t.y + t.h * 0.12, Math.sin(a) * t.r);
      ros.scale.set(1, 0.65, 1);
      cakeGroup.add(ros);
    }

    // Sprinkles
    const sprinkleColors = [0xff6b9d, 0x60a5fa, 0xfbbf24, 0x34d399, 0xa855f7, 0xff4757];
    for (let s = 0; s < 40; s++) {
      const a = Math.random() * Math.PI * 2;
      const rr = Math.random() * (t.r - 0.15);
      const sp = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.055, 5),
        new THREE.MeshBasicMaterial({ color: sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)] })
      );
      sp.position.set(Math.cos(a) * rr, t.y + t.h + 0.025, Math.sin(a) * rr);
      sp.rotation.z = (Math.random() - 0.5) * 0.6;
      sp.rotation.x = (Math.random() - 0.5) * 0.6;
      cakeGroup.add(sp);
    }
  });

  // Gold tier plates
  tiers.slice(1).forEach(t => {
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(t.r + 0.04, t.r + 0.04, 0.04, 64),
      new THREE.MeshToonMaterial({ color: 0xffd700, emissive: 0x4a3800 })
    );
    plate.position.y = t.y;
    cakeGroup.add(plate);
  });

  // Candles
  const topY = tiers[2].y + tiers[2].h;
  const candlePositions = [[0, 0], [0.3, 0.22], [-0.3, 0.22], [0.3, -0.22], [-0.3, -0.22]];
  const candleColors = [0xff6ba8, 0xa855f7, 0xfbbf24, 0x34d399, 0x60a5fa];
  const candleData = []; // { flameMesh, flameCore, light, baseY, offset, cx, cz }

  candlePositions.forEach(([cx, cz], i) => {
    const candleGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.45, 16);
    const candle = new THREE.Mesh(candleGeo, new THREE.MeshToonMaterial({ color: candleColors[i], }));
    candle.position.set(cx, topY + 0.225, cz);
    candle.castShadow = true;
    cakeGroup.add(candle);

    // Wax top
    const wax = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshToonMaterial({ color: new THREE.Color(candleColors[i]).multiplyScalar(1.3), })
    );
    wax.position.set(cx, topY + 0.445, cz);
    cakeGroup.add(wax);

    // Wick
    const wickPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(cx, topY + 0.45, cz),
      new THREE.Vector3(cx + 0.005, topY + 0.48, cz),
      new THREE.Vector3(cx + 0.008, topY + 0.51, cz),
    ]);
    cakeGroup.add(new THREE.Mesh(
      new THREE.TubeGeometry(wickPath, 4, 0.006, 4, false),
      new THREE.MeshBasicMaterial({ color: 0x1a0a00 })
    ));

    // Flame teardrop
    const flameGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const fp = flameGeo.attributes.position;
    for (let v = 0; v < fp.count; v++) {
      const y = fp.getY(v);
      fp.setY(v, y * (y > 0 ? 2.2 : 0.6));
    }
    flameGeo.computeVertexNormals();
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xff9500, transparent: true, opacity: 1 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(cx, topY + 0.545, cz);
    cakeGroup.add(flame);

    // Inner white core
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true, opacity: 1 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), coreMat);
    core.position.set(cx, topY + 0.52, cz);
    cakeGroup.add(core);

    // Candle point light
    const cl = new THREE.PointLight(0xff8822, 1.8, 5);
    cl.position.set(cx, topY + 0.55, cz);
    cakeGroup.add(cl);

    candleData.push({
      flameMesh: flame, flameMat, flameCore: core, coreMat, light: cl,
      baseY: topY + 0.545, offset: i * 1.1, cx, cz, lit: true,
    });
  });

  // Central star topper
  const starShape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 0.18 : 0.085;
    if (i === 0) starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  starShape.closePath();
  const starGroup = new THREE.Group();
  const star = new THREE.Mesh(
    new THREE.ExtrudeGeometry(starShape, { depth: 0.025, bevelEnabled: false }),
    new THREE.MeshToonMaterial({ color: 0xffd700, emissive: 0x554400 })
  );
  star.position.set(0, topY + 0.22, 0);
  star.rotation.x = -Math.PI / 2;
  starGroup.add(star);
  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8),
    new THREE.MeshToonMaterial({ color: 0xffd700 })
  );
  stick.position.set(0, topY + 0.11, 0);
  starGroup.add(stick);
  cakeGroup.add(starGroup);

  // Base board
  const baseBoard = new THREE.Mesh(
    new THREE.CylinderGeometry(1.75, 1.75, 0.06, 64),
    new THREE.MeshToonMaterial({ color: 0xfff8e1, })
  );
  baseBoard.position.set(0, -0.03, 0);
  cakeGroup.add(baseBoard);
  const goldRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.75, 0.04, 8, 64),
    new THREE.MeshToonMaterial({ color: 0xffd700, })
  );
  goldRim.rotation.x = Math.PI / 2;
  cakeGroup.add(goldRim);

  cakeGroup.scale.setScalar(0);
  return { cakeGroup, candleData, starGroup };
}

/* ─────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────── */
export default function BirthdayScene3D({ onBack }) {
  const mountRef = useRef(null);
  const [phase, setPhase] = useState('flying'); // flying | arrived | blown | wish
  const [wishText, setWishText] = useState('');
  const [wishSent, setWishSent] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  // Refs so the animation loop can read the latest values without re-mounting
  const blowRef = useRef(false);
  const candleDataRef = useRef(null);

  const blowCandles = useCallback(() => {
    if (blowRef.current) return;
    blowRef.current = true;
    setPhase('blown');
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    el.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b162c, 0.015);
    scene.background = new THREE.Color(0x06112a);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 300);
    camera.position.set(0, 9, 40);

    /* ── Base ambient (very dim, moon does the real work) ── */
    scene.add(new THREE.AmbientLight(0x1a2542, 2.0));

    /* ── Moon ── */
    const { moonGroup } = makeMoon(scene);

    /* ── Stars ── */
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      sPos[i * 3] = (Math.random() - 0.5) * 220;
      sPos[i * 3 + 1] = Math.random() * 100 + 5;
      sPos[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, sizeAttenuation: true });
    scene.add(new THREE.Points(sGeo, sMat));

    /* ── Terrain ── */
    const tGeo = new THREE.PlaneGeometry(130, 130, 100, 100);
    tGeo.rotateX(-Math.PI / 2);
    const tPos = tGeo.attributes.position;
    for (let i = 0; i < tPos.count; i++) {
      const x = tPos.getX(i), z = tPos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      tPos.setY(i, Math.exp(-dist * dist / 130) * 8
        + Math.sin(x * 0.16) * 0.9 + Math.cos(z * 0.20) * 0.7
        + Math.sin(x * 0.35 + z * 0.28) * 0.35 - 3.8);
    }
    tGeo.computeVertexNormals();
    const terrain = new THREE.Mesh(tGeo,
      new THREE.MeshToonMaterial({ color: 0x081b22 })
    );
    terrain.receiveShadow = true;
    scene.add(terrain);

    const sampleY = (x, z) => {
      const dist = Math.sqrt(x * x + z * z);
      return Math.exp(-dist * dist / 130) * 8
        + Math.sin(x * 0.16) * 0.9 + Math.cos(z * 0.20) * 0.7
        + Math.sin(x * 0.35 + z * 0.28) * 0.35 - 3.8;
    };

    /* ── Roses ── */
    const roseColors = [0xcc1155, 0x990033, 0xe83377, 0xdd2266, 0xaa0044, 0xff3377];
    const roses = [];
    for (let i = 0; i < 230; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 26;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (Math.abs(x) < 1.6 && Math.abs(z) < 1.6) continue;
      const rose = makeRose(roseColors[Math.floor(Math.random() * roseColors.length)]);
      rose.position.set(x, sampleY(x, z), z);
      rose.rotation.y = Math.random() * Math.PI * 2;
      rose.scale.setScalar(0.5 + Math.random() * 0.45);
      scene.add(rose);
      roses.push(rose);
    }

    /* ── Fireflies ── */
    const ffCount = 70;
    const ffGeo = new THREE.BufferGeometry();
    const ffPos2 = new Float32Array(ffCount * 3);
    const ffData = [];
    for (let i = 0; i < ffCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = 3 + Math.random() * 20;
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      const y = sampleY(x, z) + 0.3 + Math.random() * 1.5;
      ffPos2[i * 3] = x; ffPos2[i * 3 + 1] = y; ffPos2[i * 3 + 2] = z;
      ffData.push({ bx: x, by: y, bz: z, o: Math.random() * Math.PI * 2 });
    }
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos2, 3));
    const ffMat = new THREE.PointsMaterial({ color: 0x88ffbb, size: 0.13, sizeAttenuation: true, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(ffGeo, ffMat));

    /* ── Cake ── */
    const hillY = sampleY(0, 0);
    const { cakeGroup, candleData, starGroup } = makeCake();
    candleDataRef.current = candleData;
    cakeGroup.position.set(0, hillY + 0.15, 0);
    scene.add(cakeGroup);

    /* ── Camera path ── */
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 9, 40),
      new THREE.Vector3(0, 7.5, 28),
      new THREE.Vector3(0, 6.2, 16),
      new THREE.Vector3(0, 5.5, 8),
      new THREE.Vector3(0, hillY + 5.5, 3.5),
    ]);

    /* ── State ── */
    const clock = new THREE.Clock();
    let elapsed = 0;
    const FLIGHT = 6.0;
    let flightDone = false;
    let cakeScale = 0;
    // candle blow-out progress per candle
    const blowProgress = [0, 0, 0, 0, 0];

    /* ── Resize ── */
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    /* ── Animation loop ── */
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      const time = clock.elapsedTime;

      /* Camera flight */
      const t = Math.min(elapsed / FLIGHT, 1);
      const tE = 1 - Math.pow(1 - t, 3);
      camera.position.copy(curve.getPoint(tE));
      camera.lookAt(0, hillY + 2.5, 0);

      /* Cake scale-in */
      if (t >= 1 && !flightDone) flightDone = true;
      if (flightDone && cakeScale < 1) {
        cakeScale = Math.min(cakeScale + dt * 0.9, 1);
        const s = cakeScale < 0.5 ? 4 * cakeScale ** 3 : 1 - (-2 * cakeScale + 2) ** 3 / 2;
        cakeGroup.scale.setScalar(s);
        if (cakeScale >= 1) setPhase('arrived');
      }

      /* Roses sway */
      roses.forEach(r => {
        r.rotation.z = Math.sin(time * 0.7 + r.userData.swayOffset) * 0.055;
        r.rotation.x = Math.cos(time * 0.5 + r.userData.swayOffset) * 0.035;
      });

      /* Star spin */
      starGroup.rotation.y = time * 0.4;

      /* Moon slow drift */
      moonGroup.rotation.y = time * 0.01;

      /* Fireflies drift */
      const ffp = ffGeo.attributes.position;
      ffData.forEach((d, i) => {
        ffp.setX(i, d.bx + Math.sin(time * 0.6 + d.o) * 0.55);
        ffp.setY(i, d.by + Math.sin(time * 0.9 + d.o * 1.3) * 0.45);
        ffp.setZ(i, d.bz + Math.cos(time * 0.5 + d.o) * 0.45);
      });
      ffp.needsUpdate = true;
      ffMat.opacity = 0.4 + Math.sin(time * 0.8) * 0.35;

      /* Candle logic */
      const blowing = blowRef.current;
      candleData.forEach((c, i) => {
        if (!c.lit) return;

        if (blowing) {
          // blow out staggered
          blowProgress[i] = Math.min(blowProgress[i] + dt * (0.6 + i * 0.15), 1);
          const p = blowProgress[i];
          const opacity = Math.max(0, 1 - p);
          c.flameMat.opacity = opacity;
          c.coreMat.opacity = opacity;
          c.light.intensity = (1 - p) * 1.8;
          const wobble = opacity > 0.1 ? (1 + Math.sin(time * 25 + i) * 0.4) : 1;
          c.flameMesh.scale.set(wobble * 0.8, wobble * (1.5 - p), wobble * 0.8);

          if (p >= 1) {
            c.lit = false;
            c.flameMesh.visible = false;
            c.flameCore.visible = false;
            c.light.intensity = 0;
            // When ALL candles blown
            if (candleData.every(cc => !cc.lit)) {
              setPhase('wish');
            }
          }
        } else {
          // Normal flicker
          const wobbleY = Math.sin(time * 9 + c.offset) * 0.018;
          const wobbleX = Math.cos(time * 7 + c.offset) * 0.008;
          c.flameMesh.position.y = c.baseY + wobbleY;
          c.flameMesh.position.x = c.cx + wobbleX;
          const s = 0.85 + Math.sin(time * 12 + c.offset) * 0.18;
          c.flameMesh.scale.set(s * 0.8, s, s * 0.8);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  const font = "'Quicksand', sans-serif";

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-72 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(5,15,40,0.92) 0%, transparent 100%)' }} />

      {/* Shooting star animation styles */}
      <style>{`
        @keyframes shootingStar {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          70% { transform: translate(300px, -500px) scale(0.5); opacity: 0.8; }
          100% { transform: translate(500px, -900px) scale(0); opacity: 0; }
        }
        @keyframes starTrail {
          0% { width: 4px; opacity: 0.9; }
          100% { width: 180px; opacity: 0; }
        }
        .shooting-star-anim {
          animation: shootingStar 2s ease-in forwards;
        }
        .star-trail {
          animation: starTrail 1.5s ease-out forwards;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* ── Flying hint ── */}
      <AnimatePresence>
        {phase === 'flying' && (
          <motion.div key="flying"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end justify-center pb-10 pointer-events-none">
            <motion.p
              className="text-white/35 text-xs font-semibold tracking-[0.4em]"
              style={{ fontFamily: font }}
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}>
              VOLANDO HACIA TI...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Arrived: birthday message + blow button ── */}
      <AnimatePresence>
        {phase === 'arrived' && (
          <motion.div key="arrived"
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4 pointer-events-none">
            <div className="relative z-10 text-center pointer-events-auto max-w-2xl">
              <motion.h1 className="text-5xl md:text-7xl font-extrabold mb-3"
                style={{
                  fontFamily: font,
                  background: 'linear-gradient(135deg,#fde68a,#f472b6,#c084fc)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}
                animate={{ filter: ['drop-shadow(0 0 20px #c084fc)', 'drop-shadow(0 0 50px #f472b6)', 'drop-shadow(0 0 20px #c084fc)'] }}
                transition={{ duration: 3, repeat: Infinity }}>
                ¡Feliz Cumpleaños!
              </motion.h1>

              <motion.p className="text-white/85 text-lg md:text-xl font-semibold leading-relaxed mb-5"
                style={{ fontFamily: font }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                Espero que este día sea tan brillante y especial<br />como tú lo eres cada día.
              </motion.p>

              {/* Blow candles button */}
              <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, type: 'spring', bounce: 0.5 }}>
                <motion.button
                  onClick={blowCandles}
                  className="px-8 py-4 rounded-full text-lg font-extrabold text-white shadow-2xl border border-white/20 tracking-wide"
                  style={{
                    fontFamily: font,
                    background: 'linear-gradient(135deg,#7c3aed,#db2777,#f59e0b)',
                    boxShadow: '0 0 30px rgba(219,39,119,0.5)',
                  }}
                  whileHover={{ scale: 1.07, boxShadow: '0 0 50px rgba(219,39,119,0.8)' }}
                  whileTap={{ scale: 0.93 }}
                  animate={{ boxShadow: ['0 0 20px rgba(219,39,119,0.4)', '0 0 45px rgba(219,39,119,0.8)', '0 0 20px rgba(219,39,119,0.4)'] }}
                  transition={{ duration: 2, repeat: Infinity }}>
                  Apagar las velas y pedir un deseo
                </motion.button>
              </motion.div>

              <motion.button onClick={onBack} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
                className="mt-5 px-5 py-1.5 border border-white/20 text-white/45 rounded-full text-sm hover:text-white hover:border-white/50 transition-all backdrop-blur-sm"
                style={{ fontFamily: font }}>
                ← Volver al libro
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Blown: candles going out ── */}
      <AnimatePresence>
        {phase === 'blown' && (
          <motion.div key="blown"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
            <motion.p className="text-white/60 text-sm tracking-[0.3em] font-semibold"
              style={{ fontFamily: font }}
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
              SOPLANDO...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Wish modal ── */}
      <AnimatePresence>
        {phase === 'wish' && (
          <motion.div key="wish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center px-4"
            style={{ background: 'rgba(2,0,12,0.75)', backdropFilter: 'blur(6px)' }}>

            {/* Shooting star animation */}
            {showStar && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
                <div className="shooting-star-anim" style={{
                  position: 'absolute', left: '50%', top: '50%',
                  marginLeft: '-10px', marginTop: '-10px',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'radial-gradient(circle, #fffbe6 0%, #fbbf24 40%, #c084fc 100%)',
                    boxShadow: '0 0 30px 10px rgba(251,191,36,0.7), 0 0 60px 20px rgba(192,132,252,0.4)',
                  }} />
                  <div className="star-trail" style={{
                    position: 'absolute', top: 8, right: 20, height: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(to left, rgba(251,191,36,0.8), rgba(192,132,252,0.3), transparent)',
                  }} />
                </div>
                {/* Sparkle particles */}
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    left: `${45 + i * 3}%`, top: `${50 - i * 4}%`,
                    width: 4, height: 4, borderRadius: '50%',
                    background: i % 2 === 0 ? '#fbbf24' : '#c084fc',
                    animation: `sparkle ${0.5 + i * 0.15}s ease-in-out ${i * 0.1}s forwards`,
                  }} />
                ))}
              </div>
            )}

            {!wishSent ? (
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 90, damping: 15 }}
                className="relative max-w-lg w-full text-center rounded-3xl border border-white/15 p-8 md:p-12"
                style={{ background: 'linear-gradient(145deg,rgba(30,10,60,0.95),rgba(60,10,40,0.95))', boxShadow: '0 0 80px rgba(168,85,247,0.3), inset 0 0 40px rgba(255,255,255,0.03)' }}>

                {/* Stars floating inside */}
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} className="absolute pointer-events-none text-yellow-300 text-xs select-none"
                    style={{ left: `${10 + i * 11}%`, top: `${8 + (i % 3) * 25}%` }}
                    animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.25 }}>
                    ✦
                  </motion.div>
                ))}

                <h2 className="text-3xl md:text-4xl font-extrabold mb-2"
                  style={{
                    fontFamily: font,
                    background: 'linear-gradient(135deg,#fde68a,#c084fc)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                  ¡Pide tu deseo!
                </h2>
                <p className="text-white/60 text-sm mb-6" style={{ fontFamily: font }}>
                  Las velas se apagaron... el universo está escuchando
                </p>

                <textarea
                  value={wishText}
                  onChange={e => setWishText(e.target.value)}
                  placeholder="Escribe tu deseo aquí..."
                  rows={3}
                  className="w-full rounded-2xl px-4 py-3 text-white/90 text-base resize-none outline-none border border-white/15 focus:border-purple-400 transition-colors"
                  style={{
                    fontFamily: font,
                    background: 'rgba(255,255,255,0.06)',
                    caretColor: '#c084fc',
                  }}
                />

                <div className="flex gap-3 mt-5 justify-center flex-wrap">
                  <motion.button
                    onClick={async () => {
                      try {
                        await supabase.from('wishes').insert([{ wish: wishText.trim(), created_at: new Date().toISOString() }]);
                      } catch (e) { console.error('Supabase error:', e); }
                      setShowStar(true);
                      setWishSent(true);
                      setTimeout(() => {
                        setShowStar(false);
                        setShowFinal(true);
                      }, 2200);
                    }}
                    disabled={!wishText.trim()}
                    className="px-8 py-3 rounded-full font-extrabold text-white text-base disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: font,
                      background: wishText.trim() ? 'linear-gradient(135deg,#7c3aed,#db2777)' : '#333',
                      boxShadow: wishText.trim() ? '0 0 25px rgba(168,85,247,0.6)' : 'none',
                    }}
                    whileHover={wishText.trim() ? { scale: 1.05 } : {}}
                    whileTap={wishText.trim() ? { scale: 0.95 } : {}}>
                    Enviar al universo
                  </motion.button>

                </div>
              </motion.div>
            ) : showFinal ? (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 14 }}
                className="text-center max-w-md px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-3"
                  style={{
                    fontFamily: font,
                    background: 'linear-gradient(135deg,#fde68a,#f472b6,#c084fc)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                  ¡Deseo enviado!
                </h2>
                <p className="text-white/70 text-lg leading-relaxed mb-2" style={{ fontFamily: font }}>
                  El universo recibió tu deseo.<br />Que se haga realidad muy pronto.
                </p>
                <p className="text-purple-300/80 text-base italic mb-8" style={{ fontFamily: font }}>
                  "{wishText}"
                </p>
                <div className="text-3xl md:text-4xl font-extrabold tracking-widest"
                  style={{ fontFamily: font, color: '#fbbf24', textShadow: '0 0 25px rgba(251,191,36,0.7)' }}>
                  I Purple You
                </div>
                <button onClick={onBack}
                  className="mt-8 px-6 py-2 border border-white/20 text-white/50 rounded-full text-sm hover:text-white hover:border-white/50 transition-all"
                  style={{ fontFamily: font }}>
                  ← Volver al libro
                </button>
              </motion.div>
            ) : (
              /* While shooting star plays, show nothing or a subtle text */
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 2 }}
                className="text-white/40 text-sm tracking-[0.3em] font-semibold"
                style={{ fontFamily: font }}>
                Tu deseo viaja a las estrellas...
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
