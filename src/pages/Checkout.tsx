// src/pages/Checkout.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Visitor = {
  id: string;
  name: string;
  company: string;
  employee: string;
  purpose: string;
  status: "checked-in" | "checked-out";
  checkedInAt?: string;
  checkedOutAt?: string;
  photo?: string;
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const id = params.get("id") || "";
  const [result, setResult] = useState<"ok" | "notfound" | "already" | "invalid">("invalid");
  const [visitor, setVisitor] = useState<Visitor | null>(null);

  useEffect(() => {
    if (!id) {
      setResult("invalid");
      return;
    }
    const list: Visitor[] = JSON.parse(localStorage.getItem("visitors") || "[]");
    const idx = list.findIndex(v => v.id === id);
    if (idx === -1) {
      setResult("notfound");
      return;
    }
    const v = list[idx];
    setVisitor(v);
    if (v.status === "checked-out") {
      setResult("already");
      return;
    }
    const updated = { ...v, status: "checked-out", checkedOutAt: new Date().toISOString() };
    list[idx] = updated;
    localStorage.setItem("visitors", JSON.stringify(list));
    setVisitor(updated);
    setResult("ok");
  }, [id]);

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {result === "ok" ? "Checked Out" :
             result === "already" ? "Already Checked Out" :
             result === "notfound" ? "Visitor Not Found" : "Invalid QR"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result === "ok" && (
            <>
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
                <span>Visitor has been checked out successfully.</span>
              </div>
              {visitor && (
                <div className="text-sm text-slate-600">
                  <div><strong>Name:</strong> {visitor.name}</div>
                  <div><strong>Company:</strong> {visitor.company}</div>
                  <div><strong>Host:</strong> {visitor.employee}</div>
                </div>
              )}
            </>
          )}

          {(result === "already" || result === "notfound" || result === "invalid") && (
            <div className="flex items-center gap-3 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
              <span>
                {result === "already" && "This visitor is already checked out."}
                {result === "notfound" && "We couldn't find this visitor in the system."}
                {result === "invalid" && "This QR code is invalid."}
              </span>
            </div>
          )}

          <div className="pt-2">
            <Button variant="admin" className="w-full" onClick={() => navigate("/admin")}>
              Go to Admin Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
