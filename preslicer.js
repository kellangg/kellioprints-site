
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("modelViewer"), alpha: true });
renderer.setSize(500, 400);
let controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 100);
controls.update();
let mesh = null;

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

function centerAndScaleMesh(m, targetSize = 100) {
  const box = new THREE.Box3().setFromObject(m);
  const size = new THREE.Vector3();
  box.getSize(size);
  const scale = targetSize / Math.max(size.x, size.y, size.z);
  m.scale.set(scale, scale, scale);
  box.setFromObject(m);
  const center = new THREE.Vector3();
  box.getCenter(center);
  m.position.sub(center);
}

document.getElementById("modelUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;
  document.getElementById("status").textContent = "Model loaded!";
  const reader = new FileReader();
  reader.onload = function(e) {
    const contents = e.target.result;
    const loader = new THREE.STLLoader();
    const geometry = loader.parse(contents);
    const material = new THREE.MeshNormalMaterial();
    if (mesh) scene.remove(mesh);
    mesh = new THREE.Mesh(geometry, material);
    centerAndScaleMesh(mesh);
    scene.add(mesh);
  };
  reader.readAsArrayBuffer(file);
});

document.getElementById("exportBtn").addEventListener("click", () => {
  if (!mesh) return;
  const scale = parseFloat(document.getElementById("scale").value) / 100;
  const rx = THREE.MathUtils.degToRad(document.getElementById("rotateX").value);
  const ry = THREE.MathUtils.degToRad(document.getElementById("rotateY").value);
  const rz = THREE.MathUtils.degToRad(document.getElementById("rotateZ").value);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(scale, scale, scale);
  const exporter = new THREE.STLExporter();
  const result = exporter.parse(mesh);
  const blob = new Blob([result], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "adjusted_model.stl";
  link.click();
});
