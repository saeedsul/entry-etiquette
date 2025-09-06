import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Building, UserCheck } from "lucide-react";

type Visitor = {
  id: string;
  name: string;
  company: string;
  employee: string;
  purpose: string;
  status: "checked-in" | "checked-out";
  checkedInAt?: string;   // ISO string
  checkedOutAt?: string;  // ISO string
  checkInTime?: string;   // legacy mock field like "09:30 AM"
  photo?: string;
};

const AdminDashboard = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  // ------- helpers -------
  const formatTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

  const isToday = (iso?: string) => {
    if (!iso) return false;
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  // Load from localStorage (what PhotoCapture.tsx writes)
  useEffect(() => {
    const load = () => {
      const v = JSON.parse(localStorage.getItem("visitors") || "[]");
      setVisitors(v);
    };
    load();

    // keep in sync if another tab updates storage
    const onStorage = (e: StorageEvent) => {
      if (e.key === "visitors") load();
    };
    window.addEventListener("storage", onStorage);

    // optional: light polling so phone-based checkout (via your local API) reflects without manual refresh
    const poll = setInterval(load, 5000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(poll);
    };
  }, []);

  // KPIs
  const activeVisitors = visitors.filter(v => v.status === "checked-in");

  const todaysVisitorsCount = visitors.filter(v => isToday(v.checkedInAt)).length;

  const companiesVisiting = new Set(
    visitors.filter(v => isToday(v.checkedInAt)).map(v => v.company)
  ).size;

  // (Optional) CSV export
  const exportReport = () => {
    const rows: Visitor[] = JSON.parse(localStorage.getItem("visitors") || "[]");
    const header = [
      "id",
      "name",
      "company",
      "employee",
      "purpose",
      "status",
      "checkedInAt",
      "checkedOutAt",
    ];
    const csv = [
      header.join(","),
      ...rows.map((r: any) => header.map(h => JSON.stringify(r[h] ?? "")).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitors-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Today's list (show everyone who checked in today)
  const todaysVisitors = visitors
    .filter(v => isToday(v.checkedInAt))
    .sort((a, b) => {
      const ta = a.checkedInAt ? +new Date(a.checkedInAt) : 0;
      const tb = b.checkedInAt ? +new Date(b.checkedInAt) : 0;
      return tb - ta; // newest first
    });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage visitor activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Today's Visitors</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{todaysVisitorsCount}</div>
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
                {companiesVisiting}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Avg. Visit Duration</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">—</div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Visits (show both checked-in and checked-out) */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Today’s Visits</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysVisitors.length === 0 ? (
              <p className="text-slate-500">No visits today.</p>
            ) : (
              <div className="space-y-4">
                {todaysVisitors.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{v.name}</h3>
                        <p className="text-sm text-slate-600">
                          Visiting {v.employee} • {v.company}
                        </p>
                        <p className="text-xs text-slate-500">{v.purpose}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Badge
                          variant="secondary"
                          className={
                            v.status === "checked-in"
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-200 text-slate-800"
                          }
                        >
                          {v.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        <div>
                          <span className="text-slate-500">In:</span>{" "}
                          {v.checkedInAt ? formatTime(v.checkedInAt) : (v.checkInTime || "—")}
                        </div>
                        <div>
                          <span className="text-slate-500">Out:</span>{" "}
                          {formatTime(v.checkedOutAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button variant="admin" onClick={() => (window.location.href = "/")}>
            Back to Kiosk
          </Button>
          <Button variant="outline" onClick={exportReport}>
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
