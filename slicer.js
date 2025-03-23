
const printerPresets = {
  p1s: { name: "P1S", bed: [256, 256, 256], ext: ".gcode" },
  k1c: { name: "K1C", bed: [220, 220, 250], ext: ".gcode" },
  ender3: { name: "Ender3V2Neo", bed: [220, 220, 250], ext: ".gcode" },
  lk5: { name: "LK5Pro", bed: [300, 300, 400], ext: ".gcode" },
  creatorpro: { name: "CreatorPro", bed: [227, 148, 150], ext: ".gx" }
};

let currentPrinter = printerPresets["p1s"];

document.getElementById("printerSelect").addEventListener("change", (e) => {
  currentPrinter = printerPresets[e.target.value];
  status.textContent = "Printer changed to " + currentPrinter.name;
});

const canvas = document.getElementById("modelViewer");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(canvas.clientWidth, 400);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 100);
controls.update();

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

function clearScene() {
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }
  scene.add(light);
}

document.getElementById("modelUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  clearScene();
  const reader = new FileReader();
  reader.onload = function(e) {
    const contents = e.target.result;
    const loader = new THREE.STLLoader();
    const geometry = loader.parse(contents);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  };
  reader.readAsArrayBuffer(file);
});

document.getElementById("sliceBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("modelUpload");
  const status = document.getElementById("status");
  if (!fileInput.files[0]) {
    status.textContent = "Please upload a .stl file first.";
    return;
  }

  const scale = document.getElementById("scale").value;
  const rx = document.getElementById("rotateX").value;
  const ry = document.getElementById("rotateY").value;
  const rz = document.getElementById("rotateZ").value;
  const infill = document.getElementById("infill").value;
  const supports = document.getElementById("supports").checked;

  const gcode = [
    "; G-code for: " + fileInput.files[0].name,
    "; Printer: " + currentPrinter.name,
    "; Bed Size: " + currentPrinter.bed.join(" x "),
    "; Scale: " + scale + "%",
    "; Rotation: X=" + rx + " Y=" + ry + " Z=" + rz,
    "; Infill: " + infill + "%",
    "; Supports: " + (supports ? "Enabled" : "Disabled"),
    "G28 ; home all axes",
    "G1 Z0.2 F3000 ; move to layer height",
    "M104 S200 ; set extruder temp"
  ].join("\n");

  const blob = new Blob([gcode], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const ext = currentPrinter.ext || ".gcode";
  link.download = fileInput.files[0].name.replace(/\.stl$/, "_" + currentPrinter.name + ext);
  link.click();
  status.textContent = "G-code generated successfully!";
});
