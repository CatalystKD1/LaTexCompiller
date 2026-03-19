const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const TEMP_DIR = path.join(__dirname, "temp");

// ✅ YOUR PDFLATEX PATH (Windows-safe with quotes)
const PDFLATEX_PATH = `"C:\\Users\\fmccr\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe"`;

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

app.post("/compile", (req, res) => {
  const latex = req.body.latex;

  if (!latex) {
    return res.status(400).send("No LaTeX provided");
  }

  const fileId = Date.now();
  const texPath = path.join(TEMP_DIR, `${fileId}.tex`);
  const pdfPath = path.join(TEMP_DIR, `${fileId}.pdf`);

  try {
    // Write LaTeX file
    fs.writeFileSync(texPath, latex);

    // ✅ Use full path to pdflatex
    const command = `${PDFLATEX_PATH} -no-shell-escape -interaction=nonstopmode -output-directory="${TEMP_DIR}" "${texPath}"`;

    console.log("Running command:");
    console.log(command);

    exec(command, (error, stdout, stderr) => {
      console.log("------ STDOUT ------");
      console.log(stdout);

      console.log("------ STDERR ------");
      console.log(stderr);

      if (error) {
        console.error("❌ Compilation error");
        return res.status(500).send("Compilation failed");
      }

      // Check if PDF exists
      if (!fs.existsSync(pdfPath)) {
        console.error("❌ PDF not generated");
        return res.status(500).send("PDF not generated");
      }

      // Send PDF
      const pdfData = fs.readFileSync(pdfPath);

      res.setHeader("Content-Type", "application/pdf");
      res.send(pdfData);

      // Cleanup after short delay
      setTimeout(() => {
        try {
          if (fs.existsSync(texPath)) fs.unlinkSync(texPath);
          if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);

          const auxPath = texPath.replace(".tex", ".aux");
          const logPath = texPath.replace(".tex", ".log");

          if (fs.existsSync(auxPath)) fs.unlinkSync(auxPath);
          if (fs.existsSync(logPath)) fs.unlinkSync(logPath);
        } catch (cleanupErr) {
          console.warn("Cleanup error:", cleanupErr);
        }
      }, 5000);
    });

  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).send("Server error");
  }
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});