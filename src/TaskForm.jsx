import React, { useState,useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ModalitiesEditor from "./ModalitiesEditor";

/* ---------- helpers ---------- */
const emptyRow = () => ({
  human: "",
  robot: "",
  communicated: "",
  modality: [],
});

const createTask = (id) => ({
  id,
  goal: "",
  rows: [emptyRow(), emptyRow(), emptyRow()],
});






export default function TaskForm({ taskData, setTaskData, selectedTaskId }) {
  const [editingModalities, setEditingModalities] = useState(null);

useEffect(() => {
  if (!taskData.tasks || taskData.tasks.length === 0) {
    const init = { tasks: [createTask("task-1")], taskCounter: 1 };
    setTaskData(init);
    localStorage.setItem("taskData", JSON.stringify(init));
  }
}, [taskData, setTaskData]);

  const tasks = taskData.tasks;

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

  /* ---------- helpers ---------- */
  const updateTasks = (newTasks, newCounter = taskData.taskCounter) => {
    const updated = { ...taskData, tasks: newTasks, taskCounter: newCounter };
    setTaskData(updated);
    localStorage.setItem("taskData", JSON.stringify(updated));
  };

  const addTask = () => {
    const newCounter = taskData.taskCounter + 1;
    const newTask = createTask(`task-${newCounter}`);
    updateTasks([...tasks, newTask], newCounter);
  };

  const deleteTask = (id) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    updateTasks(newTasks);
  };

  const updateRows = (taskIndex, newRows) => {
    const newTasks = [...tasks];
    newTasks[taskIndex] = { ...newTasks[taskIndex], rows: newRows };
    updateTasks(newTasks);
  };

  const handleChange = (taskIndex, rowIndex, key, value) => {
    const newRows = [...tasks[taskIndex].rows];
    newRows[rowIndex][key] = value;
    updateRows(taskIndex, newRows);
  };

  const addRow = (taskIndex) => {
    updateRows(taskIndex, [...tasks[taskIndex].rows, emptyRow()]);
  };

  const deleteRow = (taskIndex, rowIndex) => {
    updateRows(taskIndex, tasks[taskIndex].rows.filter((_, i) => i !== rowIndex));
  };

  const onDragEnd = (taskIndex, result) => {
    if (!result.destination) return;
    const rows = Array.from(tasks[taskIndex].rows);
    const [moved] = rows.splice(result.source.index, 1);
    rows.splice(result.destination.index, 0, moved);
    updateRows(taskIndex, rows);
  };

  const formatModalities = (modalities = []) =>
    modalities
      .map((m) =>
        typeof m === "string" ? m : m?.type === "Other" ? `Other: ${m.text}` : ""
      )
      .filter(Boolean)
      .join(", ");

      useEffect(() => {
  if (selectedTaskId) {
    const el = document.getElementById(selectedTaskId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, [selectedTaskId]);

  /* ---------- render ---------- */
  return (
    <div style={{ padding: "10px" }}>
      <p>
        Write out the steps in the process. Each table represents a task, scenario, or phase.
      </p>

      {tasks.map((task, taskIndex) => (
        <div
          key={task.id}
          id={task.id}
          style={{
            marginBottom: "30px",
            padding: "10px",
            //border: "1px solid #bbb",
            //borderRadius: "6px",
             border: task.id === selectedTaskId
        ? "2px solid #4f46e5"
        : "1px solid #bbb",
      borderRadius: "6px",
      background: task.id === selectedTaskId ? "#eef2ff" : "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4>Task ID: {task.id}</h4>
            <button onClick={() => deleteTask(task.id)}>Delete Task</button>
          </div>

          {/* Task goal */}
          <div style={{ marginBottom: "10px" }}>
            <label>
              Task goal:{" "}
              <select
                value={task.goal || ""}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[taskIndex] = { ...newTasks[taskIndex], goal: e.target.value };
                  updateTasks(newTasks);
                }}
                style={{ padding: "4px", width: "350px" }}
              >
                <option value="" disabled>
                  Select goal
                </option>
                <option value="Shared (human + robot)">Shared (human + robot)</option>
                <option value="Robot affects human behavior change">
                  Robot affects human behavior change
                </option>
                <option value="Robot informs/warns human">Robot informs/warns human</option>
              </select>
            </label>
          </div>

          {/* Rows table */}
          <DragDropContext onDragEnd={(res) => onDragEnd(taskIndex, res)}>
            <Droppable droppableId={`rows-${task.id}`}>
              {(provided) => (
                <table
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ borderCollapse: "collapse", width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th></th>
                      <th style={thStyle}>Human</th>
                      <th style={thStyle}>Robot</th>
                      <th style={thStyle}>What is communicated (by the robot)</th>
                      <th style={thStyle}>Modalities</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.rows.map((row, rowIndex) => (
                      <Draggable
                        key={rowIndex}
                        draggableId={`${task.id}-row-${rowIndex}`}
                        index={rowIndex}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              border: "1px solid #ccc",
                            }}
                          >
                            <td {...provided.dragHandleProps}>☰</td>

                            <td style={tdStyle}>
                              <input
                                value={row.human}
                                onChange={(e) =>
                                  handleChange(taskIndex, rowIndex, "human", e.target.value)
                                }
                                style={inputStyle}
                              />
                            </td>

                            <td style={tdStyle}>
                              <input
                                value={row.robot}
                                onChange={(e) =>
                                  handleChange(taskIndex, rowIndex, "robot", e.target.value)
                                }
                                style={inputStyle}
                              />
                            </td>

                            <td style={tdStyle}>
                              <select
                                value={row.communicated}
                                onChange={(e) =>
                                  handleChange(taskIndex, rowIndex, "communicated", e.target.value)
                                }
                                style={inputStyle}
                              >
                                <option value="" />
                                {communicatedOptions.map((o) => (
                                  <option key={o} value={o}>
                                    {o}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td style={tdStyle}>
                              <button
                                onClick={() => setEditingModalities({ taskIndex, rowIndex })}
                              >
                                {row.modality.length
                                  ? formatModalities(row.modality)
                                  : "Edit Modalities"}
                              </button>
                            </td>

                            <td style={tdStyle}>
                              <button onClick={() => deleteRow(taskIndex, rowIndex)}>✖</button>
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

          <button onClick={() => addRow(taskIndex)} style={{ marginTop: "8px" }}>
            + Add Row
          </button>
        </div>
      ))}

      <button onClick={addTask}>+ Add Task</button>

      {/* Modal editor */}
      {editingModalities && (
        <ModalitiesEditor
          initialSelection={
            tasks[editingModalities.taskIndex].rows[editingModalities.rowIndex].modality
          }
          options={modalityOptions}
          onSave={(selected) => {
            const newRows = [...tasks[editingModalities.taskIndex].rows];
            newRows[editingModalities.rowIndex].modality = selected;
            updateRows(editingModalities.taskIndex, newRows);
            setEditingModalities(null);
          }}
          onCancel={() => setEditingModalities(null)}
        />
      )}
    </div>
  );
}

/* ---------- styles ---------- */
const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f0f0f0",
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
