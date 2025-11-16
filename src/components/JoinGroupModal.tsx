import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface JoinGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinSuccess?: () => void;
}

export function JoinGroupModal({ open, onOpenChange, onJoinSuccess }: JoinGroupModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleJoin = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      // Check if group exists
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("code", code.toUpperCase())
        .single();

      if (groupError || !group) {
        toast({
          title: "Code not found",
          description: "Please check the code and try again",
          variant: "destructive",
        });
        return;
      }

      // Check if already in a group
      const { data: existingMembership } = await supabase
        .from("group_members")
        .select("*")
        .eq("student_id", user.id)
        .single();

      if (existingMembership) {
        toast({
          title: "Already in a group",
          description: "Leave your current group first",
          variant: "destructive",
        });
        return;
      }

      // Join the group
      const { error: joinError } = await supabase
        .from("group_members")
        .insert({
          group_id: group.id,
          student_id: user.id,
        });

      if (joinError) throw joinError;

      toast({
        title: `Joined ${group.name}!`,
        description: `Group Code: ${code}`,
      });

      setCode("");
      onOpenChange(false);
      onJoinSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <Button onClick={handleJoin} className="w-full" disabled={loading}>
            {loading ? "Joining..." : "Join Group"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
