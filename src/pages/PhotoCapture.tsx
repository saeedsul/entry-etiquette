import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, RotateCcw, ArrowLeft, ArrowRight, User } from "lucide-react";

const PhotoCapture = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please ensure camera permissions are granted.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const photoData = canvas.toDataURL("image/jpeg", 0.8);
        setPhoto(photoData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const handleNext = () => {
    if (photo) {
      localStorage.setItem("visitorPhoto", photo);
      navigate("/visitor/card");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Photo Capture</h1>
          <p className="text-muted-foreground">Please take a clear photo for your visitor badge</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Visitor Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Camera/Photo Display */}
              <div className="relative w-full max-w-lg">
                <div className="bg-slate-100 rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center">
                  {photo ? (
                    <img 
                      src={photo} 
                      alt="Captured visitor" 
                      className="w-full h-full object-cover"
                    />
                  ) : isStreaming ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-500">
                      <User className="h-24 w-24 mx-auto mb-4 text-slate-300" />
                      <p className="text-lg">Camera preview will appear here</p>
                    </div>
                  )}
                </div>
                
                {/* Camera guidelines overlay */}
                {isStreaming && !photo && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-white/50 rounded-lg"></div>
                    <div className="absolute top-4 left-4 right-4 text-center">
                      <p className="text-white bg-black/50 px-3 py-1 rounded text-sm">
                        Position your face within the frame
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex flex-col items-center space-y-4">
                {!isStreaming && !photo && (
                  <Button 
                    variant="kiosk" 
                    onClick={startCamera}
                    className="h-12 px-8 text-lg"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Start Camera
                  </Button>
                )}

                {isStreaming && !photo && (
                  <Button 
                    variant="kiosk" 
                    onClick={capturePhoto}
                    className="h-12 px-8 text-lg"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Capture Photo
                  </Button>
                )}

                {photo && (
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={retakePhoto}
                      className="h-12 px-6"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Retake
                    </Button>
                    <Button 
                      variant="kiosk" 
                      onClick={handleNext}
                      className="h-12 px-6"
                    >
                      Use This Photo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <Button 
                variant="outline" 
                onClick={() => navigate("/visitor/register")}
                className="h-12 px-8"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              
              {photo && (
                <Button 
                  variant="kiosk" 
                  onClick={handleNext}
                  className="h-12 px-8"
                >
                  Generate Badge
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default PhotoCapture;