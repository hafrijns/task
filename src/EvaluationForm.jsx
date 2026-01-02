import React, { useState } from "react";

/* Evaluation checklist items */
const checklistItems = [
  "Did human respond",
  "Task success",
  "Dual task paradigm: Performance on second task",
  "Did human understand signal",
];

/* Determine suggested items based on task goal */
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

/* Format modalities array for display */
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

export default function Evaluation({ taskData }) {
  if (!taskData || !taskData.tasks || taskData.tasks.length === 0) {
    return <p>No tasks available.</p>;
  }

  /* ---------- state: track checkbox selections per task ---------- */
  const [checkedState, setCheckedState] = useState(() => {
    const state = {};
    taskData.tasks.forEach((task) => {
      const suggested = getSuggestedItems(task.goal);
      state[task.id] = {};
      checklistItems.forEach((item) => {
        state[task.id][item] = false; // start unchecked
      });
      suggested.forEach((item) => {
        state[task.id][item] = false; // start unchecked but visually suggested
      });
    });
    return state;
  });

  const handleToggle = (taskId, item) => {
    setCheckedState((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [item]: !prev[taskId][item],
      },
    }));
  };

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
                {/* First column: Task info */}
                <td style={tdStyle}>
                  <strong>{task.id}</strong>
                  <br />
                  <em>Goal:</em> {task.goal || "-"}
                  <br />
                  {task.rows.map((row, idx) => (
                    <div key={idx} style={{ marginTop: "4px" }}>
                      <strong>Step {idx + 1}:</strong>{" "}
                      {
                      ` Communicated by robot: ${row.communicated || "-"}, Modalities: ${formatModalities(row.modality) || "-"}`}
                      
                    </div>
                  ))}
                </td>

                {/* Second column: Checklist */}
                <td style={tdStyle}>
                  {checklistItems.map((item) => {
                    const isSuggested = suggested.includes(item);
                    const checked = checkedState[task.id][item];
                    return (
                      <label
                        key={item}
                        style={{
                          display: "block",
                          fontWeight: !checked && isSuggested ? "bold" : "normal", // bold if suggested but not confirmed
                          color: !checked && isSuggested ? "#1519faff" : "#000000ff",
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

/* ---------- styles ---------- */
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
