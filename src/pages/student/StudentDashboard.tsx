import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { NoticeCarousel } from "@/components/NoticeCarousel";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTasks, mockSubmissions, mockMessages, mockUsers, Task, studentProgress } from "@/lib/mockData";
import { Calendar, Clock, FileText, MessageSquare, Send, Upload, AlertCircle } from "lucide-react";
import { format, isPast } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UploadAssignmentModal } from "@/components/UploadAssignmentModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Bar, PolarArea } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

export default function StudentDashboard() {
  const [message, setMessage] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [leaveGroupOpen, setLeaveGroupOpen] = useState(false);

  const upcomingTasks = mockTasks
    .filter((t) => t.status !== "done" && new Date(t.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const pendingTasksCount = mockTasks.filter((t) => t.status === "todo").length;
  const studentSubmissions = mockSubmissions.filter((s) => s.studentId === "s1");

  const handleUploadClick = (task: Task) => {
    setSelectedTask(task);
    setUploadModalOpen(true);
  };

  const handleLeaveGroup = () => {
    toast({
      title: "Left group successfully",
      description: "Join another using a code.",
    });
    setLeaveGroupOpen(false);
  };

  // Chart.js data with vibrant colors
  const progressData = {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [{
      data: [studentProgress.completed, studentProgress.pending, studentProgress.overdue],
      backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
      borderWidth: 0,
    }]
  };

  const taskStatusData = {
    labels: ["To Do", "Submitted", "Graded"],
    datasets: [{
      label: "Tasks",
      data: [studentProgress.tasksByStatus.todo, studentProgress.tasksByStatus.submitted, studentProgress.tasksByStatus.graded],
      backgroundColor: ["#3b82f6", "#f59e0b", "#8b5cf6"],
    }]
  };

  const semesterData = {
    labels: ["Sem 3", "Sem 4", "Sem 5", "Sem 6"],
    datasets: [{
      label: "Progress %",
      data: studentProgress.semesterProgress,
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"],
    }]
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Track your projects and deadlines</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setLeaveGroupOpen(true)}>
            Leave Group
          </Button>
        </div>

        {/* Quick View Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <NoticeCarousel />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(task.dueDate), "MMM dd")}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}d
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-warning" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingTasksCount}</p>
                <p className="text-xs text-muted-foreground">Pending Tasks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{studentSubmissions.length}</p>
                <p className="text-xs text-muted-foreground">Total Submissions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Assigned by Mentor */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Tasks Assigned</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTasks.slice(0, 6).map((task) => {
              const isOverdue = isPast(new Date(task.dueDate)) && task.status !== "done";
              const mentor = mockUsers.find(u => u.role === "mentor");
              
              return (
                <Card key={task.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{task.title}</CardTitle>
                      {isOverdue && (
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">by {mentor?.name}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}>
                        {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <Badge variant={
                      task.status === "done" ? "default" : 
                      task.status === "in-progress" ? "secondary" : 
                      "outline"
                    }>
                      {task.status === "done" ? "Graded" : 
                       task.status === "review" ? "Submitted" : 
                       "To Do"}
                    </Badge>
                    {task.status !== "done" && task.status !== "review" && (
                      <Button 
                        onClick={() => handleUploadClick(task)} 
                        className="w-full" 
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Assignment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Colorful Progress Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Your Project at a Glance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium mb-3 text-center">Project Progress</h3>
                <Doughnut 
                  data={progressData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "bottom" },
                      tooltip: { 
                        callbacks: {
                          label: (context) => `${context.label}: ${context.parsed}%`
                        }
                      }
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3 text-center">Tasks by Status</h3>
                <Bar 
                  data={taskStatusData} 
                  options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3 text-center">Semester Timeline</h3>
                <Bar 
                  data={semesterData} 
                  options={{
                    indexAxis: "y" as const,
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { beginAtZero: true, max: 100 }
                    }
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="kanban" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            <TabsTrigger value="chat">Group Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <KanbanBoard groupId="g1" />
          </TabsContent>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Submission History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentSubmissions.map((sub) => {
                      const task = mockTasks.find((t) => t.id === sub.taskId);
                      return (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{task?.title}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {sub.fileUrl}
                          </TableCell>
                          <TableCell>{format(new Date(sub.submittedAt), "MMM dd, yyyy")}</TableCell>
                          <TableCell>
                            {sub.grade ? (
                              <Badge variant={sub.grade >= 80 ? "default" : "secondary"}>
                                {sub.grade}/100
                              </Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {sub.grade ? (
                              <Badge className="bg-success text-success-foreground">Graded</Badge>
                            ) : (
                              <Badge className="bg-warning text-warning-foreground">Under Review</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>AI Research Project - Group Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                  {mockMessages.map((msg) => {
                    const sender = mockUsers.find((u) => u.id === msg.senderId);
                    return (
                      <div key={msg.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{sender?.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {sender?.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(msg.timestamp), "HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{msg.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message... (@mention teammates)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        setMessage("");
                      }
                    }}
                  />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UploadAssignmentModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
        task={selectedTask}
      />

      <AlertDialog open={leaveGroupOpen} onOpenChange={setLeaveGroupOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave your current group? You'll need a new code to join another group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Leave Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
