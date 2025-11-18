import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface JoinGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinGroupModal({ open, onOpenChange }: JoinGroupModalProps) {
  const [code, setCode] = useState("");

  const handleJoin = () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement Supabase group join logic
    toast({
      title: "Feature coming soon",
      description: "Connect to your Supabase database to join groups",
    });
    
    setCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Your IPD Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Enter 6-digit code (e.g., P8K2M9)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
          <Button onClick={handleJoin} className="w-full">
            Join Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
