import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Award, MessageSquare } from "lucide-react";
import { mockSubmissions, mockTasks } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentSubmissions() {
  const { user } = useAuth();

  // Filter submissions for current student
  const studentSubmissions = mockSubmissions.filter(
    (sub) => sub.studentId === user?.id
  );

  const getTaskTitle = (taskId: string) => {
    const task = mockTasks.find((t) => t.id === taskId);
    return task?.title || "Unknown Task";
  };

  const handleDownload = (fileUrl: string) => {
    // Mock download
    console.log("Downloading:", fileUrl);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Submission History</h1>
          <p className="text-muted-foreground mt-1">Track your submitted assignments and grades</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground">Task Name</th>
                    <th className="text-left p-4 font-semibold text-foreground">File Name</th>
                    <th className="text-left p-4 font-semibold text-foreground">Submitted On</th>
                    <th className="text-left p-4 font-semibold text-foreground">Grade</th>
                    <th className="text-left p-4 font-semibold text-foreground">Feedback</th>
                    <th className="text-center p-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {studentSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">
                            {getTaskTitle(submission.taskId)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{submission.fileUrl}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4">
                        {submission.grade ? (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-500" />
                            <Badge className="bg-green-500/10 text-green-500">
                              {submission.grade}/100
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </td>
                      <td className="p-4">
                        {submission.feedback ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm truncate max-w-[200px]">
                              {submission.feedback}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(submission.fileUrl)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {studentSubmissions.length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Submissions Yet</h3>
                  <p className="text-muted-foreground">
                    You haven't submitted any assignments yet.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
