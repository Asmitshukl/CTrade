import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/http";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="max-w-2xl text-center space-y-6 px-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          CTrade
        </h1>
        <p className="text-lg text-muted-foreground">
          Create and execute trading workflows using customizable strategies and
          real-time market data.
        </p>
        <div className="flex gap-4 justify-center">
          {getAuthToken() ? (
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
