import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, FileText, Users } from "lucide-react";
import { mockGroups, mockMessages, mockUsers } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function MentorGroupChat() {
  const { user } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");

  // Filter groups where user is a mentor
  const mentorGroups = mockGroups.filter((group) =>
    group.mentors.includes(user?.id || "")
  );

  // Get messages for selected group
  const groupMessages = selectedGroupId
    ? mockMessages.filter((msg) => msg.groupId === selectedGroupId)
    : [];

  const selectedGroup = mentorGroups.find((g) => g.id === selectedGroupId);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    toast({
      title: "Message sent",
      description: `Sent to ${selectedGroup?.name}`,
    });

    setMessageInput("");
  };

  const getUserName = (userId: string) => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    return foundUser?.name || "Unknown";
  };

  const getUserAvatar = (userId: string) => {
    const foundUser = mockUsers.find((u) => u.id === userId);
    return foundUser?.avatar || "?";
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)]">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <div className="grid grid-cols-12 h-full divide-x divide-border">
              {/* Left Panel - Group List */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    My Groups
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mentorGroups.length} active groups
                  </p>
                </div>
                <ScrollArea className="h-[calc(100%-5rem)]">
                  <div className="p-2 space-y-1">
                    {mentorGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setSelectedGroupId(group.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedGroupId === group.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{group.name}</p>
                            <p className={`text-sm ${
                              selectedGroupId === group.id
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            }`}>
                              {group.students.length} students
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            Sem {group.semester}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Panel - Chat */}
              <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col">
                {selectedGroup ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-border">
                      <h3 className="text-lg font-semibold text-foreground">{selectedGroup.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Semester {selectedGroup.semester} • {selectedGroup.students.length} students
                      </p>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {groupMessages.map((message) => {
                          const isCurrentUser = message.senderId === user?.id;
                          
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                            >
                              <div className={`flex gap-3 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                    {getUserAvatar(message.senderId)}
                                  </div>
                                </div>
                                <div>
                                  <div className={`rounded-lg p-3 ${
                                    isCurrentUser
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-foreground"
                                  }`}>
                                    {!isCurrentUser && (
                                      <p className="text-xs font-semibold mb-1">
                                        {getUserName(message.senderId)}
                                      </p>
                                    )}
                                    <p className="text-sm">{message.content}</p>
                                    {message.fileUrl && (
                                      <div className="mt-2 flex items-center gap-2 p-2 rounded bg-background/10">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-xs">{message.fileUrl}</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className={`text-xs text-muted-foreground mt-1 ${
                                    isCurrentUser ? "text-right" : ""
                                  }`}>
                                    {new Date(message.timestamp).toLocaleTimeString("en-IN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleSendMessage();
                          }}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center p-8">
                    <div>
                      <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Select a Group</h3>
                      <p className="text-muted-foreground">
                        Choose a group from the left to start chatting
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
