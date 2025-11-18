import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function GroupDetail() {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Group not found</h1>
          <p className="text-muted-foreground mt-2">Connect to your database to view group details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Set up your Supabase database and implement group management to see group details here.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
