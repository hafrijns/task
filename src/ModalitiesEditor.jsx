import React, { useState } from "react";

export default function ModalitiesEditor({ 
  initialSelection = [], 
  options = [], 
  onSave, 
  onCancel 
}) {
  const [selected, setSelected] = useState(initialSelection);

  const toggleOption = (mod) => {
    if (selected.includes(mod)) {
      setSelected(selected.filter((m) => m !== mod));
    } else {
      setSelected([...selected, mod]);
    }
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
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => onSave(selected)}>Save</button>
          <button onClick={onCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const modalContentStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "300px",
};
