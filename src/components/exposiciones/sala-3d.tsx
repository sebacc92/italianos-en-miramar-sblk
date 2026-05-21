import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { LuX, LuInfo, LuSparkles, LuMousePointer } from "@qwikest/icons/lucide";

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

  // Initialize 3D scene inside the visible task (client-side only)
  useVisibleTask$(async ({ cleanup }) => {
    if (!canvasRef.value) return;

    // Dynamically import Three.js to keep initial bundle sizes low
    const THREE = await import("three");

    const container = canvasRef.value.parentElement;
    if (!container) return;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0); // Stand in the exact center of the room

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    // Warm museum sky ambient light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111111, 0.2);
    scene.add(hemiLight);

    // 3. Room Geometry (Floor, Ceiling, Walls)
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xeeece8, // Warm off-white museum concrete wall
      roughness: 0.9,
      metalness: 0.05,
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b1d16, // Premium gloss dark oak wood floor
      roughness: 0.35,
      metalness: 0.1,
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x141414, // Dark modern ceiling
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

    // 4. Painting distribution & Loading
    const textureLoader = new THREE.TextureLoader();
    const works = obras;
    const numPaintings = works.length;

    // Distribute paintings across the 4 walls (0: N, 1: E, 2: S, 3: W)
    const wallGroups: Obra[][] = [[], [], [], []];
    works.forEach((obra, idx) => {
      wallGroups[idx % 4].push(obra);
    });

    const clickableObjects: THREE.Object3D[] = [];

    const handleTextureLoaded = (texture: THREE.Texture, obra: Obra, wallIdx: number, spacing: number, j: number) => {
      // Retain natural aspect ratio of the painting
      const img = texture.image;
      const aspectRatio = img.width / img.height;
      const height = 4.2;
      const width = height * aspectRatio;

      // Create painting group
      const paintingGroup = new THREE.Group();

      // Painting canvas mesh
      const paintingGeometry = new THREE.PlaneGeometry(width, height);
      const paintingMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const paintingMesh = new THREE.Mesh(paintingGeometry, paintingMaterial);
      paintingMesh.userData = { obra };
      paintingGroup.add(paintingMesh);
      clickableObjects.push(paintingMesh);

      // 3D Box Frame behind the canvas
      const frameMargin = 0.28;
      const frameThickness = 0.12;
      const frameGeometry = new THREE.BoxGeometry(width + frameMargin, height + frameMargin, frameThickness);
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x1c1a17, // Elegant obsidian wood framing
        roughness: 0.7,
        metalness: 0.1,
      });
      const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
      frameMesh.position.set(0, 0, -frameThickness / 2);
      frameMesh.castShadow = true;
      paintingGroup.add(frameMesh);

      // Positioning coordinates
      const posAlongWall = -15 + spacing * (j + 1);
      let posX = 0, posZ = 0, rotY = 0;

      if (wallIdx === 0) {
        // North Wall
        posX = posAlongWall;
        posZ = -14.85;
        rotY = 0;
      } else if (wallIdx === 1) {
        // East Wall
        posX = 14.85;
        posZ = posAlongWall;
        rotY = -Math.PI / 2;
      } else if (wallIdx === 2) {
        // South Wall
        posX = -posAlongWall;
        posZ = 14.85;
        rotY = Math.PI;
      } else if (wallIdx === 3) {
        // West Wall
        posX = -14.85;
        posZ = -posAlongWall;
        rotY = Math.PI / 2;
      }

      paintingGroup.position.set(posX, 0.4, posZ);
      paintingGroup.rotation.y = rotY;
      scene.add(paintingGroup);

      // Focused museum spotlight above the painting
      const spotlight = new THREE.SpotLight(0xfff7e6, 12); // Slightly warm white
      // Place spotlight slightly in front and above the painting
      const lightOffsetDist = 1.8;
      const lightX = posX + (wallIdx === 1 ? -lightOffsetDist : wallIdx === 3 ? lightOffsetDist : 0);
      const lightZ = posZ + (wallIdx === 0 ? lightOffsetDist : wallIdx === 2 ? -lightOffsetDist : 0);
      spotlight.position.set(lightX, 4.2, lightZ);

      // Spotlight points directly at the painting
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

      // Soft downlight above it
      const pointLight = new THREE.PointLight(0xfff4d6, 0.4, 4);
      pointLight.position.set(posX, 0.8, posZ + (wallIdx === 0 ? 0.3 : wallIdx === 2 ? -0.3 : 0));
      scene.add(pointLight);

      // Track loaded count
      loadedCount.value++;
      if (loadedCount.value === numPaintings) {
        isLoaded.value = true;
        // Select first painting by default on loading
        selectedObra.value = works[0];
      }
    };

    // Load each painting texture
    wallGroups.forEach((group, wallIdx) => {
      const M = group.length;
      const spacing = 30 / (M + 1);
      group.forEach((obra, j) => {
        textureLoader.load(
          obra.image_url,
          (tex) => handleTextureLoaded(tex, obra, wallIdx, spacing, j),
          undefined,
          (err) => {
            console.error("Failed to load painting texture", err);
            loadedCount.value++;
            if (loadedCount.value === numPaintings) {
              isLoaded.value = true;
            }
          }
        );
      });
    });

    // If there are zero paintings, mark loaded immediately
    if (numPaintings === 0) {
      isLoaded.value = true;
    }

    // 5. Look Around Drag & Touch Controls
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
        lat = Math.max(-80, Math.min(80, lat)); // Clamp vertical rotation
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteracting = false;
    };

    // Listen to drag events on the canvas
    canvasRef.value.addEventListener("pointerdown", onPointerDown);
    canvasRef.value.addEventListener("pointermove", onPointerMove);
    canvasRef.value.addEventListener("pointerup", onPointerUp);

    // 6. Click/Raycast for painting selection
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

    // 7. Resize Handler
    const onResize = () => {
      if (!canvasRef.value || !container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // 8. Animation & Rendering loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera interpolation (lerping)
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

    // Clean up Three.js objects and events on component unmount
    cleanup(() => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      if (canvasRef.value) {
        canvasRef.value.removeEventListener("pointerdown", onPointerDown);
        canvasRef.value.removeEventListener("pointermove", onPointerMove);
        canvasRef.value.removeEventListener("pointerup", onPointerUp);
        canvasRef.value.removeEventListener("click", onCanvasClick);
      }
      scene.clear();
      renderer.dispose();
    });
  });

  return (
    <div class="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white select-none overflow-hidden animate-in fade-in duration-300">
      {/* 3D Render Canvas Container */}
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

        {/* Close Button */}
        <button
          onClick$={onClose$}
          class="absolute top-5 right-5 z-30 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-800/80 backdrop-blur-md hover:scale-105 shadow-xl transition-all duration-300"
          title="Salir del Recorrido 3D"
        >
          <LuX class="h-6 w-6" />
        </button>

        {/* Interactive Pointer Look Prompt */}
        {isLoaded.value && (
          <div class="absolute top-5 left-5 z-10 hidden sm:flex items-center gap-2 bg-neutral-900/60 border border-neutral-800/50 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-neutral-300">
            <LuMousePointer class="h-4.5 w-4.5 text-amber-400 animate-pulse" />
            <span>Arrastra con el mouse para girar 360° la cámara</span>
          </div>
        )}
      </div>

      {/* Selected Painting Detail Banner Overlay */}
      {isLoaded.value && selectedObra.value && (
        <div class="z-20 bg-linear-to-t from-neutral-950 via-neutral-950/98 to-transparent px-4 sm:px-8 pb-8 pt-10 border-t border-neutral-900/30 flex flex-col items-center animate-in slide-in-from-bottom duration-500">
          <div class="max-w-3xl w-full text-center">
            <span class="text-amber-400 text-[10px] uppercase font-black tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3 inline-block">
              Obra de {nombreArtista}
            </span>
            <h4 class="text-2xl font-black tracking-tight text-white mb-2 leading-tight">
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
              <span>Haz clic en otra pintura en las paredes para ver sus detalles</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
