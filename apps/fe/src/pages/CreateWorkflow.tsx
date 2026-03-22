import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerSheet } from "@/components/TriggerSheet";
import { ActionSheet } from "@/components/ActionSheet";
import { Hyperliquid } from "@/nodes/Actions/HyperLiquid";
import { Backpack } from "@/nodes/Actions/Backpack";
import { Lighter } from "@/nodes/Actions/Lighter";
import { PriceTrigger } from "@/nodes/Triggers/PriceTrigger";
import { Timer } from "@/nodes/Triggers/Timer";
import { Button } from "@/components/ui/button";
import { apiCreateWorkflow } from "@/lib/http";
import type {
  PriceTriggerMetaData,
  TimerNodeMetaData,
  TradingMetadata,
} from "common/types";

export type NodeKind =
  | "price-trigger"
  | "timer"
  | "hyperliquid"
  | "backpack"
  | "lighter";
export type NodeMetaData =
  | TradingMetadata
  | TimerNodeMetaData
  | PriceTriggerMetaData;

const nodetypes = {
  "price-trigger": PriceTrigger,
  timer: Timer,
  lighter: Lighter,
  hyperliquid: Hyperliquid,
  backpack: Backpack,
};

interface NodeType {
  type: NodeKind;
  data: {
    kind: "action" | "trigger";
    metadata: NodeMetaData;
  };
  id: string;
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export default function CreateWorkflow() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [saving, setSaving] = useState(false);

  const [selectedActions, setSelectedAction] = useState<{
    position: { x: number; y: number };
    startingNodeId: string;
  } | null>(null);

  const onNodesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const POSTION_OFFSET = 50;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onConnectEnd = useCallback((_params: any, connectionInfo: any) => {
    if (!connectionInfo.isValid) {
      setSelectedAction({
        startingNodeId: connectionInfo.fromNode.id,
        position: {
          x: connectionInfo.from.x + POSTION_OFFSET,
          y: connectionInfo.from.y + POSTION_OFFSET,
        },
      });
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        nodes: nodes.map((n) => ({
          id: n.id,
          nodeId: n.id,
          data: n.data,
          position: n.position,
          credentials: {},
        })),
        edges,
      };
      const res = await apiCreateWorkflow(payload);
      navigate(`/workflow/${res.id}`);
    } catch {
      alert("Failed to save workflow");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative" style={{ width: "100vw", height: "100vh" }}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back
        </Button>
        <Button onClick={handleSave} disabled={saving || nodes.length === 0}>
          {saving ? "Saving..." : "Save Workflow"}
        </Button>
      </div>

      {!nodes.length && (
        <TriggerSheet
          onselect={(type, metadata) => {
            setNodes([
              ...nodes,
              {
                id: Math.random().toString(),
                type,
                data: { kind: "trigger", metadata },
                position: { x: 0, y: 0 },
              },
            ]);
          }}
        />
      )}

      {selectedActions && (
        <ActionSheet
          onselect={(type, metadata) => {
            const nodeid = Math.random().toString();
            setNodes([
              ...nodes,
              {
                id: nodeid,
                type,
                data: { kind: "action", metadata },
                position: selectedActions.position,
              },
            ]);
            setEdges([
              ...edges,
              {
                id: `${selectedActions.startingNodeId}-${nodeid}`,
                source: selectedActions.startingNodeId,
                target: nodeid,
              },
            ]);
            setSelectedAction(null);
          }}
        />
      )}

      <ReactFlow
        nodeTypes={nodetypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
      />
    </div>
  );
}
