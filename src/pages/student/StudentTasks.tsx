import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadAssignmentModal } from "@/components/UploadAssignmentModal";
import { ListTodo } from "lucide-react";

export default function StudentTasks() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [taskForUpload, setTaskForUpload] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks Assigned to Your Group</h1>
            <p className="text-muted-foreground mt-1">View and manage your assigned tasks</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tasks assigned to you will appear here once you connect to the database and join a group.
            </p>
          </CardContent>
        </Card>

        {taskForUpload && (
          <UploadAssignmentModal
            open={uploadModalOpen}
            onOpenChange={setUploadModalOpen}
            task={taskForUpload}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
