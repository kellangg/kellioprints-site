let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({canvas: document.getElementById('modelViewer'), alpha: true});
renderer.setSize(window.innerWidth * 0.8, 400);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 100);
controls.update();

let light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

function clearScene() {
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }
  scene.add(light);
}

document.getElementById('fileInput2').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  document.getElementById("uploadStatus").textContent = "Uploaded: " + file.name;
  clearScene();

  const reader = new FileReader();
  reader.onload = function(e) {
    const contents = e.target.result;
    if (file.name.endsWith('.stl')) {
      const loader = new THREE.STLLoader();
      const geometry = loader.parse(contents);
      const material = new THREE.MeshNormalMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    } else if (file.name.endsWith('.obj')) {
      const loader = new THREE.OBJLoader();
      const object = loader.parse(contents);
      scene.add(object);
    }
  };
  reader.readAsArrayBuffer(file);
});
