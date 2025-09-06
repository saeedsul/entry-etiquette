import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, Clock, Building, User, Phone, Mail } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

interface VisitorData {
  name: string;
  email: string;
  phone: string;
  company: string;
  employee: string;
  purpose: string;
}

const VisitorCard = () => {
  const navigate = useNavigate();
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [currentTime] = useState(new Date().toLocaleString());
  const [visitorId, setVisitorId] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem("visitorData");
    const storedPhoto = localStorage.getItem("visitorPhoto");
    const storedId = localStorage.getItem("currentVisitorId") || "";
    if (storedData) setVisitorData(JSON.parse(storedData));
    if (storedPhoto) setPhoto(storedPhoto);
    setVisitorId(storedId);
  }, []);

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    const cardElement = document.getElementById("visitor-card");
    if (!cardElement) return;

    if ((document as any).fonts?.ready) {
      try { await (document as any).fonts.ready; } catch {}
    }

    const canvas = await html2canvas(cardElement, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = canvas.width;
    const imgH = canvas.height;
    const ratio = Math.min(pageW / imgW, pageH / imgH);

    const w = imgW * ratio;
    const h = imgH * ratio;
    const x = (pageW - w) / 2;
    const y = (pageH - h) / 2;

    pdf.addImage(imgData, "PNG", x, y, w, h);
    pdf.save(`visitor-badge-${visitorId}.pdf`);
  };

  const handleNewVisitor = () => {
    localStorage.removeItem("visitorData");
    localStorage.removeItem("visitorPhoto");
    localStorage.removeItem("currentVisitorId");
    navigate("/");
  };

  if (!visitorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-slate-600 mb-4">No visitor data found</p>
          <Button onClick={() => navigate("/")} variant="kiosk">Start Over</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Visitor Badge Generated</h1>
          <p className="text-muted-foreground">Your visitor badge is ready. Please print or save it.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visitor Card */}
          <div id="visitor-card" className="flex justify-center">
            <Card className="w-full max-w-sm shadow-2xl border-4 border-blue-200 bg-white">
              <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="text-center border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-bold text-blue-700">VISITOR</h2>
                  <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                    ID: {visitorId}
                  </Badge>
                </div>

                {/* Photo */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-blue-200">
                    {photo ? (
                      <img src={photo} alt="Visitor" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <User className="h-16 w-16 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Visitor Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <div><p className="font-semibold text-slate-800">{visitorData.name}</p></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-slate-600">Visiting: {visitorData.company}</p>
                      <p className="text-slate-600">Host: {visitorData.employee}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <p className="text-slate-600">{currentTime}</p>
                  </div>

                  {/* QR for checkout */}
                  <div className="text-center pt-2">
                    <div className="mx-auto w-fit">
                      <QRCodeCanvas
                        value={`${window.location.origin}/checkout?id=${visitorId}`}
                        size={88}
                        level="M"
                        includeMargin={false}
                        bgColor="#ffffff"
                        fgColor="#2563eb"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Scan for check-out</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 pt-4 text-center">
                  <p className="text-xs text-slate-500">Please wear this badge visibly at all times</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visitor Details & Actions */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Visitor Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-800">{visitorData.name}</p>
                      <p className="text-sm text-slate-600">Full Name</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-800">{visitorData.email}</p>
                      <p className="text-sm text-slate-600">Email Address</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-800">{visitorData.phone}</p>
                      <p className="text-sm text-slate-600">Phone Number</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-800">{visitorData.company}</p>
                      <p className="text-sm text-slate-600">Company Visiting</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="font-medium text-slate-800 mb-1">Purpose of Visit:</p>
                    <p className="text-slate-600">{visitorData.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button variant="kiosk" onClick={handlePrint} className="w-full h-12 text-lg">
                    <Printer className="mr-2 h-5 w-5" />
                    Print Badge
                  </Button>

                  <Button variant="outline" onClick={handleDownload} className="w-full h-12 text-lg">
                    <Download className="mr-2 h-5 w-5" />
                    Download Badge
                  </Button>

                  <Button variant="secondary" onClick={handleNewVisitor} className="w-full h-12 text-lg">
                    Register New Visitor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => navigate("/visitor/photo")} className="h-12 px-8">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </Button>

        <Button variant="admin" onClick={() => navigate("/admin")} className="h-12 px-8">
            Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisitorCard;
