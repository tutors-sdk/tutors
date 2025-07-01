#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");

console.log("🔍 Checking Java setup for Jupyter notebooks...\n");

// Check Java installation
exec("java -version", (error, stdout, stderr) => {
  if (error) {
    console.log("❌ Java not found!");
    console.log("   Please install Java JDK:");
    console.log("   - Windows: choco install openjdk11");
    console.log("   - Or download from: https://adoptopenjdk.net/\n");
  } else {
    console.log("✅ Java installed:");
    console.log("   " + (stderr || stdout).split("\n")[0]);
    console.log("");
  }

  // Check Jupyter installation
  exec("jupyter --version", (error, stdout, stderr) => {
    if (error) {
      console.log("❌ Jupyter not found!");
      console.log("   Please install Jupyter:");
      console.log("   - pip install jupyter");
      console.log("   - or conda install jupyter\n");
    } else {
      console.log("✅ Jupyter installed:");
      console.log("   " + stdout.trim());
      console.log("");
    }

    // Check IJava kernel
    exec("jupyter kernelspec list", (error, stdout, stderr) => {
      if (error) {
        console.log("❌ Cannot check kernels");
      } else {
        if (stdout.includes("java")) {
          console.log("✅ IJava kernel found!");
          console.log("   Java notebooks are ready to use.\n");
        } else {
          console.log("❌ IJava kernel not found!");
          console.log("   Please install IJava kernel:");
          console.log("   - conda install -c conda-forge ijava");
          console.log("   - or follow: https://github.com/SpencerPark/IJava\n");
        }
      }

      console.log("🚀 Ready to launch?");
      console.log("   npm run start -- launch java-hello-world");
    });
  });
});
