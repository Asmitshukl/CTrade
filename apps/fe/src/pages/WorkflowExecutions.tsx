import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiListExecutions } from "@/lib/http";

interface Execution {
  _id: string;
  workflowId: string;
  status: "PENDING" | "SUCCESS" | "FAILURE";
  startTime: string;
  endTime?: string;
}

export default function WorkflowExecutions() {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workflowId) return;
    apiListExecutions(workflowId)
      .then(setExecutions)
      .catch(() => setExecutions([]))
      .finally(() => setLoading(false));
  }, [workflowId]);

  const statusColor = (status: string) => {
    if (status === "SUCCESS") return "text-green-600";
    if (status === "FAILURE") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Executions</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/workflow/${workflowId}`)}
            >
              Back to Workflow
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading executions...</p>
        ) : executions.length === 0 ? (
          <p className="text-muted-foreground">
            No executions found for this workflow.
          </p>
        ) : (
          <div className="grid gap-4">
            {executions.map((exec) => (
              <div key={exec._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">
                    Execution {exec._id.slice(-6)}
                  </p>
                  <span className={`text-sm font-medium ${statusColor(exec.status)}`}>
                    {exec.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>Started: {new Date(exec.startTime).toLocaleString()}</span>
                  {exec.endTime && (
                    <span className="ml-4">
                      Ended: {new Date(exec.endTime).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
