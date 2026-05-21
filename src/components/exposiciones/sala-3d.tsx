import { component$, useSignal, useVisibleTask$, useComputed$, $ } from "@builder.io/qwik";
import { LuX, LuInfo, LuSparkles, LuMousePointer, LuChevronLeft, LuChevronRight } from "@qwikest/icons/lucide";

interface Obra {
  id: string;
  exposicion_id: string;
  titulo_obra: string | null;
  descripcion_obra: string | null;
  image_url: string;
}

interface Sala3DProps {
  obras: Obra[];
  onClose$: () => void;
  nombreArtista: string;
}

export default component$<Sala3DProps>(({ obras, onClose$, nombreArtista }) => {
  const canvasRef = useSignal<HTMLCanvasElement>();
  const loadedCount = useSignal<number>(0);
  const isLoaded = useSignal<boolean>(false);
  const selectedObra = useSignal<Obra | null>(null);
  const hasWebGL = useSignal<boolean | null>(null);

  // CSS 3D Room looking signals (GTA/First-person style camera angles)
  const lon = useSignal<number>(0); // Left/Right camera angle
  const lat = useSignal<number>(0); // Up/Down camera angle
  const isDragging = useSignal<boolean>(false);

  // Drag-to-look coordinates state (for CSS 3D room)
  const startX = useSignal<number>(0);
  const startY = useSignal<number>(0);
  const startLon = useSignal<number>(0);
  const startLat = useSignal<number>(0);

  // Divide paintings into 4 wall groups (North, East, South, West)
  const wallGroups = useComputed$(() => {
    const groups: Obra[][] = [[], [], [], []];
    obras.forEach((obra, idx) => {
      groups[idx % 4].push(obra);
    });
    return groups;
  });

  // Handle pointer down (drag-to-look camera start)
  const onCSSPointerDown = $((e: PointerEvent) => {
    isDragging.value = true;
    startX.value = e.clientX;
    startY.value = e.clientY;
    startLon.value = lon.value;
    startLat.value = lat.value;
  });

  // Handle pointer move (drag-to-look look around camera)
  const onCSSPointerMove = $((e: PointerEvent) => {
    if (!isDragging.value) return;
    const deltaX = e.clientX - startX.value;
    const deltaY = e.clientY - startY.value;

    // Camera look around logic (inverse rotation of the room to simulate head rotation)
    lon.value = startLon.value - deltaX * 0.18;
    lat.value = Math.max(-45, Math.min(45, startLat.value + deltaY * 0.18));
  });

  // Handle pointer up (drag-to-look camera end)
  const onCSSPointerUp = $((e: PointerEvent) => {
    isDragging.value = false;
  });

  // Initialize WebGL Three.js Room (if supported)
  useVisibleTask$(async ({ cleanup }) => {
    const checkWebGLAvailability = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGLAvailability()) {
      console.warn("WebGL not supported or disabled. Launching premium CSS 3D Room Simulation.");
      hasWebGL.value = false;
      isLoaded.value = true;
      if (obras.length > 0) {
        selectedObra.value = obras[0];
      }
      return;
    }

    if (!canvasRef.value) return;

    let THREE;
    try {
      THREE = await import("three");
    } catch (err) {
      console.error("Three.js dynamic import failed:", err);
      hasWebGL.value = false;
      isLoaded.value = true;
      if (obras.length > 0) {
        selectedObra.value = obras[0];
      }
      return;
    }

    const container = canvasRef.value.parentElement;
    if (!container) return;

    let scene: any;
    let camera: any;
    let renderer: any;

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0a0a);
      scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

      camera = new THREE.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 0); // Stand in the exact center of the room

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.value,
        antialias: true,
        alpha: false,
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      hasWebGL.value = true;
    } catch (err) {
      console.error("WebGL context creation exception:", err);
      hasWebGL.value = false;
      isLoaded.value = true;
      if (obras.length > 0) {
        selectedObra.value = obras[0];
      }
      return;
    }

    // Light Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111111, 0.2);
    scene.add(hemiLight);

    // Standard materials for WebGL Room
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeece8,
      roughness: 0.9,
      metalness: 0.05,
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b1d16,
      roughness: 0.35,
      metalness: 0.1,
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.9,
    });

    // Floor Mesh
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling Mesh
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5;
    scene.add(ceiling);

    // 4 Walls
    const wallN = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wallMaterial);
    wallN.position.set(0, 0, -14.9);
    wallN.receiveShadow = true;
    scene.add(wallN);

    const wallS = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wallMaterial);
    wallS.position.set(0, 0, 14.9);
    wallS.rotation.y = Math.PI;
    wallS.receiveShadow = true;
    scene.add(wallS);

    const wallE = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wallMaterial);
    wallE.position.set(14.9, 0, 0);
    wallE.rotation.y = -Math.PI / 2;
    wallE.receiveShadow = true;
    scene.add(wallE);

    const wallW = new THREE.Mesh(new THREE.PlaneGeometry(30, 10), wallMaterial);
    wallW.position.set(-14.9, 0, 0);
    wallW.rotation.y = Math.PI / 2;
    wallW.receiveShadow = true;
    scene.add(wallW);

    const textureLoader = new THREE.TextureLoader();
    const works = obras;
    const numPaintings = works.length;
    const clickableObjects: any[] = [];

    const handleTextureLoaded = (texture: any, obra: Obra, wallIdx: number, spacing: number, j: number) => {
      const img = texture.image;
      const aspectRatio = img.width / img.height;
      const height = 4.2;
      const width = height * aspectRatio;

      const paintingGroup = new THREE.Group();

      const paintingGeometry = new THREE.PlaneGeometry(width, height);
      const paintingMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const paintingMesh = new THREE.Mesh(paintingGeometry, paintingMaterial);
      paintingMesh.userData = { obra };
      paintingGroup.add(paintingMesh);
      clickableObjects.push(paintingMesh);

      // Frame Geometry
      const frameMargin = 0.28;
      const frameThickness = 0.12;
      const frameGeometry = new THREE.BoxGeometry(width + frameMargin, height + frameMargin, frameThickness);
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x1c1a17,
        roughness: 0.7,
        metalness: 0.1,
      });
      const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
      frameMesh.position.set(0, 0, -frameThickness / 2);
      frameMesh.castShadow = true;
      paintingGroup.add(frameMesh);

      // Set spatial coordinates
      const posAlongWall = -15 + spacing * (j + 1);
      let posX = 0, posZ = 0, rotY = 0;

      if (wallIdx === 0) {
        posX = posAlongWall;
        posZ = -14.85;
        rotY = 0;
      } else if (wallIdx === 1) {
        posX = 14.85;
        posZ = posAlongWall;
        rotY = -Math.PI / 2;
      } else if (wallIdx === 2) {
        posX = -posAlongWall;
        posZ = 14.85;
        rotY = Math.PI;
      } else if (wallIdx === 3) {
        posX = -14.85;
        posZ = -posAlongWall;
        rotY = Math.PI / 2;
      }

      paintingGroup.position.set(posX, 0.4, posZ);
      paintingGroup.rotation.y = rotY;
      scene.add(paintingGroup);

      // Spotlights for WebGL
      const spotlight = new THREE.SpotLight(0xfff7e6, 12);
      const lightOffsetDist = 1.8;
      const lightX = posX + (wallIdx === 1 ? -lightOffsetDist : wallIdx === 3 ? lightOffsetDist : 0);
      const lightZ = posZ + (wallIdx === 0 ? lightOffsetDist : wallIdx === 2 ? -lightOffsetDist : 0);
      spotlight.position.set(lightX, 4.2, lightZ);

      const targetObj = new THREE.Object3D();
      targetObj.position.set(posX, 0.4, posZ);
      scene.add(targetObj);
      spotlight.target = targetObj;

      spotlight.angle = Math.PI / 5;
      spotlight.penumbra = 0.7;
      spotlight.decay = 1.8;
      spotlight.distance = 7.5;
      spotlight.castShadow = true;
      spotlight.shadow.mapSize.width = 512;
      spotlight.shadow.mapSize.height = 512;
      scene.add(spotlight);

      const pointLight = new THREE.PointLight(0xfff4d6, 0.4, 4);
      pointLight.position.set(posX, 0.8, posZ + (wallIdx === 0 ? 0.3 : wallIdx === 2 ? -0.3 : 0));
      scene.add(pointLight);

      loadedCount.value++;
      if (loadedCount.value === numPaintings) {
        isLoaded.value = true;
        selectedObra.value = works[0];
      }
    };

    // Distribute WebGL textures
    const wallGrps: Obra[][] = [[], [], [], []];
    works.forEach((obra, idx) => {
      wallGrps[idx % 4].push(obra);
    });

    wallGrps.forEach((group, wallIdx) => {
      const M = group.length;
      const spacing = 30 / (M + 1);
      group.forEach((obra, j) => {
        textureLoader.load(
          obra.image_url,
          (tex) => handleTextureLoaded(tex, obra, wallIdx, spacing, j),
          undefined,
          (err) => {
            console.error("Failed to load texture", err);
            loadedCount.value++;
            if (loadedCount.value === numPaintings) {
              isLoaded.value = true;
            }
          }
        );
      });
    });

    if (numPaintings === 0) {
      isLoaded.value = true;
    }

    // Spherical Drag Coordinates (WebGL)
    let isUserInteracting = false;
    let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
    let webglLon = 0, onPointerDownLon = 0;
    let webglLat = 0, onPointerDownLat = 0;
    let currentLon = 0, currentLat = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = true;
      onPointerDownMouseX = event.clientX;
      onPointerDownMouseY = event.clientY;
      onPointerDownLon = webglLon;
      onPointerDownLat = webglLat;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      if (isUserInteracting === true) {
        const deltaX = event.clientX - onPointerDownMouseX;
        const deltaY = event.clientY - onPointerDownMouseY;
        webglLon = onPointerDownLon - deltaX * 0.16;
        webglLat = onPointerDownLat + deltaY * 0.16;
        webglLat = Math.max(-80, Math.min(80, webglLat));

        // Sync values with CSS 3D state so they stay aligned if fallback triggers
        lon.value = webglLon;
        lat.value = webglLat;
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = false;
    };

    canvasRef.value.addEventListener("pointerdown", onPointerDown);
    canvasRef.value.addEventListener("pointermove", onPointerMove);
    canvasRef.value.addEventListener("pointerup", onPointerUp);

    // Raycast Event (WebGL selection)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onCanvasClick = (event: MouseEvent) => {
      if (!canvasRef.value) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableObjects);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        if (clickedMesh.userData && clickedMesh.userData.obra) {
          selectedObra.value = clickedMesh.userData.obra;
        }
      }
    };

    canvasRef.value.addEventListener("click", onCanvasClick);

    // Resize
    const onResize = () => {
      if (!canvasRef.value || !container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Rendering Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      currentLon += (webglLon - currentLon) * 0.12;
      currentLat += (webglLat - currentLat) * 0.12;

      const phi = THREE.MathUtils.degToRad(90 - currentLat);
      const theta = THREE.MathUtils.degToRad(currentLon);

      const lookTarget = new THREE.Vector3();
      lookTarget.x = Math.sin(phi) * Math.sin(theta);
      lookTarget.y = Math.cos(phi);
      lookTarget.z = Math.sin(phi) * Math.cos(theta);

      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
    };

    animate();

    cleanup(() => {
      if (animationFrameId !== undefined) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      if (canvasRef.value) {
        try {
          canvasRef.value.removeEventListener("pointerdown", onPointerDown);
          canvasRef.value.removeEventListener("pointermove", onPointerMove);
          canvasRef.value.removeEventListener("pointerup", onPointerUp);
          canvasRef.value.removeEventListener("click", onCanvasClick);
        } catch (e) {
          // ignore
        }
      }
      if (scene) scene.clear();
      if (renderer) renderer.dispose();
    });
  });

  return (
    <div class="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white select-none overflow-hidden animate-in fade-in duration-300">
      
      {/* 1. WebGL Room Mode */}
      {hasWebGL.value !== false && (
        <div class="relative flex-1 w-full h-full bg-[#0a0a0a]">
          <canvas
            ref={canvasRef}
            class="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
          />

          {/* Loading Screen Overlay */}
          {!isLoaded.value && (
            <div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-md">
              <div class="h-16 w-16 mb-4 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 animate-spin">
                <LuSparkles class="h-8 w-8 text-amber-400" />
              </div>
              <h4 class="text-xl font-bold tracking-tight text-white mb-2">Montando Sala 3D</h4>
              <p class="text-sm text-neutral-400">
                Colgando obras: {loadedCount.value} de {obras.length}
              </p>
              <div class="w-48 bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-4">
                <div
                  class="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(loadedCount.value / (obras.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Interactive Pointer Look Prompt */}
          {isLoaded.value && (
            <div class="absolute top-5 left-5 z-10 hidden sm:flex items-center gap-2 bg-neutral-900/60 border border-neutral-800/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-neutral-300">
              <LuMousePointer class="h-4.5 w-4.5 text-amber-400 animate-pulse" />
              <span>Arrastra con el mouse para girar 360° la cámara</span>
            </div>
          )}
        </div>
      )}

      {/* 2. Seamless CSS 3D Room Fallback (Full 3D Simulated Room Environment, NO WebGL needed) */}
      {hasWebGL.value === false && (
        <div
          class="flex-1 w-full relative overflow-hidden bg-[#0c0c0c] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          style="perspective: 550px;"
          onPointerDown$={onCSSPointerDown}
          onPointerMove$={onCSSPointerMove}
          onPointerUp$={onCSSPointerUp}
        >
          {/* Compass / FPS Mode Notification */}
          <div class="absolute top-5 left-5 z-30 flex items-center gap-2 bg-neutral-900/80 border border-neutral-800/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-neutral-200">
            <LuMousePointer class="h-4.5 w-4.5 text-amber-400 animate-pulse" />
            <span>Arrastra para girar la cabeza 360° (Modo Sala 3D CSS)</span>
          </div>

          {/* 3D Scene Root */}
          <div
            class="relative w-[1000px] h-[500px] transition-transform duration-75 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${-lat.value}deg) rotateY(${lon.value}deg)`,
            }}
          >
            {/* 3D Room Cube Container */}
            <div class="absolute inset-0" style="transform-style: preserve-3d;">
              
              {/* FLOOR (Wood parquet floor) */}
              <div
                class="absolute w-[1000px] h-[1000px] border border-[#2b1d16]"
                style={{
                  left: "0px",
                  top: "50%",
                  marginTop: "-500px",
                  transform: "translate3d(0, 250px, 0) rotateX(90deg)",
                  background: "radial-gradient(circle, #2b1d16 0%, #170f0b 100%)",
                  boxShadow: "inset 0 0 100px rgba(0,0,0,0.8)",
                }}
              />

              {/* CEILING (Dark ceiling grid) */}
              <div
                class="absolute w-[1000px] h-[1000px] bg-neutral-900 border border-neutral-950"
                style={{
                  left: "0px",
                  top: "50%",
                  marginTop: "-500px",
                  transform: "translate3d(0, -250px, 0) rotateX(-90deg)",
                  background: "radial-gradient(circle, #1a1a1a 0%, #0d0d0d 100%)",
                  boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)",
                }}
              />

              {/* NORTH WALL (Front wall, facing us, z = -500px) */}
              <div
                class="absolute inset-0 bg-[#eeece8] border border-stone-300/40"
                style={{
                  transform: "translate3d(0, 0, -500px)",
                  boxShadow: "inset 0 0 120px rgba(0,0,0,0.18)",
                }}
              >
                {/* Simulated ambient shadow vignette */}
                <div class="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15 pointer-events-none" />
                <div class="absolute bottom-0 inset-x-0 h-4 bg-stone-900 border-t border-stone-800" /> {/* Baseboard */}

                {/* Hang North paintings */}
                {wallGroups.value[0].map((obra, j) => {
                  const M = wallGroups.value[0].length;
                  const spacing = 1000 / (M + 1);
                  const xPos = spacing * (j + 1);
                  return (
                    <div key={obra.id} class="absolute" style={{ left: `${xPos}px`, top: "50%", transform: "translate(-50%, -50%)", transformStyle: "preserve-3d" }}>
                      {/* Spotlight Glow */}
                      <div class="absolute w-56 h-56 rounded-full bg-amber-100/10 blur-xl pointer-events-none -translate-x-1/2 -translate-y-1/2" style="top: -120px; left: 0px;" />
                      {/* Framed Artwork Mesh */}
                      <div
                        onClick$={() => { selectedObra.value = obra; }}
                        class={[
                          "relative rounded-md overflow-hidden border-[8px] border-stone-900 bg-stone-950 p-1.5 shadow-2xl transition-all duration-300 cursor-pointer select-none active:scale-98",
                          selectedObra.value?.id === obra.id ? "border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-[1.03]" : "hover:scale-[1.02] hover:border-stone-800"
                        ]}
                        style="box-shadow: 0 20px 45px rgba(0,0,0,0.85); transform: translate3d(0,0,10px);"
                      >
                        <img src={obra.image_url} alt={obra.titulo_obra || "Obra"} class="max-h-[220px] max-w-[200px] object-contain pointer-events-none select-none" />
                        <div class="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SOUTH WALL (Back wall, behind us, z = 500px, rotated 180 degrees) */}
              <div
                class="absolute inset-0 bg-[#eeece8] border border-stone-300/40"
                style={{
                  transform: "translate3d(0, 0, 500px) rotateY(180deg)",
                  boxShadow: "inset 0 0 120px rgba(0,0,0,0.18)",
                }}
              >
                <div class="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15 pointer-events-none" />
                <div class="absolute bottom-0 inset-x-0 h-4 bg-stone-900 border-t border-stone-800" />

                {/* Hang South paintings */}
                {wallGroups.value[2].map((obra, j) => {
                  const M = wallGroups.value[2].length;
                  const spacing = 1000 / (M + 1);
                  const xPos = spacing * (j + 1);
                  return (
                    <div key={obra.id} class="absolute" style={{ left: `${xPos}px`, top: "50%", transform: "translate(-50%, -50%)", transformStyle: "preserve-3d" }}>
                      <div class="absolute w-56 h-56 rounded-full bg-amber-100/10 blur-xl pointer-events-none -translate-x-1/2 -translate-y-1/2" style="top: -120px; left: 0px;" />
                      <div
                        onClick$={() => { selectedObra.value = obra; }}
                        class={[
                          "relative rounded-md overflow-hidden border-[8px] border-stone-900 bg-stone-950 p-1.5 shadow-2xl transition-all duration-300 cursor-pointer select-none active:scale-98",
                          selectedObra.value?.id === obra.id ? "border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-[1.03]" : "hover:scale-[1.02] hover:border-stone-800"
                        ]}
                        style="box-shadow: 0 20px 45px rgba(0,0,0,0.85); transform: translate3d(0,0,10px);"
                      >
                        <img src={obra.image_url} alt={obra.titulo_obra || "Obra"} class="max-h-[220px] max-w-[200px] object-contain pointer-events-none select-none" />
                        <div class="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EAST WALL (Right wall, x = 500px, rotated -90 degrees) */}
              <div
                class="absolute inset-0 bg-[#eeece8] border border-stone-300/40"
                style={{
                  transform: "translate3d(500px, 0, 0) rotateY(-90deg)",
                  boxShadow: "inset 0 0 120px rgba(0,0,0,0.18)",
                }}
              >
                <div class="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15 pointer-events-none" />
                <div class="absolute bottom-0 inset-x-0 h-4 bg-stone-900 border-t border-stone-800" />

                {/* Hang East paintings */}
                {wallGroups.value[1].map((obra, j) => {
                  const M = wallGroups.value[1].length;
                  const spacing = 1000 / (M + 1);
                  const xPos = spacing * (j + 1);
                  return (
                    <div key={obra.id} class="absolute" style={{ left: `${xPos}px`, top: "50%", transform: "translate(-50%, -50%)", transformStyle: "preserve-3d" }}>
                      <div class="absolute w-56 h-56 rounded-full bg-amber-100/10 blur-xl pointer-events-none -translate-x-1/2 -translate-y-1/2" style="top: -120px; left: 0px;" />
                      <div
                        onClick$={() => { selectedObra.value = obra; }}
                        class={[
                          "relative rounded-md overflow-hidden border-[8px] border-stone-900 bg-stone-950 p-1.5 shadow-2xl transition-all duration-300 cursor-pointer select-none active:scale-98",
                          selectedObra.value?.id === obra.id ? "border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-[1.03]" : "hover:scale-[1.02] hover:border-stone-800"
                        ]}
                        style="box-shadow: 0 20px 45px rgba(0,0,0,0.85); transform: translate3d(0,0,10px);"
                      >
                        <img src={obra.image_url} alt={obra.titulo_obra || "Obra"} class="max-h-[220px] max-w-[200px] object-contain pointer-events-none select-none" />
                        <div class="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WEST WALL (Left wall, x = -500px, rotated 90 degrees) */}
              <div
                class="absolute inset-0 bg-[#eeece8] border border-stone-300/40"
                style={{
                  transform: "translate3d(-500px, 0, 0) rotateY(90deg)",
                  boxShadow: "inset 0 0 120px rgba(0,0,0,0.18)",
                }}
              >
                <div class="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/15 pointer-events-none" />
                <div class="absolute bottom-0 inset-x-0 h-4 bg-stone-900 border-t border-stone-800" />

                {/* Hang West paintings */}
                {wallGroups.value[3].map((obra, j) => {
                  const M = wallGroups.value[3].length;
                  const spacing = 1000 / (M + 1);
                  const xPos = spacing * (j + 1);
                  return (
                    <div key={obra.id} class="absolute" style={{ left: `${xPos}px`, top: "50%", transform: "translate(-50%, -50%)", transformStyle: "preserve-3d" }}>
                      <div class="absolute w-56 h-56 rounded-full bg-amber-100/10 blur-xl pointer-events-none -translate-x-1/2 -translate-y-1/2" style="top: -120px; left: 0px;" />
                      <div
                        onClick$={() => { selectedObra.value = obra; }}
                        class={[
                          "relative rounded-md overflow-hidden border-[8px] border-stone-900 bg-stone-950 p-1.5 shadow-2xl transition-all duration-300 cursor-pointer select-none active:scale-98",
                          selectedObra.value?.id === obra.id ? "border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-[1.03]" : "hover:scale-[1.02] hover:border-stone-800"
                        ]}
                        style="box-shadow: 0 20px 45px rgba(0,0,0,0.85); transform: translate3d(0,0,10px);"
                      >
                        <img src={obra.image_url} alt={obra.titulo_obra || "Obra"} class="max-h-[220px] max-w-[200px] object-contain pointer-events-none select-none" />
                        <div class="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick$={onClose$}
        class="absolute top-5 right-5 z-30 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800/80 backdrop-blur-md hover:scale-105 shadow-xl transition-all duration-300 cursor-pointer"
        title="Salir del Recorrido 3D"
      >
        <LuX class="h-6 w-6" />
      </button>

      {/* Selected Painting Detail Banner Overlay */}
      {isLoaded.value && selectedObra.value && (
        <div class="z-20 bg-linear-to-t from-neutral-950 via-neutral-950/98 to-transparent px-4 sm:px-8 pb-8 pt-10 border-t border-neutral-900/30 flex flex-col items-center animate-in slide-in-from-bottom duration-500">
          <div class="max-w-3xl w-full text-center">
            <span class="text-amber-400 text-[10px] uppercase font-black tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3 inline-block">
              Obra de {nombreArtista}
            </span>
            <h4 class="text-xl sm:text-2xl font-black tracking-tight text-white mb-2 leading-tight">
              {selectedObra.value.titulo_obra || "Sin título"}
            </h4>
            {selectedObra.value.descripcion_obra ? (
              <p class="text-neutral-300 text-sm leading-relaxed max-h-[12vh] overflow-y-auto pr-1">
                {selectedObra.value.descripcion_obra}
              </p>
            ) : (
              <p class="text-neutral-500 text-xs italic">Obra perteneciente a la exposición actual.</p>
            )}
            
            <div class="mt-4 flex items-center justify-center gap-3 text-[10px] text-neutral-500 font-semibold bg-neutral-900/40 border border-neutral-800/40 px-4 py-1.5 rounded-full w-fit mx-auto">
              <LuInfo class="h-3.5 w-3.5 text-amber-400/80" />
              <span>
                {hasWebGL.value === false
                  ? "Arrastra con el mouse para girar 360° la sala y haz clic en un cuadro para ver sus detalles"
                  : "Haz clic en otra pintura en las paredes para ver sus detalles"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
