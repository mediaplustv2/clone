import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, ArrowLeft, Copy, Check, RefreshCw, Clock } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { Progress } from "@/components/ui/progress";
import type { Service, Verification } from "@shared/schema";

export default function Verification() {
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const searchParams = useSearch();
  const serviceId = new URLSearchParams(searchParams).get('service');
  
  const [step, setStep] = useState(1); // 1: Confirm, 2: Getting Number, 3: Waiting for Code
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [currentVerification, setCurrentVerification] = useState<Verification | null>(null);

  // Fetch service details
  const { data: service } = useQuery<Service>({
    queryKey: ["/api/services", serviceId],
    enabled: !!serviceId && isAuthenticated,
  });

  // Create verification mutation
  const createVerificationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/verifications", { serviceId });
    },
    onSuccess: (data: Verification) => {
      setCurrentVerification(data);
      setStep(3);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/verifications"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to create verification",
        variant: "destructive",
      });
      setStep(1);
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Timer countdown
  useEffect(() => {
    if (step === 3 && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeRemaining]);

  const handleCopyNumber = () => {
    if (currentVerification?.phoneNumber) {
      navigator.clipboard.writeText(currentVerification.phoneNumber);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Phone number copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGetNumber = () => {
    setStep(2);
    createVerificationMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/services">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Phone className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">TextVerified</span>
              </div>
            </div>
            
            <Badge variant="outline" className="font-mono" data-testid="badge-balance">
              ${parseFloat(user.creditBalance || "0").toFixed(2)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[
              { num: 1, label: "Confirm Service" },
              { num: 2, label: "Get Number" },
              { num: 3, label: "Receive Code" }
            ].map(({ num, label }) => (
              <div key={num} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                  step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`} data-testid={`step-${num}`}>
                  {num}
                </div>
                <span className="text-xs text-center">{label}</span>
              </div>
            ))}
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        {/* Step 1: Confirm */}
        {step === 1 && (
          <Card data-testid="card-step-1">
            <CardHeader>
              <CardTitle>Confirm Service</CardTitle>
              <CardDescription>
                You're about to get a verification number for this service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Service</span>
                  <span className="text-muted-foreground">{service?.name || "Loading..."}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Type</span>
                  <Badge>SMS Verification</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cost</span>
                  <span className="font-mono">${service ? parseFloat(service.basePrice).toFixed(2) : "0.00"}</span>
                </div>
              </div>

              <div className="bg-accent/50 border border-accent p-4 rounded-lg">
                <p className="text-sm">
                  ⚠️ You will have <strong>5 minutes</strong> to use this number. If you don't receive a code, you'll get a full refund automatically.
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={handleGetNumber}
                disabled={!service || createVerificationMutation.isPending}
                data-testid="button-confirm-purchase"
              >
                {createVerificationMutation.isPending ? "Processing..." : `Confirm & Get Number ($${service ? parseFloat(service.basePrice).toFixed(2) : "0.00"})`}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Getting Number */}
        {step === 2 && (
          <Card data-testid="card-step-2">
            <CardHeader>
              <CardTitle>Getting Your Number</CardTitle>
              <CardDescription>
                Please wait while we assign you a phone number...
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center">
                <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Finding available number...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Waiting for Code */}
        {step === 3 && (
          <Card data-testid="card-step-3">
            <CardHeader>
              <CardTitle>Your Verification Number</CardTitle>
              <CardDescription>
                Use this number to receive your verification code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phone Number Display */}
              <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your Phone Number</p>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-3xl font-bold font-mono" data-testid="text-phone-number">
                    {currentVerification?.phoneNumber || "Loading..."}
                  </p>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyNumber}
                    data-testid="button-copy-number"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Time Remaining</span>
                </div>
                <span className="text-2xl font-mono font-bold" data-testid="text-timer">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Code Display */}
              <div className="p-6 border-2 border-dashed rounded-lg">
                {currentVerification?.code ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">Verification Code Received</p>
                    <p className="text-4xl font-bold font-mono text-center text-primary" data-testid="text-verification-code">
                      {currentVerification.code}
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-pulse mb-4">
                      <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4" />
                      <div className="h-4 bg-muted rounded-w-48 mx-auto" />
                    </div>
                    <p className="text-muted-foreground">Waiting for SMS code...</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      The code will appear here automatically when received
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-semibold">
                      Note: Demo mode - Third-party SMS API needs to be configured
                    </p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-accent/50 border border-accent p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Instructions:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Copy the phone number above</li>
                  <li>Enter it in the service you're verifying</li>
                  <li>Wait for the code to appear (usually within 30 seconds)</li>
                  <li>Enter the code to complete verification</li>
                </ol>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                asChild
                data-testid="button-back-to-services"
              >
                <Link href="/services">Back to Services</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
