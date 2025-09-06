import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Building, UserCheck } from "lucide-react";

interface Visitor {
  id: string;
  name: string;
  company: string;
  employee: string;
  purpose: string;
  checkInTime: string;
  status: "checked-in" | "checked-out";
  photo?: string;
}

const mockVisitors: Visitor[] = [
  {
    id: "1",
    name: "John Smith",
    company: "TechCorp Inc",
    employee: "Sarah Johnson",
    purpose: "Business Meeting",
    checkInTime: "09:30 AM",
    status: "checked-in"
  },
  {
    id: "2",
    name: "Emily Davis",
    company: "Design Studio",
    employee: "Michael Brown",
    purpose: "Project Review",
    checkInTime: "10:15 AM",
    status: "checked-in"
  },
  {
    id: "3",
    name: "Robert Wilson",
    company: "Marketing Solutions",
    employee: "Lisa Garcia",
    purpose: "Consultation",
    checkInTime: "08:45 AM",
    status: "checked-out"
  }
];

const AdminDashboard = () => {
  const [visitors] = useState<Visitor[]>(mockVisitors);
  const activeVisitors = visitors.filter(v => v.status === "checked-in");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Monitor and manage visitor activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Today's Visitors</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{visitors.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Currently Checked In</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{activeVisitors.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Companies Visiting</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {new Set(visitors.map(v => v.company)).size}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg. Visit Duration</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">1.5h</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Visitors */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Current Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeVisitors.map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{visitor.name}</h3>
                      <p className="text-sm text-slate-600">Visiting {visitor.employee} • {visitor.company}</p>
                      <p className="text-xs text-slate-500">{visitor.purpose}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {visitor.status}
                    </Badge>
                    <p className="text-sm text-slate-500 mt-1">Since {visitor.checkInTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button variant="admin" onClick={() => window.location.href = "/"}>
            Back to Kiosk
          </Button>
          <Button variant="outline">
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;