import React, { useState, useEffect } from "react";

/* Evaluation checklist items */
const checklistItems = [
  "Did human respond",
  "Task success",
  "Dual task paradigm: Performance on second task",
  "Did human understand signal",
];

const getSuggestedItems = (goal) => {
  switch (goal) {
    case "Shared (human + robot)":
      return ["Task success", "Dual task paradigm: Performance on second task"];
    case "Robot informs/warns human":
      return ["Did human understand signal"];
    case "Robot affects human behavior change":
      return ["Did human respond"];
    default:
      return [];
  }
};

const formatModalities = (modalities = []) =>
  modalities
    .map((m) =>
      typeof m === "string"
        ? m
        : m?.type === "Other"
        ? `Other: ${m.text}`
        : ""
    )
    .filter(Boolean)
    .join(", ");

export default function Evaluation({ taskData, setTaskData }) {
  // Initialize checkedState from taskData once
 const [checkedState, setCheckedState] = useState(() => {
  const state = {};
  (taskData.tasks || []).forEach((task) => {
    state[task.id] = { ...task.evaluation } || {}; // restore previous evaluation
    checklistItems.forEach(item => {
      if (state[task.id][item] === undefined) state[task.id][item] = false;
    });
  });
  return state;
});


  const handleToggle = (taskId, item) => {
  setCheckedState((prev) => {
    const updated = {
      ...prev,
      [taskId]: { ...prev[taskId], [item]: !prev[taskId][item] },
    };

    // Persist to taskData AFTER render, safely
    setTimeout(() => {
      const newTasks = taskData.tasks.map((t) =>
        t.id === taskId ? { ...t, evaluation: updated[taskId] } : t
      );
      setTaskData({ ...taskData, tasks: newTasks });
      localStorage.setItem("taskData", JSON.stringify({ ...taskData, tasks: newTasks }));
    }, 0);

    return updated;
  });
};


  if (!taskData?.tasks?.length) return <p>No tasks available.</p>;

  return (
    <div style={{ padding: "10px", overflowX: "auto" }}>
      <h3>Evaluation</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>Task Info</th>
            <th style={thStyle}>What to evaluate</th>
          </tr>
        </thead>
        <tbody>
          {taskData.tasks.map((task) => {
            const suggested = getSuggestedItems(task.goal);

            return (
              <tr key={task.id}>
                <td style={tdStyle}>
                  <strong>{task.id}</strong>
                  <br />
                  <em>Goal:</em> {task.goal || "-"}
                  <br />
                  {task.rows.map((row, idx) => (
                    <div key={idx} style={{ marginTop: "4px" }}>
                      <strong>Step {idx + 1}:</strong>{" "}
                      {`Communicated by robot: ${row.communicated || "-"}, Modalities: ${formatModalities(row.modality) || "-"}`}
                    </div>
                  ))}
                </td>
                <td style={tdStyle}>
                  {checklistItems.map((item) => {
                    const isSuggested = suggested.includes(item);
                    const checked = checkedState[task.id]?.[item] ?? false;

                    return (
                      <label
                        key={item}
                        style={{
                          display: "block",
                          fontWeight: !checked && isSuggested ? "bold" : "normal",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggle(task.id, item)}
                          style={{ marginRight: "6px" }}
                        />
                        {item}
                      </label>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  background: "#f0f0f0",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  verticalAlign: "top",
};
