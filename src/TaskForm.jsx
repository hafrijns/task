export default function TaskForm({ taskData, setTaskData }) {
  return (
    <div style={{ maxWidth: "600px" }}>
      <h3>Task Definition</h3>

      {/* Task description */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: 600 }}>
          Task description
        </label>
        <textarea
          value={taskData.description}
          onChange={(e) =>
            setTaskData({ ...taskData, description: e.target.value })
          }
          placeholder="Describe the task the robot and human are engaged in..."
          style={{
            width: "100%",
            height: "120px",
            boxSizing: "border-box",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Time critical */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={taskData.timeCritical}
            onChange={(e) =>
              setTaskData({ ...taskData, timeCritical: e.target.checked })
            }
            style={{ marginRight: "8px" }}
          />
          Task is time-critical
        </label>
      </div>

      {/* Actors */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
          Primary actor(s)
        </div>

        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={taskData.actorHuman}
            onChange={(e) =>
              setTaskData({ ...taskData, actorHuman: e.target.checked })
            }
            style={{ marginRight: "8px" }}
          />
          Human
        </label>

        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={taskData.actorRobot}
            onChange={(e) =>
              setTaskData({ ...taskData, actorRobot: e.target.checked })
            }
            style={{ marginRight: "8px" }}
          />
          Robot
        </label>
      </div>

      {/* Failure severity */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontWeight: 600 }}>
          Consequences of task failure
        </label>
        <select
          value={taskData.failureSeverity}
          onChange={(e) =>
            setTaskData({ ...taskData, failureSeverity: e.target.value })
          }
          style={{ marginTop: "4px", padding: "6px", width: "200px" }}
        >
          <option value="low">Low (minor inconvenience)</option>
          <option value="medium">Medium (task disruption)</option>
          <option value="high">High (safety or major cost)</option>
        </select>
      </div>
    </div>
  );
}
