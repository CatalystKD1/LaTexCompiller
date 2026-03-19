const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const TEMP_DIR = path.join(__dirname, "temp");

app.post("/compile", (req, res) => {
  const latex = req.body.latex;

  if (!latex) {
    return res.status(400).send("No LaTeX provided");
  }

  const fileId = Date.now();
  const texPath = path.join(TEMP_DIR, `${fileId}.tex`);
  const pdfPath = path.join(TEMP_DIR, `${fileId}.pdf`);

  // Write LaTeX file
  fs.writeFileSync(texPath, latex);

  // Compile LaTeX
  exec(
    `pdflatex -interaction=nonstopmode -output-directory=${TEMP_DIR} ${texPath}`,
    (error, stdout, stderr) => {

      if (error) {
        console.error(stderr);
        return res.status(500).send("Compilation failed");
      }

      // Send PDF back
      fs.readFile(pdfPath, (err, data) => {
        if (err) {
          return res.status(500).send("PDF not found");
        }

        res.setHeader("Content-Type", "application/pdf");
        res.send(data);

        // Cleanup (optional but good)
        setTimeout(() => {
          fs.unlink(texPath, () => {});
          fs.unlink(pdfPath, () => {});
        }, 5000);
      });
    }
  );
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});