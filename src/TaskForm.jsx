import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ModalitiesEditor from "./ModalitiesEditor";

export default function TaskForm({ taskData, setTaskData }) {
  // Ensure all rows have modality as an array
  const [rows, setRows] = useState(
    taskData.rows?.map((r) => ({
      ...r,
      modality: Array.isArray(r.modality) ? r.modality : [],
    })) || [
      { human: "", robot: "", communicated: "", modality: [] },
      { human: "", robot: "", communicated: "", modality: [] },
      { human: "", robot: "", communicated: "", modality: [] },
    ]
  );

  const [editingModalities, setEditingModalities] = useState(null);

  const communicatedOptions = [
    "Motion intent",
    "Actions",
    "Coordination/process",
    "Goal object/person",
    "Safety related",
    "Failure recovery",
    "Privacy",
    "Other",
  ];
  const modalityOptions = ["Light", "Display", "Sound", "Speech", "Gesture", "Other"];

  const updateRows = (newRows) => {
    setRows(newRows);
    setTaskData({ ...taskData, rows: newRows });
  };

  const handleChange = (index, key, value) => {
    const newRows = [...rows];
    newRows[index][key] = value;
    updateRows(newRows);
  };

  const addRow = () => {
    const newRows = [...rows, { human: "", robot: "", communicated: "", modality: [] }];
    updateRows(newRows);
  };

  const deleteRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    updateRows(newRows);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newRows = Array.from(rows);
    const [moved] = newRows.splice(result.source.index, 1);
    newRows.splice(result.destination.index, 0, moved);
    updateRows(newRows);
  };

  return (
    <div style={{ overflowX: "auto", padding: "10px" }}>
      <p>Write out the steps in the process: what do human and robot do and communicate?</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskRows">
          {(provided) => (
            <table
              style={{ borderCollapse: "collapse", width: "100%" }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <thead>
                <tr>
                  <th></th>
                  <th style={thStyle}>Human</th>
                  <th style={thStyle}>Robot</th>
                  <th style={thStyle}>What is communicated by the robot</th>
                  <th style={thStyle}>Modalities</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <Draggable key={idx} draggableId={`row-${idx}`} index={idx}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          border: "1px solid #ccc",
                        }}
                      >
                        <td {...provided.dragHandleProps} style={{ cursor: "grab", width: "30px" }}>
                          ☰
                        </td>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={row.human}
                            onChange={(e) => handleChange(idx, "human", e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={row.robot}
                            onChange={(e) => handleChange(idx, "robot", e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={tdStyle}>
                          <select
                            value={row.communicated}
                            onChange={(e) => handleChange(idx, "communicated", e.target.value)}
                            style={inputStyle}
                          >
                            <option value=""></option>
                            {communicatedOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={tdStyle}>
                          <button onClick={() => setEditingModalities(idx)}>
                            {row.modality.length > 0 ? row.modality.join(", ") : "Edit Modalities"}
                          </button>
                        </td>
                        <td style={tdStyle}>
                          <button onClick={() => deleteRow(idx)}>✖</button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={addRow} style={{ marginTop: "10px" }}>
        + Add Row
      </button>

      {/* Modalities Editor */}
      {editingModalities !== null && (
        <ModalitiesEditor
          initialSelection={rows[editingModalities].modality}
          options={modalityOptions}
          onSave={(selected) => {
            const newRows = [...rows];
            newRows[editingModalities].modality = selected;
            updateRows(newRows);
            setEditingModalities(null);
          }}
          onCancel={() => setEditingModalities(null)}
        />
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
  backgroundColor: "#f0f0f0",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "4px",
  boxSizing: "border-box",
};
