import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiListWorkflows, type Workflow } from "@/lib/http";

export default function Dashboard() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiListWorkflows()
      .then(setWorkflows)
      .catch(() => setWorkflows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">My Workflows</h1>
          <Button onClick={() => navigate("/create-workflow")}>
            Create Workflow
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading workflows...</p>
        ) : workflows.length === 0 ? (
          <p className="text-muted-foreground">
            No workflows yet. Create your first workflow to get started.
          </p>
        ) : (
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <div
                key={workflow._id}
                className="border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/workflow/${workflow._id}`)}
              >
                <div>
                  <p className="font-medium text-foreground">
                    Workflow {workflow._id.slice(-6)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {workflow.nodes.length} node(s) &middot;{" "}
                    {workflow.edges.length} edge(s)
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workflow/${workflow._id}/executions`);
                  }}
                >
                  Executions
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
