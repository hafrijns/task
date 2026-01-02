import React, { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Controls,
  Background,
} from "react-flow-renderer";

const BASE_NODES = [
  { id: "Task", type: "input", label: "Task", defaultPosition: { x: 300, y: 40 } },
  { id: "Robot", label: "Robot", defaultPosition: { x: 50, y: 350 } },
  { id: "Context", label: "Context", defaultPosition: { x: 50, y: 250 } },
  { id: "Evaluation", label: "Evaluation", defaultPosition: { x: 300, y: 450 } },
];

export default function Mindmap({ taskData, setTaskData, onSelectNode }) {
  // ---------- derive nodes ----------
  const derivedNodes = useMemo(() => {
    const baseNodes = BASE_NODES.map((n) => ({
      id: n.id,
      type: n.type || "default",
      data: { label: n.label },
      position: taskData.nodes?.[n.id]?.position || n.defaultPosition,
      draggable: true,
    }));

    const taskNodes = taskData.tasks?.map((task, i) => ({
      id: task.id,
      data: { label: task.goal ? `${task.id}\n${task.goal}` : task.id },
      position: task.position || { x: 300, y: 120 + i * 80 },
      draggable: true,
    })) || [];

    return [...baseNodes, ...taskNodes];
  }, [taskData]);

  // ---------- derive edges ----------
  const derivedEdges = useMemo(() => {
    const baseEdges = [
      { id: "e-task-eval", source: "Task", target: "Evaluation", animated: true, selectable: true },
      { id: "e-context-robot", source: "Context", target: "Robot", animated: false, selectable: true },
    ];

    const taskEdges = taskData.tasks?.flatMap((task) => [
      { id: `e-task-${task.id}`, source: "Task", target: task.id, animated: true, selectable: true },
      { id: `e-${task.id}-eval`, source: task.id, target: "Evaluation", animated: true, selectable: true },
    ]) || [];

    const userEdges = (taskData.edges || []).map((e) => ({ ...e, selectable: true }));

    return [...baseEdges, ...taskEdges, ...userEdges];
  }, [taskData]);

  // ---------- state ----------
  const [nodes, setNodes] = useState(derivedNodes);
  const [edges, setEdges] = useState(derivedEdges);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState([]);

  // ---------- sync with taskData ----------
  useEffect(() => {
    setNodes(derivedNodes);
    setEdges(derivedEdges);
  }, [derivedNodes, derivedEdges]);

  // ---------- handlers ----------
  const onNodesChange = useCallback(
  (changes) => {
    setNodes((nds) => {
      const updated = applyNodeChanges(changes, nds);

      // Schedule taskData update after render
      setTimeout(() => {
        setTaskData((prev) => {
          const tasks = prev.tasks || []; // safe fallback
          const newTasks = tasks.map((t) => {
            const node = updated.find((n) => n.id === t.id);
            if (node) return { ...t, position: node.position };
            return t;
          });

          // Store positions of all nodes
          const nodePositions = {};
          updated.forEach((n) => {
            nodePositions[n.id] = { position: n.position };
          });

          const updatedData = { ...prev, tasks: newTasks, nodes: nodePositions };
          localStorage.setItem("taskData", JSON.stringify(updatedData));
          return updatedData;
        });
      }, 0);

      return updated;
    });
  },
  [setTaskData]
);

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => {
        const newEdge = { ...connection, animated: true, selectable: true };
        const newEdges = addEdge(newEdge, eds);

        setTimeout(() => {
          setTaskData((prev) => {
            const userEdges = newEdges.filter(
              (e) =>
                !e.id.startsWith("e-task") &&
                !e.id.startsWith("e-") &&
                !["e-task-eval", "e-context-robot"].includes(e.id)
            );
            const updatedData = { ...prev, edges: userEdges };
            localStorage.setItem("taskData", JSON.stringify(updatedData));
            return updatedData;
          });
        }, 0);

        return newEdges;
      });
    },
    [setTaskData]
  );

  const handleNodeClick = useCallback((_, node) => onSelectNode(node.id), [onSelectNode]);

  const onSelectionChange = useCallback(({ edges: selected }) => {
    setSelectedEdgeIds(selected.map((e) => e.id));
  }, []);

  // Delete selected edges with Delete key
  const onKeyDown = useCallback(() => {
    if (selectedEdgeIds.length === 0) return;

    setEdges((eds) => {
      const remaining = eds.filter((e) => !selectedEdgeIds.includes(e.id));
      setTaskData((prev) => {
        const userEdges = remaining.filter(
          (e) =>
            !e.id.startsWith("e-task") &&
            !e.id.startsWith("e-") &&
            !["e-task-eval", "e-context-robot"].includes(e.id)
        );
        const updatedData = { ...prev, edges: userEdges };
        localStorage.setItem("taskData", JSON.stringify(updatedData));
        return updatedData;
      });
      return remaining;
    });

    setSelectedEdgeIds([]);
  }, [selectedEdgeIds, setTaskData]);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // ---------- render ----------
  return (
    <ReactFlowProvider>
      <div style={{ width: "800px", height: "800px" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onSelectionChange={onSelectionChange}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
