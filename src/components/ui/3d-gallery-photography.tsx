'use client';

import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type ImageItem = string | { src: string; alt?: string };

// ---------------------------------------------------------------------------
// Shader — cloth bend + blur + hover flag-wave
// ---------------------------------------------------------------------------
const createClothMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      map:         { value: null },
      opacity:     { value: 1.0 },
      blurAmount:  { value: 0.0 },
      scrollForce: { value: 0.0 },
      time:        { value: 0.0 },
      isHovered:   { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        float c = scrollForce * 0.3;
        float d = length(pos.xy);
        pos.z -= d * d * c;
        pos.z -= (sin(pos.x*2.0+scrollForce*3.0)*0.02 + sin(pos.y*2.5+scrollForce*2.0)*0.015) * abs(c) * 2.0;
        if (isHovered > 0.5) {
          float damp = smoothstep(-0.5, 0.5, pos.x);
          pos.z -= sin(pos.x*3.0+time*8.0)*0.1*damp + sin(pos.x*5.0+time*12.0)*0.03*damp;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(map, vUv);
        if (blurAmount > 0.0) {
          vec2 ts = 1.0 / vec2(textureSize(map, 0));
          vec4 b = vec4(0.0); float t = 0.0;
          for (float x=-2.0;x<=2.0;x+=1.0) for (float y=-2.0;y<=2.0;y+=1.0) {
            float w = 1.0/(1.0+length(vec2(x,y)));
            b += texture2D(map, vUv + vec2(x,y)*ts*blurAmount)*w; t+=w;
          }
          color = b/t;
        }
        color.rgb += vec3(abs(scrollForce)*0.005);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });

// ---------------------------------------------------------------------------
// Single image plane mesh
// ---------------------------------------------------------------------------
function ImagePlane({
  texture, position, scale, material,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  material: THREE.ShaderMaterial;
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => { material.uniforms.map.value = texture; }, [material, texture]);
  useEffect(() => { material.uniforms.isHovered.value = hovered ? 1.0 : 0.0; }, [material, hovered]);

  return (
    <mesh
      position={position}
      scale={scale}
      material={material}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1, 24, 24]} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// The actual 3-D scene — camera driven purely by a shared progress ref
// ---------------------------------------------------------------------------
function GalleryScene({
  images,
  progressRef,
  zSpacing = 4,
}: {
  images: { src: string; alt: string }[];
  progressRef: React.MutableRefObject<number>;
  zSpacing?: number;
}) {
  const { camera } = useThree();
  const velRef    = useRef(0);
  const lastRef   = useRef(0);

  const textures  = useTexture(images.map(i => i.src));
  const materials = useMemo(
    () => Array.from({ length: images.length }, () => createClothMaterial()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images.length]
  );

  // Stable scattered positions — computed once
  const planes = useMemo(() =>
    images.map((_, i) => {
      const ha = (i * 2.618033) % (Math.PI * 2);
      const va = (i * 1.618033 + 1.047) % (Math.PI * 2);
      const hr = (i % 3) * 0.9 + 0.3;
      const vr = ((i + 1) % 4) * 0.7 + 0.3;
      return {
        x: Math.sin(ha) * hr * 4,
        y: Math.cos(va) * vr * 3,
        z: -i * zSpacing,
      };
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images.length, zSpacing]
  );

  const startZ = 2;
  const endZ   = -(images.length - 1) * zSpacing - 4;

  useFrame((state, delta) => {
    const progress = progressRef.current;

    // Smooth velocity for cloth effect
    const vel = (progress - lastRef.current) / Math.max(delta, 0.001);
    velRef.current = THREE.MathUtils.lerp(velRef.current, vel * 8, 0.12);
    lastRef.current = progress;

    const time = state.clock.getElapsedTime();
    // Move camera straight along Z from startZ → endZ
    camera.position.z = startZ + (endZ - startZ) * progress;

    planes.forEach((plane, i) => {
      const mat = materials[i];
      if (!mat) return;
      mat.uniforms.time.value        = time;
      mat.uniforms.scrollForce.value = velRef.current;

      const dist = camera.position.z - plane.z;

      // Opacity: fade in 8-12 units away, solid 0.5-8, fade out -2 to 0.5
      let op = 0;
      if      (dist > 12)  op = 0;
      else if (dist > 8)   op = (12 - dist) / 4;
      else if (dist > 0.5) op = 1;
      else if (dist > -2)  op = (dist + 2) / 2.5;
      else                 op = 0;

      // Blur: max at >10, clear at 1.5-6, re-blurs as it passes
      let bl = 0;
      const mb = 3;
      if      (dist > 10)  bl = mb;
      else if (dist > 6)   bl = mb * ((dist - 6) / 4);
      else if (dist > 1.5) bl = 0;
      else if (dist > -1)  bl = mb * (1 - (dist + 1) / 2.5);
      else                 bl = mb;

      mat.uniforms.opacity.value    = Math.max(0, Math.min(1, op));
      mat.uniforms.blurAmount.value = Math.max(0, Math.min(mb, bl));
    });
  });

  return (
    <>
      {planes.map((plane, i) => {
        const tex = textures[i];
        const mat = materials[i];
        if (!tex || !mat) return null;
        const img = tex.image as HTMLImageElement | null;
        const aspect = img?.width && img.height ? img.width / img.height : 1.5;
        const base = 3.5;
        const sc: [number, number, number] =
          aspect > 1 ? [base * aspect, base, 1] : [base, base / aspect, 1];
        return (
          <ImagePlane
            key={i}
            texture={tex}
            position={[plane.x, plane.y, plane.z]}
            scale={sc}
            material={mat}
          />
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Public component — uses its own scroll listener, completely independent
// ---------------------------------------------------------------------------
export default function ScrollGallery3D({
  images,
}: {
  images: (string | { src: string; alt?: string })[];
}) {
  const container   = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [webgl, setWebgl] = useState(true);

  // Normalize to objects once
  const normalized = useMemo(
    () => images.map(img => typeof img === 'string' ? { src: img, alt: '' } : { src: img.src, alt: img.alt ?? '' }),
    [images]
  );

  // WebGL check
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      if (!c.getContext('webgl') && !c.getContext('experimental-webgl')) setWebgl(false);
    } catch { setWebgl(false); }
  }, []);

  // Own scroll handler — reads raw page scroll relative to this container
  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const onScroll = () => {
      const rect   = el.getBoundingClientRect();
      const total  = el.offsetHeight - window.innerHeight;
      // How many px the user has scrolled INTO this section
      const scrolled = Math.max(0, -rect.top);
      progressRef.current = total > 0 ? Math.min(1, scrolled / total) : 0;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initialise
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    // 500vh tall — sticky canvas inside. Native browser scroll drives everything.
    <div ref={container} style={{ position: 'relative', height: '500vh', background: '#000' }}>
      <div style={{ position: 'sticky', top: 0, height: '100dvh', width: '100%', overflow: 'hidden' }}>

        {/* "I create; therefore I am" overlay — mix-blend-exclusion so it shows over images */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', mixBlendMode: 'exclusion',
          }}
        >
          <h2
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              color: '#fff',
              letterSpacing: '0.02em',
              textAlign: 'center',
              padding: '0 1rem',
            }}
          >
            I create; therefore I am
          </h2>
        </div>

        {webgl ? (
          <Canvas
            camera={{ position: [0, 0, 2], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <GalleryScene images={normalized} progressRef={progressRef} zSpacing={4} />
            </Suspense>
          </Canvas>
        ) : (
          // CSS fallback grid if WebGL not available
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 24, overflowY: 'auto', height: '100%' }}>
            {normalized.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={img.src} alt={img.alt} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
