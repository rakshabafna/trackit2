import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function StudentSubmissions() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Submission History</h1>
          <p className="text-muted-foreground mt-1">Track your submitted assignments and grades</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your submissions will appear here once you connect to the database and submit assignments.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
