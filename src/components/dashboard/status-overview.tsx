import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const statuses = [
  { name: "Completed", value: 85, color: "bg-green-500" },
  { name: "In Progress", value: 10, color: "bg-blue-500" },
  { name: "Pending", value: 5, color: "bg-yellow-500" },
];

export function StatusOverview() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Pickup Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status) => (
            <div key={status.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{status.name}</span>
                <span className="text-sm text-muted-foreground">
                  {status.value}%
                </span>
              </div>
              <Progress
                value={status.value}
                className={status.color}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
