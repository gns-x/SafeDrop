import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download, RefreshCw } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full bg-green-500 hover:bg-green-600">
          <Plus className="mr-2 h-4 w-4" />
          Add New Parent
        </Button>
        <Button variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
        <Button variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Data
        </Button>
      </CardContent>
    </Card>
  );
}
