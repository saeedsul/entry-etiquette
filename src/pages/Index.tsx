import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Clock, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SecureVisit</h1>
              <p className="text-sm text-muted-foreground">Visitor Management System</p>
            </div>
          </div>
          <Button 
            variant="admin" 
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Admin
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Welcome to Our Office
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Please register your visit to ensure a smooth and secure check-in process. 
            The registration takes less than 2 minutes.
          </p>
        </div>

        {/* Main Action Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold mb-4">Start Your Visit</CardTitle>
              <p className="text-white/90 text-lg">
                Register as a visitor and receive your digital badge
              </p>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/visitor/register")}
                className="bg-black text-orange-500 hover:bg-black/90 border-0 h-16 px-12 text-xl font-semibold shadow-lg"
              >
                <Users className="mr-3 h-6 w-6" />
                Register as Visitor
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Quick Registration</h3>
              <p className="text-muted-foreground">
                Complete your visitor registration in under 2 minutes with our streamlined process.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Safe</h3>
              <p className="text-muted-foreground">
                Your information is protected and securely stored in compliance with privacy regulations.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Host Notification</h3>
              <p className="text-muted-foreground">
                Your host will be automatically notified when you complete registration.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-card rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h4 className="font-semibold text-foreground mb-2">Enter Details</h4>
              <p className="text-sm text-muted-foreground">Provide your contact information and visit purpose</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h4 className="font-semibold text-foreground mb-2">Select Company</h4>
              <p className="text-sm text-muted-foreground">Choose the company and employee you're visiting</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h4 className="font-semibold text-foreground mb-2">Take Photo</h4>
              <p className="text-sm text-muted-foreground">Capture a clear photo for your visitor badge</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h4 className="font-semibold text-foreground mb-2">Get Badge</h4>
              <p className="text-sm text-muted-foreground">Receive your digital visitor badge to print or display</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-slate-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">
            For assistance, please contact the reception desk or building security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
