import React, { useState, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Controls,
  Background,
} from "react-flow-renderer";

export default function Mindmap({ data, onSelectNode }) {
  // Simple static nodes based on data keys

  /*
  const initialNodes = Object.keys(data).map((key, index) => ({
    id: key,
    type: "default",
    data: { label: key },
    position: { x: 200 + index * 200, y: 100 },
  }));

  const initialEdges = [
    { id: "e1", source: "Task", target: "Robot", animated: true },
  ].filter((e) => data[e.source] && data[e.target]);
  */
  const initialNodes = [
    { id: "Task", type: "input", data: { label: "Task" }, position: { x: 100, y: 50 }, className: "pinkbox" },
    { id: "Robot", type: "default", data: { label: "Robot" }, position: { x: 300, y: 150 } },
    { id: "Intent", type: "default", data: { label: "Intent" }, position: { x: 100, y: 250 } },
    { id: "Evaluation", type: "default", data: { label: "Evaluation" }, position: { x: 300, y: 350 } },
  ];

  const initialEdges = [
    { id: "e1", source: "Task", target: "Robot", animated: true },
    { id: "e2", source: "Task", target: "Intent", animated: true },
    { id: "e3", source: "Robot", target: "Evaluation", animated: true },
    { id: "e4", source: "Intent", target: "Evaluation", animated: true },
  ];
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    []
  );

  const handleNodeClick = useCallback(
    (event, node) => {
      onSelectNode(node.id);
    },
    [onSelectNode]
  );

  return (
    <ReactFlowProvider>
      <div style={{ height: 800, width: 800 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
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
