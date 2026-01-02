import React, { useState, useEffect } from "react";
import Mindmap from "./Mindmap";
import TaskForm from "./TaskForm";
import EvaluationForm from "./EvaluationForm";

export default function App() {
  const topics = ["Task", "Robot", "Intent", "Evaluation"];
  const [view, setView] = useState("tabs"); 
  const [currentTab, setCurrentTab] = useState(topics[0]);
  const [data, setData] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("worksheetData") || "{}");
    return topics.reduce((acc, t) => ({ ...acc, [t]: saved[t] || "" }), {});
  });


// Structured Task worksheet
  const [taskData, setTaskData] = useState(() => {
  return (
    JSON.parse(localStorage.getItem("taskData")) || {
      meta: {
        description: "",
         human: "",
          robot: "",
          communicated: "",
          modality: [],
      },
      tasks: [{ id: "task-1", goal: "", rows: [] }],
      taskCounter: 1,
    }
  );
});

const [selectedTaskId, setSelectedTaskId] = useState(null);


useEffect(() => {
  localStorage.setItem("taskData", JSON.stringify(taskData));
}, [taskData]);

  const handleChange = (topic, value) => {
    const newData = { ...data, [topic]: value };
    setData(newData);
    localStorage.setItem("worksheetData", JSON.stringify(newData));
  };

  const handleExport = () => {
    const exportData = {
      worksheets: {
        ...data,
        Task: taskData,
      },
      meta: {
        tool: "HRI Task Design Tool",
        version: 1,
        exportedAt: new Date().toISOString(),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hri-task-design.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ IMPORT (restores taskData)
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);

        if (!imported.worksheets) {
          alert("Invalid file format");
          return;
        }

        const worksheets = imported.worksheets;

        // Restore text worksheets
        const restoredData = { ...data };
        topics.forEach((t) => {
          if (t !== "Task") {
            restoredData[t] = worksheets[t] || "";
          }
        });

        setData(restoredData);
        localStorage.setItem("worksheetData", JSON.stringify(restoredData));

        // Restore Task worksheet
        if (worksheets.Task && typeof worksheets.Task === "object") {
          setTaskData(worksheets.Task);
          localStorage.setItem("taskData", JSON.stringify(worksheets.Task));
        }

        setCurrentTab("Task");
      } catch (err) {
        alert("Invalid JSON");
      }
    };

    reader.readAsText(file);
  };


  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", borderRight: "1px solid #ccc", padding: "20px" }}>
        <h3>Views</h3>
        <button onClick={() => setView("tabs")}>Tabs</button>
        <button onClick={() => setView("mindmap")} style={{ marginTop: "10px" }}>
          Mindmap
        </button>

        <hr style={{ margin: "20px 0" }} />

        <input type="file" accept=".json" onChange={handleImport} />
        <button onClick={handleExport} style={{ display: "block", marginTop: "10px" }}>
          Export JSON
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {view === "tabs" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* Tabs */}
            <div>
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setCurrentTab(t)}
                  style={{ fontWeight: currentTab === t ? "bold" : "normal", marginRight: "5px" }}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div style={{ overflow: "auto" }}>
              {currentTab === "Task" ? (
              <TaskForm taskData={taskData} setTaskData={setTaskData} selectedTaskId={selectedTaskId}/> 
              ) : currentTab === "Evaluation" ? (
              <EvaluationForm taskData={taskData} />
              ) : (
            <textarea
              style={{
                width: "500px",
                height: "400px",
                boxSizing: "border-box",
                padding: "8px",
                border: "1px solid #ccc",
                resize: "vertical",
      }}
      value={data[currentTab]}
      onChange={(e) => handleChange(currentTab, e.target.value)}
    />
  )}
</div>


          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0 }}>
            <Mindmap
  data={data} setTaskData={setTaskData} taskData={taskData}
  onSelectNode={(nodeId) => {
    // Case 1: main tabs
    if (["Task", "Robot", "Intent", "Evaluation"].includes(nodeId)) {
      setCurrentTab(nodeId);
      setSelectedTaskId(null);
      setView("tabs");
      }

    if (nodeId.startsWith("task-")) {
      setCurrentTab("Task");
      setSelectedTaskId(nodeId);
      setView("tabs");
    }
  }}
/>
          </div>
        )}
      </div>
    </div>
  );
}
