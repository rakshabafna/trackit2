import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload, FileText, X } from "lucide-react";
import { Task } from "@/lib/mockData";

interface UploadAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function UploadAssignmentModal({ open, onOpenChange, task }: UploadAssignmentModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const acceptedTypes = [".pdf", ".docx", ".pptx"];
  const maxSize = 50 * 1024 * 1024; // 50MB

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file: File) => {
    const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
    
    if (!acceptedTypes.includes(ext)) {
      toast({
        title: "Invalid file type",
        description: "Only PDF, DOCX, and PPTX files are allowed",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 50MB",
        variant: "destructive",
      });
      return;
    }

    setFile(file);
  };

  const handleSubmit = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a file",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Assignment submitted for "${task?.title}"`,
      description: `File: ${file.name}`,
    });
    
    setFile(null);
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Assignment - {task?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Accepted: PDF, DOCX, PPTX (Max 50MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Optional Comment
            </label>
            <Textarea
              placeholder="Add any notes about your submission..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
