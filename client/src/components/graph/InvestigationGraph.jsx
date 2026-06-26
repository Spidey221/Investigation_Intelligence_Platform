import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import GraphNode from './GraphNode';
import GraphSidebar from './GraphSidebar';

const nodeTypes = {
  custom: GraphNode,
};

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 180;
  const nodeHeight = 80;

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      type: 'custom',
      targetPosition: 'top',
      sourcePosition: 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const InvestigationGraph = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (data && data.nodes && data.nodes.length > 0) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        data.nodes,
        data.edges || []
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [data]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
       <div className="flex items-center justify-center h-full w-full text-cyber-textMuted glass-card">
        <p className="text-lg">No graph data available. Extract entities to build the intelligence graph.</p>
       </div>
    );
  }

  return (
    <div className="h-[600px] w-full relative bg-cyber-darker border border-cyber-accent rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
      >
        <MiniMap 
          nodeColor={(n) => '#3b82f6'} // cyber blue
          maskColor="rgba(15, 23, 42, 0.7)"
          style={{ backgroundColor: '#0f172a' }}
        />
        <Controls className="bg-cyber-dark border border-cyber-accent fill-cyber-blue" />
        <Background color="#334155" gap={20} size={1} />
        
        <Panel position="top-left" className="bg-cyber-dark/80 p-3 rounded border border-cyber-accent text-cyber-text text-sm shadow-md backdrop-blur-sm">
          <div className="font-bold text-cyber-blue mb-2 tracking-widest uppercase text-xs">Analytics Overview</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-cyber-textMuted text-xs">Nodes</div>
              <div className="font-mono text-lg">{data.statistics?.totalNodes || 0}</div>
            </div>
            <div>
              <div className="text-cyber-textMuted text-xs">Edges</div>
              <div className="font-mono text-lg">{data.statistics?.totalEdges || 0}</div>
            </div>
          </div>
        </Panel>
      </ReactFlow>

      {selectedNode && (
        <GraphSidebar node={selectedNode} edges={edges} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
};

export default InvestigationGraph;
