import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Building, Users } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  employee: string;
  purpose: string;
}

const companies = [
  { id: "1", name: "TechCorp Inc", employees: ["Sarah Johnson", "Mike Chen", "Anna Williams"] },
  { id: "2", name: "Design Studio", employees: ["Michael Brown", "Jessica Miller", "David Wilson"] },
  { id: "3", name: "Marketing Solutions", employees: ["Lisa Garcia", "Tom Anderson", "Rachel Lee"] },
  { id: "4", name: "Innovation Labs", employees: ["Alex Rodriguez", "Emma Thompson", "James Park"] }
];

const VisitorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    employee: "",
    purpose: ""
  });

  const selectedCompany = companies.find(c => c.name === formData.company);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === "company" ? { employee: "" } : {})
    }));
  };

  const handleNext = () => {
    // Store form data in localStorage for the photo capture page
    localStorage.setItem("visitorData", JSON.stringify(formData));
    navigate("/visitor/photo");
  };

  const isFormValid = formData.name && formData.email && formData.phone && 
                      formData.company && formData.employee && formData.purpose;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Visitor Registration</h1>
          <p className="text-muted-foreground">Please fill in your details to register your visit</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Company Visiting *</Label>
                <Select value={formData.company} onValueChange={(value) => handleInputChange("company", value)}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.name}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {company.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Employee to Visit *</Label>
                <Select 
                  value={formData.employee} 
                  onValueChange={(value) => handleInputChange("employee", value)}
                  disabled={!formData.company}
                >
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCompany?.employees.map((employee) => (
                      <SelectItem key={employee} value={employee}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {employee}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-slate-700 font-medium">Purpose of Visit *</Label>
              <Textarea
                id="purpose"
                placeholder="Please describe the purpose of your visit..."
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                className="min-h-24 text-lg"
              />
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => navigate("/")} className="h-12 px-8">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              <Button 
                variant="kiosk" 
                onClick={handleNext}
                disabled={!isFormValid}
                className="h-12 px-8"
              >
                Next: Take Photo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorRegistration;