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
  link.download = fileInput.files[0].name.replace(/\.stl$/, ".gcode");
  link.click();
  status.textContent = "G-code generated successfully!";
});
