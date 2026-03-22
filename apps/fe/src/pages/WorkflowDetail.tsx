import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Hyperliquid } from "@/nodes/Actions/HyperLiquid";
import { Backpack } from "@/nodes/Actions/Backpack";
import { Lighter } from "@/nodes/Actions/Lighter";
import { PriceTrigger } from "@/nodes/Triggers/PriceTrigger";
import { Timer } from "@/nodes/Triggers/Timer";
import { Button } from "@/components/ui/button";
import {
  apiGetWorkflow,
  apiUpdateWorkflow,
} from "@/lib/http";

const nodetypes = {
  "price-trigger": PriceTrigger,
  timer: Timer,
  lighter: Lighter,
  hyperliquid: Hyperliquid,
  backpack: Backpack,
};

export default function WorkflowDetail() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!workflowId) return;
    apiGetWorkflow(workflowId)
      .then((workflow) => {
        setNodes(workflow.nodes || []);
        setEdges(workflow.edges || []);
      })
      .catch(() => {
        alert("Failed to load workflow");
      })
      .finally(() => setLoading(false));
  }, [workflowId]);

  const onNodesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) =>
      setNodes((snapshot) => applyNodeChanges(changes, snapshot)),
    []
  );
  const onEdgesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) =>
      setEdges((snapshot) => applyEdgeChanges(changes, snapshot)),
    []
  );
  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params: any) => setEdges((snapshot) => addEdge(params, snapshot)),
    []
  );

  const handleSave = async () => {
    if (!workflowId) return;
    setSaving(true);
    try {
      const payload = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodes: nodes.map((n: any) => ({
          id: n.id,
          nodeId: n.nodeId || n.id,
          data: n.data,
          position: n.position,
          credentials: n.credentials || {},
        })),
        edges,
      };
      await apiUpdateWorkflow(workflowId, payload);
    } catch {
      alert("Failed to update workflow");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading workflow...</p>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: "100vw", height: "100vh" }}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/workflow/${workflowId}/executions`)}
        >
          Executions
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <ReactFlow
        nodeTypes={nodetypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
