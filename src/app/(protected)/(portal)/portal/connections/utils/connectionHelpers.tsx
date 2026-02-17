import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { GHLConnection } from "@/types";

export function getStatusBadge(status: GHLConnection["status"]) {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="border-success text-success">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Active
        </Badge>
      );
    case "needs_reauth":
      return (
        <Badge variant="outline" className="border-warning text-warning">
          <AlertCircle className="mr-1 h-3 w-3" /> Needs Reauth
        </Badge>
      );
    case "disconnected":
      return (
        <Badge variant="outline" className="border-destructive text-destructive">
          <XCircle className="mr-1 h-3 w-3" /> Disconnected
        </Badge>
      );
  }
}