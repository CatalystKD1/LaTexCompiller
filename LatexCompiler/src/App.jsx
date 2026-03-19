import { useState } from "react";
import { parseNewCommands } from "./parse/parse";
import VariableEditor from "./components/VariableEditor";

function App() {
  const [latex, setLatex] = useState("");
  const [variables, setVariables] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfName, setPdfName] = useState("output"); // Default PDF name

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    setLatex(text);

    const parsed = parseNewCommands(text);
    setVariables(parsed);
  };

  const updatedLatex = applyVariablesToLatex(latex, variables);

  const handleCompile = async () => {
    const blob = await compileLatex(updatedLatex);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    downloadPDF(blob, pdfName); // Use user-provided PDF name
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDE */}
      <div style={{ width: "40%", padding: "20px" }}>
        <input type="file" accept=".tex" onChange={handleFileUpload} />

        <VariableEditor
          variables={variables}
          setVariables={setVariables}
        />

        {/* PDF name input */}
        <div style={{ marginTop: "20px" }}>
          <label>
            PDF Name:{" "}
            <input
              type="text"
              value={pdfName}
              onChange={(e) => setPdfName(e.target.value)}
              placeholder="Enter PDF name"
            />
          </label>
        </div>

        <button onClick={handleCompile} style={{ marginTop: "20px" }}>
          Compile & Download PDF
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "60%", padding: "20px" }}>
        <h2>Preview</h2>

        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            style={{ width: "100%", height: "80vh" }}
            title="PDF Preview"
          />
        ) : (
          <pre>{updatedLatex}</pre>
        )}
      </div>
    </div>
  );
}

// ------ Change Variables ------
function applyVariablesToLatex(latex, variables) {
  let updated = latex;

  variables.forEach((v) => {
    const regex = new RegExp(
      `\\\\newcommand\\{\\\\${v.name}\\}(\\[\\d+\\])?\\{[^}]*\\}`
    );

    updated = updated.replace(
      regex,
      `\\newcommand{\\${v.name}}{${v.value}}`
    );
  });

  return updated;
}

// ------ Compile the LaTex ------
async function compileLatex(latex) {
  const res = await fetch("http://localhost:3001/compile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latex }),
  });

  if (!res.ok) {
    alert("Compilation failed");
    return null;
  }

  const blob = await res.blob();
  return blob;
}

// ------ Download PDF ------
function downloadPDF(blob, name) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name.endsWith(".pdf") ? name : `${name}.pdf`; // Ensure .pdf extension
  a.click();

  URL.revokeObjectURL(url);
}

export default App;