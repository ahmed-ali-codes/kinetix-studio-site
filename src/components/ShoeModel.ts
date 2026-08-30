import * as THREE from 'three';
import { CustomizerState } from '../types';

export interface ShoePartMesh {
  id: string;
  name: string;
  mesh: THREE.Mesh | THREE.Group;
  basePos: THREE.Vector3;
  explodedOffset: THREE.Vector3;
  materialKey: keyof CustomizerState;
}

// Generate carbon fiber procedural texture for upper/accents
function createCarbonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#18181c';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#27272e';
    for (let x = 0; x < 64; x += 8) {
      for (let y = 0; y < 64; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillRect(x, y, 8, 8);
        }
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// Generate tech grip tread texture for outsoles
function createTreadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#111115';
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = '#33333d';
    ctx.lineWidth = 4;
    for (let i = -128; i < 256; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 128, 128);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createShoe3D(config: CustomizerState) {
  const shoeGroup = new THREE.Group();
  const parts: ShoePartMesh[] = [];

  const carbonTex = createCarbonTexture();
  const treadTex = createTreadTexture();

  // Materials Dictionary
  const materials = {
    upper: new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.upperColor),
      roughness: config.finish === 'glossy' ? 0.2 : config.finish === 'carbon' ? 0.4 : 0.6,
      metalness: config.finish === 'metallic' ? 0.7 : 0.1,
      map: config.finish === 'carbon' ? carbonTex : null,
      bumpScale: 0.05,
    }),
    sole: new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.soleColor),
      roughness: 0.5,
      metalness: 0.15,
      bumpMap: treadTex,
      bumpScale: 0.08,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.accentColor),
      roughness: 0.15,
      metalness: 0.9, // Metallic chrome finish matching video
    }),
    strap: new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.strapColor),
      roughness: 0.4,
      metalness: 0.3,
    }),
    laces: new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.lacesColor),
      roughness: 0.8,
      metalness: 0.05,
    }),
    airPodGlow: new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.glowColor),
      emissive: new THREE.Color(config.glowColor),
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.92,
    }),
    innerLining: new THREE.MeshStandardMaterial({
      color: 0x141418,
      roughness: 0.9,
      metalness: 0.0,
    }),
    chromeShield: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    }),
  };

  // --- 1. CHUNKY MIDSOLE & OUTSOLE (Multi-tiered wave blocks matching the video) ---
  const soleGroup = new THREE.Group();

  // Bottom base sole
  const baseSoleShape = new THREE.Shape();
  baseSoleShape.moveTo(-1.6, -0.4);
  baseSoleShape.quadraticCurveTo(-1.8, 0.0, -1.6, 0.45); // Heel
  baseSoleShape.quadraticCurveTo(-0.4, 0.55, 0.8, 0.5); // Mid arch
  baseSoleShape.quadraticCurveTo(1.7, 0.45, 1.9, 0.2); // Forefoot curve
  baseSoleShape.quadraticCurveTo(2.1, 0.0, 1.9, -0.2); // Toe curve
  baseSoleShape.quadraticCurveTo(1.6, -0.45, 0.8, -0.5);
  baseSoleShape.quadraticCurveTo(-0.4, -0.55, -1.6, -0.4);

  const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.08, bevelThickness: 0.08 };
  const baseSoleGeo = new THREE.ExtrudeGeometry(baseSoleShape, extrudeSettings);
  baseSoleGeo.center();
  baseSoleGeo.rotateX(Math.PI / 2);
  const baseSoleMesh = new THREE.Mesh(baseSoleGeo, materials.sole);
  baseSoleMesh.position.set(0, -0.45, 0);
  baseSoleMesh.castShadow = true;
  baseSoleMesh.receiveShadow = true;
  soleGroup.add(baseSoleMesh);

  // Chunky Midsole Pods (Rear chunky heel wave)
  const heelPodGeo = new THREE.CylinderGeometry(0.7, 0.78, 0.45, 16);
  heelPodGeo.scale(1.2, 1, 0.9);
  const heelPod = new THREE.Mesh(heelPodGeo, materials.sole);
  heelPod.position.set(-1.1, -0.3, 0);
  heelPod.castShadow = true;
  soleGroup.add(heelPod);

  // Mid-foot lateral geometric armor chunks (Wave sculpted treads)
  for (let i = -1; i <= 1.2; i += 0.55) {
    const chunkGeo = new THREE.BoxGeometry(0.4, 0.35, 0.95);
    const chunk = new THREE.Mesh(chunkGeo, materials.sole);
    chunk.position.set(i, -0.35, 0);
    chunk.rotation.y = (i * 0.1);
    chunk.rotation.z = -0.05;
    chunk.castShadow = true;
    soleGroup.add(chunk);
  }

  // --- 2. GLOWING CYBER AIR CUSHION CHAMBER (Under the heel) ---
  const airPodGroup = new THREE.Group();
  const airPodGeo = new THREE.CylinderGeometry(0.45, 0.48, 0.22, 16);
  airPodGeo.scale(1.3, 1, 0.7);
  const airPodMesh = new THREE.Mesh(airPodGeo, materials.airPodGlow);
  airPodMesh.position.set(-1.1, -0.28, 0);
  airPodGroup.add(airPodMesh);

  // Glow core rings
  const ringGeo = new THREE.TorusGeometry(0.42, 0.04, 8, 24);
  const ringMesh = new THREE.Mesh(ringGeo, materials.accent);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.set(-1.1, -0.28, 0);
  airPodGroup.add(ringMesh);

  // --- 3. UPPER SHOE BODY (Biomechanical layered armor) ---
  const upperGroup = new THREE.Group();

  // Main foot form (sculpted aerodynamic loft)
  const upperGeo = new THREE.CylinderGeometry(0.45, 0.65, 2.8, 18, 8);
  upperGeo.rotateZ(Math.PI / 2);
  upperGeo.scale(1.15, 0.55, 0.65);
  
  // Warp vertices to create organic dynamic toe-spring and heel cup
  const pos = upperGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Lift toe
    if (x > 0.4) {
      pos.setY(i, y + Math.pow(x - 0.4, 1.6) * 0.35);
      pos.setZ(i, z * (1 - (x - 0.4) * 0.25)); // taper toe width
    }
    // Lift ankle collar
    if (x < -0.2 && y > 0) {
      pos.setY(i, y + Math.abs(x + 0.2) * 0.45);
    }
  }
  upperGeo.computeVertexNormals();

  const upperMesh = new THREE.Mesh(upperGeo, materials.upper);
  upperMesh.position.set(0.1, 0.05, 0);
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  upperGroup.add(upperMesh);

  // Toe Cap Armor Plate (Angular overlay)
  const toeCapGeo = new THREE.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
  toeCapGeo.scale(0.8, 0.45, 0.65);
  toeCapGeo.rotateZ(-0.2);
  const toeCapMesh = new THREE.Mesh(toeCapGeo, materials.strap);
  toeCapMesh.position.set(1.15, 0.05, 0);
  toeCapMesh.castShadow = true;
  upperGroup.add(toeCapMesh);

  // Lateral Layered Wing Overlays (Armor Panels on Sides)
  const wingGroup = new THREE.Group();
  for (const side of [-1, 1]) {
    const wingGeo = new THREE.BoxGeometry(0.9, 0.45, 0.08);
    const wingMesh = new THREE.Mesh(wingGeo, materials.strap);
    wingMesh.position.set(-0.1, 0.1, side * 0.42);
    wingMesh.rotation.y = side * 0.15;
    wingMesh.rotation.z = -0.2;
    wingMesh.castShadow = true;
    wingGroup.add(wingMesh);

    // Decorative ventilation cutouts / tech vents
    const ventGeo = new THREE.BoxGeometry(0.6, 0.06, 0.1);
    const ventMesh = new THREE.Mesh(ventGeo, materials.accent);
    ventMesh.position.set(-0.1, 0.1, side * 0.43);
    ventMesh.rotation.z = -0.2;
    wingGroup.add(ventMesh);
  }

  // --- 4. METALLIC HEEL CHASSIS & "PREMIUM" BADGE (Glossy chrome tiered heel from video) ---
  const heelArmorGroup = new THREE.Group();

  // Tiered chrome horizontal ribs across heel
  for (let r = 0; r < 4; r++) {
    const ribGeo = new THREE.TorusGeometry(0.48 - r * 0.03, 0.035, 12, 24, Math.PI * 0.95);
    const ribMesh = new THREE.Mesh(ribGeo, materials.accent);
    ribMesh.position.set(-1.15 - r * 0.06, -0.05 + r * 0.11, 0);
    ribMesh.rotation.y = Math.PI;
    ribMesh.castShadow = true;
    heelArmorGroup.add(ribMesh);
  }

  // Rear "PREMIUM / KINETIX" Chrome Badge Bar
  const badgeBarGeo = new THREE.BoxGeometry(0.12, 0.22, 0.65);
  const badgeBar = new THREE.Mesh(badgeBarGeo, materials.accent);
  badgeBar.position.set(-1.38, 0.18, 0);
  badgeBar.castShadow = true;
  heelArmorGroup.add(badgeBar);

  // Heel pull tab
  const pullTabGeo = new THREE.TorusGeometry(0.18, 0.04, 8, 16, Math.PI);
  const pullTab = new THREE.Mesh(pullTabGeo, materials.strap);
  pullTab.position.set(-1.1, 0.62, 0);
  pullTab.rotation.x = Math.PI / 2;
  pullTab.rotation.z = -0.3;
  heelArmorGroup.add(pullTab);

  // --- 5. TACTICAL INSTEP STRAP & BUCKLE (Prominent feature on shoe upper) ---
  const strapGroup = new THREE.Group();

  const strapBandGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.25, 18, 1, true, 0, Math.PI);
  strapBandGeo.rotateZ(Math.PI / 2);
  strapBandGeo.rotateX(Math.PI / 2);
  const strapBand = new THREE.Mesh(strapBandGeo, materials.strap);
  strapBand.position.set(0.05, 0.32, 0);
  strapBand.scale.set(0.9, 0.85, 0.95);
  strapBand.castShadow = true;
  strapGroup.add(strapBand);

  // Tactical Buckle Lock on Top
  const buckleGeo = new THREE.BoxGeometry(0.24, 0.08, 0.5);
  const buckle = new THREE.Mesh(buckleGeo, materials.accent);
  buckle.position.set(0.05, 0.44, 0);
  buckle.castShadow = true;
  strapGroup.add(buckle);

  // --- 6. LACES & TONGUE ASSEMBLY ---
  const lacesGroup = new THREE.Group();

  // Padded Tongue
  const tongueGeo = new THREE.BoxGeometry(0.7, 0.08, 0.38);
  const tongue = new THREE.Mesh(tongueGeo, materials.innerLining);
  tongue.position.set(0.4, 0.36, 0);
  tongue.rotation.z = -0.45;
  lacesGroup.add(tongue);

  // Criss-cross tubular laces
  for (let l = 0; l < 4; l++) {
    const xPos = 0.2 + l * 0.22;
    const yPos = 0.28 - l * 0.04;
    const laceGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.48, 8);
    laceGeo.rotateX(Math.PI / 2);
    const laceMesh = new THREE.Mesh(laceGeo, materials.laces);
    laceMesh.position.set(xPos, yPos, 0);
    laceMesh.rotation.y = (l % 2 === 0 ? 0.15 : -0.15);
    laceMesh.castShadow = true;
    lacesGroup.add(laceMesh);
  }

  // --- 7. ANKLE COLLAR & INNER LINING ---
  const collarGeo = new THREE.TorusGeometry(0.38, 0.08, 12, 24);
  collarGeo.scale(1.2, 0.9, 0.9);
  const collar = new THREE.Mesh(collarGeo, materials.innerLining);
  collar.position.set(-0.65, 0.42, 0);
  collar.rotation.x = Math.PI / 2;
  collar.rotation.y = -0.25;
  upperGroup.add(collar);

  // Add all groups to main shoe group
  shoeGroup.add(soleGroup);
  shoeGroup.add(airPodGroup);
  shoeGroup.add(upperGroup);
  shoeGroup.add(wingGroup);
  shoeGroup.add(heelArmorGroup);
  shoeGroup.add(strapGroup);
  shoeGroup.add(lacesGroup);

  // Map parts for exploded view and customization
  parts.push(
    {
      id: 'sole',
      name: 'Kinetic Surge Outsole',
      mesh: soleGroup,
      basePos: soleGroup.position.clone(),
      explodedOffset: new THREE.Vector3(0, -0.9, 0),
      materialKey: 'soleColor',
    },
    {
      id: 'airpod',
      name: 'Bionic LED Air Core',
      mesh: airPodGroup,
      basePos: airPodGroup.position.clone(),
      explodedOffset: new THREE.Vector3(-0.4, -0.4, 0),
      materialKey: 'glowColor',
    },
    {
      id: 'upper',
      name: 'Aero-Armor Upper Weave',
      mesh: upperGroup,
      basePos: upperGroup.position.clone(),
      explodedOffset: new THREE.Vector3(0, 0.35, 0),
      materialKey: 'upperColor',
    },
    {
      id: 'heel',
      name: 'Titanium Heel Counter',
      mesh: heelArmorGroup,
      basePos: heelArmorGroup.position.clone(),
      explodedOffset: new THREE.Vector3(-0.95, 0.25, 0),
      materialKey: 'accentColor',
    },
    {
      id: 'strap',
      name: 'Mag-Lock Tactical Strap',
      mesh: strapGroup,
      basePos: strapGroup.position.clone(),
      explodedOffset: new THREE.Vector3(0.3, 0.85, 0),
      materialKey: 'strapColor',
    },
    {
      id: 'laces',
      name: 'Hyper-Knit Speed Laces',
      mesh: lacesGroup,
      basePos: lacesGroup.position.clone(),
      explodedOffset: new THREE.Vector3(0.6, 0.7, 0),
      materialKey: 'lacesColor',
    }
  );

  return {
    shoeGroup,
    parts,
    materials,
    updateMaterials: (newConfig: CustomizerState) => {
      materials.upper.color.set(newConfig.upperColor);
      materials.upper.roughness = newConfig.finish === 'glossy' ? 0.2 : newConfig.finish === 'carbon' ? 0.4 : 0.6;
      materials.upper.metalness = newConfig.finish === 'metallic' ? 0.7 : 0.1;
      materials.upper.map = newConfig.finish === 'carbon' ? carbonTex : null;
      materials.upper.needsUpdate = true;

      materials.sole.color.set(newConfig.soleColor);
      materials.accent.color.set(newConfig.accentColor);
      materials.strap.color.set(newConfig.strapColor);
      materials.laces.color.set(newConfig.lacesColor);
      materials.airPodGlow.color.set(newConfig.glowColor);
      materials.airPodGlow.emissive.set(newConfig.glowColor);
    },
  };
}
