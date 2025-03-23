document.getElementById("sliceBtn").addEventListener("click", () => {
  const fileInput = document.getElementById("modelUpload");
  const status = document.getElementById("status");
  if (!fileInput.files[0]) {
    status.textContent = "Please upload a .stl file first.";
    return;
  }

  // Simulated slicing output
  const gcode = "; Simulated G-code for: " + fileInput.files[0].name + "\nG28 ; home all axes\nG1 Z0.2 F3000 ; move to layer height\nM104 S200 ; set extruder temp\n";
  const blob = new Blob([gcode], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileInput.files[0].name.replace(/\.stl$/, ".gcode");
  link.click();
  status.textContent = "G-code generated successfully!";
});
