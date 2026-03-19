import { useState } from "react";
import { parseNewCommands } from "./parse/parse";
import VariableEditor from "./components/VariableEditor";

function App() {
  const [latex, setLatex] = useState("");
  const [variables, setVariables] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    setLatex(text);

    const parsed = parseNewCommands(text);
    setVariables(parsed);
  };

  // ✅ RIGHT HERE
  const updatedLatex = applyVariablesToLatex(latex, variables);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDE */}
      <div style={{ width: "40%", padding: "20px" }}>
        <input type="file" accept=".tex" onChange={handleFileUpload} />

        <VariableEditor
          variables={variables}
          setVariables={setVariables}
        />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "60%", padding: "20px" }}>
        <h2>Updated LaTeX</h2>

        {/* ✅ RIGHT HERE */}
        <pre>{updatedLatex}</pre>
      </div>

    </div>
  );
}

function applyVariablesToLatex(latex, variables) {
  let updated = latex;

  variables.forEach(v => {
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

async function compileLatex(latex) {
  const res = await fetch("http://localhost:3001/compile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ latex })
  });

  if (!res.ok) {
    alert("Compilation failed");
    return null;
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export default App;