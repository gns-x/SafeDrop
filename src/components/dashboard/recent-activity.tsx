import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const activities = [
  {
    time: "2:30 PM",
    description: "Sarah Johnson picked up Amy Johnson",
    type: "pickup",
  },
  {
    time: "2:25 PM",
    description: "New parent registration: Michael Smith",
    type: "registration",
  },
  {
    time: "2:15 PM",
    description: "Pickup request approved for Tom Wilson",
    type: "approval",
  },
  {
    time: "2:00 PM",
    description: "System backup completed",
    type: "system",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex gap-4 text-sm">
                <div className="w-16 text-gray-500">{activity.time}</div>
                <div className="flex-1">{activity.description}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
