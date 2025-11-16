import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadAssignmentModal } from "@/components/UploadAssignmentModal";
import { Clock, User, Eye, AlertCircle, FileText } from "lucide-react";
import { mockTasks, mockUsers } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentTasks() {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [taskForUpload, setTaskForUpload] = useState<any>(null);

  // Filter tasks for the current student
  const studentTasks = mockTasks.filter((task) =>
    task.assignees.includes(user?.id || "")
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-500/10 text-green-500";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500";
      case "review":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleUploadClick = (task: any) => {
    setTaskForUpload(task);
    setUploadModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tasks Assigned to Your Group</h1>
            <p className="text-muted-foreground mt-1">View and manage your assigned tasks</p>
          </div>
        </div>

        <div className="grid gap-4">
          {studentTasks.map((task) => {
            const mentor = mockUsers.find((u) => u.role === "mentor");
            const overdue = isOverdue(task.dueDate);

            return (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace("-", " ")}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Assigned by {mentor?.name || "Mentor"}</span>
                        </div>
                        <div className={`flex items-center gap-2 ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                          <Clock className="h-4 w-4" />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          {overdue && <AlertCircle className="h-4 w-4" />}
                        </div>
                        {task.files && task.files.length > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{task.files.length} file(s) attached</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTask(task)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {task.status !== "done" && (
                        <Button
                          size="sm"
                          onClick={() => handleUploadClick(task)}
                        >
                          Upload Assignment
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {studentTasks.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Tasks Assigned</h3>
                <p className="text-muted-foreground">You don't have any tasks assigned yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Description</h4>
              <p className="text-muted-foreground">{selectedTask?.description}</p>
            </div>
            {selectedTask?.files && selectedTask.files.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Attached Files</h4>
                <div className="space-y-2">
                  {selectedTask.files.map((file: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2 border rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Submission Status</h4>
              <Badge className={getStatusColor(selectedTask?.status || "todo")}>
                {selectedTask?.status?.replace("-", " ") || "To Do"}
              </Badge>
            </div>
            {selectedTask?.status !== "done" && (
              <Button
                className="w-full"
                onClick={() => {
                  handleUploadClick(selectedTask);
                  setSelectedTask(null);
                }}
              >
                Upload Assignment
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Modal */}
      <UploadAssignmentModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        task={taskForUpload}
      />
    </DashboardLayout>
  );
}
