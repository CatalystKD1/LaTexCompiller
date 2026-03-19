import React from "react";

export default function VariableEditor({ variables, setVariables }) {

  const handleChange = (index, newValue) => {
    const updated = [...variables];
    updated[index].value = newValue;
    setVariables(updated);
  };

  if (variables.length === 0) {
    return <p>No variables found.</p>;
  }

  return (
    <div>
      {variables.map((v, i) => (
        <div
          key={v.name}
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}
        >
          <label style={{ fontWeight: "bold" }}>
            \{v.name}
          </label>

          {v.argCount > 0 && (
            <div style={{ fontSize: "12px", color: "gray" }}>
              Takes {v.argCount} argument(s)
            </div>
          )}

          <input
            type="text"
            value={v.value}
            onChange={(e) => handleChange(i, e.target.value)}
            style={{
              width: "100%",
              marginTop: "5px",
              padding: "5px"
            }}
          />
        </div>
      ))}
    </div>
  );
}