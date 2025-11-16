import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, DollarSign, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { PricingSetting } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch pricing settings
  const { data: pricingSettings, isLoading: loadingPricing } = useQuery<PricingSetting[]>({
    queryKey: ["/api/settings/pricing"],
    enabled: isAuthenticated,
  });

  // Pricing update mutation
  const updatePricingMutation = useMutation({
    mutationFn: async ({ serviceType, basePrice }: { serviceType: string; basePrice: string }) => {
      return await apiRequest("PUT", `/api/settings/pricing/${serviceType}`, { basePrice });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/pricing"] });
      toast({
        title: "Success",
        description: "Pricing updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update pricing",
        variant: "destructive",
      });
    },
  });

  const handlePricingUpdate = (serviceType: string, value: string) => {
    updatePricingMutation.mutate({ serviceType, basePrice: value });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Admin Settings</h1>
                <p className="text-sm text-muted-foreground">
                  Manage pricing, API configuration, and services
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Logged in as {user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pricing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="pricing" data-testid="tab-pricing">
              <DollarSign className="w-4 h-4 mr-2" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="api" data-testid="tab-api">
              <MessageSquare className="w-4 h-4 mr-2" />
              SMS API
            </TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">
              <Settings className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
          </TabsList>

          {/* Pricing Settings Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Configuration</CardTitle>
                <CardDescription>
                  Update pricing for verifications and rentals. Changes take effect immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingPricing ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pricingSettings?.map((setting) => (
                      <PricingSettingItem
                        key={setting.id}
                        setting={setting}
                        onUpdate={handlePricingUpdate}
                        isUpdating={updatePricingMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMS API Configuration Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Third-Party SMS API Configuration</CardTitle>
                <CardDescription>
                  Configure your SMS service provider credentials and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-accent/50 border border-accent p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">⚠️ Configuration Instructions</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    To integrate your third-party SMS API, you need to add the following environment variables to your Replit project:
                  </p>
                  <div className="bg-background p-3 rounded border font-mono text-xs space-y-1">
                    <div>SMS_API_KEY=your_api_key_here</div>
                    <div>SMS_API_URL=https://api.your-sms-provider.com</div>
                    <div>SMS_API_SECRET=your_api_secret_here</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>SMS API Provider</Label>
                    <Input
                      placeholder="e.g., Twilio, TextVerified, etc."
                      disabled
                      data-testid="input-api-provider"
                    />
                    <p className="text-xs text-muted-foreground">
                      Set via environment variable: SMS_API_PROVIDER
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      placeholder="Configured via environment variable"
                      disabled
                      data-testid="input-api-key"
                    />
                    <p className="text-xs text-muted-foreground">
                      Set via environment variable: SMS_API_KEY
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>API URL</Label>
                    <Input
                      placeholder="Configured via environment variable"
                      disabled
                      data-testid="input-api-url"
                    />
                    <p className="text-xs text-muted-foreground">
                      Set via environment variable: SMS_API_URL
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">📝 Integration Code Location</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Update the SMS API integration code in the following files:
                  </p>
                  <ul className="text-xs font-mono space-y-1 text-muted-foreground">
                    <li>• server/routes.ts (line 139-143 for verifications)</li>
                    <li>• server/routes.ts (line 243-245 for rentals)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    Replace the TODO comments with your actual SMS API client calls.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Management Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services Management</CardTitle>
                <CardDescription>
                  Manage available services for phone verification (900+ platforms)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/50 border border-accent p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">ℹ️ Current Services</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Services are currently seeded from the database. To add, edit, or remove services:
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                    <li>Update the seed data in <code className="bg-background px-1 rounded">server/seed.ts</code></li>
                    <li>Run the seed script to update the database</li>
                    <li>Or use the database panel to directly edit the <code className="bg-background px-1 rounded">services</code> table</li>
                  </ol>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    A full services CRUD interface can be added here in the future if needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Pricing Setting Item Component
function PricingSettingItem({
  setting,
  onUpdate,
  isUpdating,
}: {
  setting: PricingSetting;
  onUpdate: (serviceType: string, value: string) => void;
  isUpdating: boolean;
}) {
  const [price, setPrice] = useState(setting.basePrice);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(setting.serviceType, price);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPrice(setting.basePrice);
    setIsEditing(false);
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case "verification":
        return "SMS Verification";
      case "non_renewable_rental":
        return "Non-Renewable Rental (7 days)";
      case "renewable_rental":
        return "Renewable Rental (30 days)";
      default:
        return type;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg" data-testid={`pricing-item-${setting.serviceType}`}>
      <div className="flex-1">
        <h3 className="font-medium">{getServiceTypeLabel(setting.serviceType)}</h3>
        {setting.description && (
          <p className="text-sm text-muted-foreground">{setting.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isEditing ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-24"
                data-testid={`input-price-${setting.serviceType}`}
              />
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating}
              data-testid={`button-save-${setting.serviceType}`}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isUpdating}
              data-testid={`button-cancel-${setting.serviceType}`}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <span className="font-mono text-lg font-semibold" data-testid={`text-current-price-${setting.serviceType}`}>
              ${parseFloat(setting.basePrice).toFixed(2)}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              data-testid={`button-edit-${setting.serviceType}`}
            >
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
