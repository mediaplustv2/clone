import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, Search, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Service } from "@shared/schema";
import { SiGoogle, SiTinder, SiPaypal, SiUber, SiX, SiFacebook, SiAmazon, SiWhatsapp, SiInstagram, SiLinkedin } from "react-icons/si";

export default function Services() {
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

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

  // Fetch services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    enabled: isAuthenticated,
  });

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

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    service.isActive
  );

  const iconMap: Record<string, any> = {
    google: SiGoogle,
    tinder: SiTinder,
    paypal: SiPaypal,
    uber: SiUber,
    twitter: SiX,
    facebook: SiFacebook,
    amazon: SiAmazon,
    whatsapp: SiWhatsapp,
    instagram: SiInstagram,
    linkedin: SiLinkedin,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Phone className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">TextVerified</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono" data-testid="badge-balance">
                ${parseFloat(user.creditBalance || "0").toFixed(2)}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Select a Service
          </h1>
          <p className="text-muted-foreground">
            Choose from 900+ supported services for phone verification
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-services"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No services found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            filteredServices.map((service) => {
              const IconComponent = iconMap[service.slug] || Phone;
              return (
                <Card 
                  key={service.id} 
                  className="hover-elevate flex flex-col"
                  data-testid={`card-service-${service.slug}`}
                >
                  <CardHeader className="flex-1 flex flex-col items-center justify-center p-6">
                    <IconComponent className="w-12 h-12 mb-3 text-foreground/80" />
                    <CardTitle className="text-center text-sm">{service.name}</CardTitle>
                  </CardHeader>
                  <CardFooter className="flex flex-col gap-2 p-4 pt-0">
                    <p className="text-xs text-center font-mono text-muted-foreground" data-testid={`text-price-${service.slug}`}>
                      ${parseFloat(service.basePrice).toFixed(2)}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => setLocation(`/verification?service=${service.id}`)}
                      data-testid={`button-get-number-${service.slug}`}
                    >
                      Get Number
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
