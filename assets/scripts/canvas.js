import { OrbitControls } from "//cdn.skypack.dev/three@0.131.1/examples/jsm/controls/OrbitControls?min";

let canvas, camera, scene, renderer, mesh;

function createGeometry(config) {
  let geometry;
  switch (config.type) {
    case "ring":
      geometry = new THREE.TorusGeometry(
        config.radius,
        config.tubeRadius,
        config.radialSegments,
        config.tubularSegments,
        Math.PI * config.arc
      );
      break;
    case "sphere":
      geometry = new THREE.SphereGeometry(
        config.radius,
        config.widthSegments,
        config.heightSegments,
        Math.PI * config.phiStart,
        Math.PI * config.phiLength,
        Math.PI * config.thetaStart,
        Math.PI * config.thetaLength
      );
      break;
    default:
  }
  return geometry;
}

function initGUI() {
  const params = {
    wireframe: false
  };

  const gui = new dat.GUI();
  const myGui = gui.addFolder("Manage GUI");
  myGui.add(params, "wireframe").onChange((value) => {
    mesh[3].material.wireframe = value;
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
  canvas = document.getElementById("canvas");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 30;
  scene.add(camera);

  scene.add(new THREE.AmbientLight(0xffffff, 1));

  const pointLight = new THREE.PointLight(0xffffff, 1);
  camera.add(pointLight);

  const geometriesArr = [
    {
      type: "ring",
      radius: 12,
      tubeRadius: 0.5,
      radialSegments: 16,
      tubularSegments: 100,
      arc: 2,
      color: 0xd6ae7b
    },
    {
      type: "ring",
      radius: 11,
      tubeRadius: 0.5,
      radialSegments: 16,
      tubularSegments: 100,
      arc: 2,
      color: 0xd6ae7b
    },
    {
      type: "ring",
      radius: 10,
      tubeRadius: 0.5,
      radialSegments: 16,
      tubularSegments: 100,
      arc: 2,
      color: 0xd6ae7b
    },
    {
      type: "sphere",
      radius: 8,
      widthSegments: 64,
      heightSegments: 64,
      phiStart: 0,
      phiLength: 2,
      thetaStart: 0,
      thetaLength: 2,
      texture:
        "https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
    },
    {
      type: "sphere",
      radius: 1,
      widthSegments: 64,
      heightSegments: 64,
      phiStart: 0,
      phiLength: 2,
      thetaStart: 0,
      thetaLength: 2,
      texture:
        "https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
    }
  ];

  mesh = [];
  geometriesArr.forEach((data, i) => {
    const geometry = createGeometry(data);
    const material = new THREE.MeshPhongMaterial();
    data.texture &&
      (material.map = new THREE.TextureLoader().load(data.texture));
    data.color && material.color.set(data.color);
    mesh[i] = new THREE.Mesh(geometry, material);
    mesh[i].rotation.x = 5;
    mesh[i].rotation.y = -0.5;
    scene.add(mesh[i]);
  });

  initGUI();

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    let elapsedTime = clock.getElapsedTime();
    mesh[3].rotation.z = 0.8 * elapsedTime;
    mesh[4].position.set(
      Math.sin(elapsedTime) * 15,
      0,
      Math.cos(elapsedTime) * 15
    );
    renderer.render(scene, camera);
  });
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;

  window.addEventListener("resize", onWindowResize);
}

init();
