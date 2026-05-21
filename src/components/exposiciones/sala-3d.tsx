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

  // Computed signal for selected painting index in fallback carousel
  const currentIndex = useComputed$(() => {
    if (!selectedObra.value) return 0;
    const idx = obras.findIndex((o) => o.id === selectedObra.value?.id);
    return idx >= 0 ? idx : 0;
  });

  // Initialize 3D scene inside the visible task (client-side only)
  useVisibleTask$(async ({ cleanup }) => {
    // 1. WebGL Availability Pre-check
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
      console.warn("WebGL not supported or disabled in this browser. Activating premium CSS 3D fallback mode.");
      hasWebGL.value = false;
      isLoaded.value = true;
      if (obras.length > 0) {
        selectedObra.value = obras[0];
      }
      return;
    }

    if (!canvasRef.value) return;

    // 2. Load Three.js dynamically
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

    // 3. Scene & Camera & WebGL Renderer with graceful error handling
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
      camera.position.set(0, 0, 0); // Center of the room

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
      console.error("WebGL context creation caught exception:", err);
      hasWebGL.value = false;
      isLoaded.value = true;
      if (obras.length > 0) {
        selectedObra.value = obras[0];
      }
      return;
    }

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111111, 0.2);
    scene.add(hemiLight);

    // 5. Room Geometry (Floor, Ceiling, Walls)
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeece8, // Warm off-white
      roughness: 0.9,
      metalness: 0.05,
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b1d16, // Dark oak
      roughness: 0.35,
      metalness: 0.1,
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.9,
    });

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5;
    scene.add(ceiling);

    // Walls
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

    // 6. Painting Distribution & Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const works = obras;
    const numPaintings = works.length;

    const wallGroups: Obra[][] = [[], [], [], []];
    works.forEach((obra, idx) => {
      wallGroups[idx % 4].push(obra);
    });

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

      // Museum spotlight above
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

    wallGroups.forEach((group, wallIdx) => {
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

    // 7. Spherical Navigation Controls
    let isUserInteracting = false;
    let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
    let lon = 0, onPointerDownLon = 0;
    let lat = 0, onPointerDownLat = 0;
    let currentLon = 0, currentLat = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = true;
      onPointerDownMouseX = event.clientX;
      onPointerDownMouseY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      if (isUserInteracting === true) {
        const deltaX = event.clientX - onPointerDownMouseX;
        const deltaY = event.clientY - onPointerDownMouseY;
        lon = onPointerDownLon - deltaX * 0.16;
        lat = onPointerDownLat + deltaY * 0.16;
        lat = Math.max(-80, Math.min(80, lat));
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = false;
    };

    canvasRef.value.addEventListener("pointerdown", onPointerDown);
    canvasRef.value.addEventListener("pointermove", onPointerMove);
    canvasRef.value.addEventListener("pointerup", onPointerUp);

    // 8. Raycasting Click Selection
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

    // 9. Resize Handling
    const onResize = () => {
      if (!canvasRef.value || !container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // 10. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      currentLon += (lon - currentLon) * 0.12;
      currentLat += (lat - currentLat) * 0.12;

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

    // 11. Cleanup registration
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
      
      {/* WebGL Render Mode Container */}
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

      {/* Graceful Fallback Mode: Premium CSS 3D Perspective Cover Flow Carousel */}
      {hasWebGL.value === false && (
        <div 
          class="flex-1 w-full flex flex-col items-center justify-center bg-stone-950 px-4 md:px-8 relative overflow-hidden" 
          style="perspective: 1200px;"
        >
          {/* Ambient spotlight pool on the background */}
          <div class="absolute w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

          {/* Elegant alert badge */}
          <div class="absolute top-5 left-5 z-10 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] sm:text-xs font-semibold text-amber-400">
            <LuInfo class="h-4 w-4 animate-pulse" />
            <span>Modo de Compatibilidad 3D Activo (CSS Perspective)</span>
          </div>

          {/* CSS 3D Perspective Container */}
          <div class="relative w-full max-w-4xl h-[40vh] sm:h-[45vh] flex items-center justify-center mt-6" style="transform-style: preserve-3d;">
            {obras.map((obra, idx) => {
              const offset = idx - currentIndex.value;
              const absOffset = Math.abs(offset);

              // Render only nearby paintings to keep DOM lean
              if (absOffset > 2) return null;

              // Calculate 3D styles
              let transformStr = "";
              const zIndex = 10 - absOffset;
              let opacityStr = "1";

              if (offset === 0) {
                transformStr = "translate3d(0, 0, 0) rotateY(0deg) scale(1)";
                opacityStr = "1";
              } else if (offset === -1) {
                transformStr = "translate3d(-200px, 0, -150px) rotateY(38deg) scale(0.85)";
                opacityStr = "0.55";
              } else if (offset === 1) {
                transformStr = "translate3d(200px, 0, -150px) rotateY(-38deg) scale(0.85)";
                opacityStr = "0.55";
              } else if (offset === -2) {
                transformStr = "translate3d(-360px, 0, -300px) rotateY(48deg) scale(0.72)";
                opacityStr = "0.2";
              } else if (offset === 2) {
                transformStr = "translate3d(360px, 0, -300px) rotateY(-48deg) scale(0.72)";
                opacityStr = "0.2";
              }

              return (
                <div
                  key={obra.id}
                  onClick$={() => {
                    selectedObra.value = obra;
                  }}
                  class={[
                    "absolute w-[200px] sm:w-[280px] aspect-[3/4] sm:aspect-4/3 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl transition-all duration-500 bg-stone-900 cursor-pointer select-none",
                    offset === 0 ? "border-amber-400/50 shadow-[0_20px_50px_rgba(245,158,11,0.15)]" : "hover:opacity-90"
                  ]}
                  style={{
                    transform: transformStr,
                    zIndex: zIndex,
                    opacity: opacityStr,
                    transformOrigin: "center center"
                  }}
                >
                  {/* Spotlight reflection */}
                  {offset === 0 && (
                    <div class="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-white/8 to-transparent pointer-events-none z-10"></div>
                  )}
                  <img
                    src={obra.image_url}
                    alt={obra.titulo_obra || "Obra"}
                    class="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Painting shadow frame */}
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {/* Slide Navigation Buttons */}
          <div class="flex items-center gap-6 mt-8 sm:mt-10 z-10">
            <button
              onClick$={() => {
                const prevIdx = (currentIndex.value - 1 + obras.length) % obras.length;
                selectedObra.value = obras[prevIdx];
              }}
              class="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/80 hover:text-amber-400 hover:scale-105 active:scale-95 shadow-xl transition-all cursor-pointer"
              title="Anterior"
            >
              <LuChevronLeft class="h-5 w-5" />
            </button>
            
            <span class="text-neutral-400 text-xs font-semibold tracking-wider bg-neutral-900/60 px-4 py-1.5 rounded-full border border-neutral-800/40">
              {currentIndex.value + 1} / {obras.length}
            </span>

            <button
              onClick$={() => {
                const nextIdx = (currentIndex.value + 1) % obras.length;
                selectedObra.value = obras[nextIdx];
              }}
              class="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/80 hover:text-amber-400 hover:scale-105 active:scale-95 shadow-xl transition-all cursor-pointer"
              title="Siguiente"
            >
              <LuChevronRight class="h-5 w-5" />
            </button>
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
                  ? "Usa las flechas o haz clic en las miniaturas de los costados para navegar"
                  : "Haz clic en otra pintura en las paredes para ver sus detalles"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
