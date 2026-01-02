import React, { useState } from "react";

export default function ModalitiesEditor({
  initialSelection = [],
  options,
  onSave,
  onCancel,
}) {
  const [selected, setSelected] = useState(
    initialSelection.filter((v) => typeof v === "string")
  );

  const [otherText, setOtherText] = useState(() => {
    const other = initialSelection.find(
      (v) => typeof v === "object" && v.type === "Other"
    );
    return other?.text || "";
  });

  const hasOtherChecked = selected.includes("Other");

  const toggleOption = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSave = () => {
    const result = selected.filter((v) => v !== "Other");

    if (hasOtherChecked && otherText.trim() !== "") {
      result.push({ type: "Other", text: otherText.trim() });
    }

    onSave(result);
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>Edit Modalities</h3>

        {options.map((mod) => (
          <div key={mod}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(mod)}
                onChange={() => toggleOption(mod)}
              />
              {mod}
            </label>
          </div>
        ))}

        {/* OTHER TEXT AREA */}
        {hasOtherChecked && (
          <div style={{ marginTop: "10px" }}>
            <label>
              <strong>Other (please specify)</strong>
            </label>
            <textarea
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                marginTop: "5px",
                padding: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: "15px" }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- styles --- */

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  width: "400px",
  maxWidth: "90%",
  borderRadius: "4px",
};
