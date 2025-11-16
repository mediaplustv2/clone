import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Calendar, CreditCard, Check, Star, ArrowDown, Mail, MessageCircle } from "lucide-react";
import { SiGoogle, SiTinder, SiPaypal, SiUber, SiFacebook, SiAmazon, SiWhatsapp, SiX } from "react-icons/si";

export default function Landing() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">TextVerified</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium text-muted-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md"
                data-testid="link-features"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="text-sm font-medium text-muted-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md"
                data-testid="link-pricing"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium text-muted-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md"
                data-testid="link-faq"
              >
                FAQ
              </button>
            </nav>

            <div className="flex items-center gap-3">
              {/* Check if user is authenticated */}
              <Button 
                variant="ghost" 
                asChild
                data-testid="button-signin"
              >
                <a href="/dashboard">Dashboard</a>
              </Button>
              <Button 
                asChild
                data-testid="button-signup"
              >
                <a href="/api/login">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" data-testid="text-hero-title">
            Don't want to give out your phone number?
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8" data-testid="text-hero-subtitle">
            No Problem. <span className="text-primary">Use Ours.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Get instant US phone numbers for SMS and voice verification. Works with Google, Tinder, PayPal, and 900+ services.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild className="px-8" data-testid="button-hero-signup">
              <a href="/api/login">Get Started</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection("features")}
              className="px-8"
              data-testid="button-hero-learn"
            >
              Learn More
            </Button>
          </div>

          <button
            onClick={() => scrollToSection("services")}
            className="animate-bounce"
            aria-label="Scroll to services"
            data-testid="button-scroll-down"
          >
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Service Showcase */}
      <section id="services" className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-services-title">
              Receive SMS & OTP From 900+ Services
            </h2>
            <p className="text-lg text-muted-foreground">Works With...</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-8">
            {[
              { Icon: SiGoogle, name: "Google" },
              { Icon: SiTinder, name: "Tinder" },
              { Icon: SiPaypal, name: "PayPal" },
              { Icon: SiUber, name: "Uber" },
              { Icon: SiX, name: "X (Twitter)" },
              { Icon: SiFacebook, name: "Facebook" },
              { Icon: SiAmazon, name: "Amazon" },
              { Icon: SiWhatsapp, name: "WhatsApp" },
            ].map(({ Icon, name }) => (
              <Card key={name} className="hover-elevate flex items-center justify-center p-6" data-testid={`card-service-${name.toLowerCase()}`}>
                <div className="text-center">
                  <Icon className="w-12 h-12 mx-auto mb-2 text-foreground/80" />
                  <p className="text-sm font-medium">{name}</p>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground">And hundreds more...</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-features-title">
              Real US mobile numbers backed by physical SIMs
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Compatible with all platforms. Protect your personal information from data breaches and companies who resell your information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8" data-testid="card-feature-sms">
              <CardHeader className="p-0 mb-4">
                <MessageSquare className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Text/SMS</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  Choose a service and immediately access a phone number to receive a verification code.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8" data-testid="card-feature-voice">
              <CardHeader className="p-0 mb-4">
                <Phone className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Voice</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  We offer voice numbers for services which require verification via phone call.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8" data-testid="card-feature-rentals">
              <CardHeader className="p-0 mb-4">
                <Calendar className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Number Rentals</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  For those who need to maintain access to a number we offer rentals for varying length terms.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8" data-testid="card-feature-payments">
              <CardHeader className="p-0 mb-4">
                <CreditCard className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Easy Payments</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-base">
                  We accept all major credit/debit cards and a variety of major cryptocurrencies.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 lg:py-32 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-pricing-title">
              Great products, simple pricing.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Purchase credits using our secure payment options and use the products that fit your needs best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Verifications */}
            <Card className="flex flex-col" data-testid="card-pricing-verifications">
              <CardHeader>
                <CardTitle className="text-2xl">Verifications</CardTitle>
                <CardDescription>
                  Receive an SMS one-time-code (OTP) or respond to a voice call to register for ANY service.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Starting at...</p>
                  <p className="text-4xl font-bold">$0.25 <span className="text-base font-normal text-muted-foreground">/ verification</span></p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Get a Non-VoIP US phone number",
                    "Register for any online service",
                    "Short-term phone number reuse",
                    "Receive SMS verification codes",
                    "Respond to voice call verifications",
                    "Choose a US area code"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild data-testid="button-get-started-verifications">
                  <a href="/api/login">Get started</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Non-Renewable Rentals */}
            <Card className="flex flex-col border-primary shadow-lg" data-testid="card-pricing-non-renewable">
              <CardHeader>
                <Badge className="w-fit mb-2">Popular</Badge>
                <CardTitle className="text-2xl">Non-Renewable Rentals</CardTitle>
                <CardDescription>
                  Rent one of our phone numbers that can be used for ANY service over a period of 1 to 14 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Starting at...</p>
                  <p className="text-4xl font-bold">$1.50 <span className="text-base font-normal text-muted-foreground">/ rental</span></p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Get a Non-VoIP US phone number",
                    "Register for any online service",
                    "Verify many services on a single line",
                    "Own your number for 1 to 14 days",
                    "Receive unlimited SMS verifications",
                    "Instantly get verifications 24/7"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild data-testid="button-get-started-non-renewable">
                  <a href="/api/login">Get started</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Renewable Rentals */}
            <Card className="flex flex-col" data-testid="card-pricing-renewable">
              <CardHeader>
                <CardTitle className="text-2xl">Renewable Rentals</CardTitle>
                <CardDescription>
                  Rent one of our phone numbers that can be used for ANY service and can be kept indefinitely.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Starting at...</p>
                  <p className="text-4xl font-bold">$5 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Get a Non-VoIP US phone number",
                    "Register for any online service",
                    "Verify many services on a single line",
                    "Own your number forever",
                    "Receive unlimited SMS verifications",
                    "Instantly get verifications 24/7",
                    "Choose a US area code"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild data-testid="button-get-started-renewable">
                  <a href="/api/login">Get started</a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-4">Buy credits using a wide variety of payment methods</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {["Visa", "Mastercard", "American Express", "Bitcoin", "Ethereum", "USDC"].map((method) => (
                <Badge key={method} variant="outline" className="px-4 py-2">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-testimonials-title">
              Loved by users worldwide.
            </h2>
            <p className="text-lg text-muted-foreground">
              Get a US based non-voip phone number accessible from anywhere in the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "Literally took me 2 minutes to create a bunch of anonymous accounts for Twitter & Discord using your temporary phone verification service. Good job, guys.",
                name: "Social Media Manager",
                location: "San Francisco, USA",
                rating: 5.0
              },
              {
                quote: "This is hands down the best tool to bypass 2-factor OTP codes. Their numbers always work and the support team is great and has been super helpful.",
                name: "Digital Nomad",
                location: "Bangkok, Thailand",
                rating: 5.0
              },
              {
                quote: "I have been using renewable rentals for several weeks now. It gives me peace of mind when ordering food and rideshares to know that I'm not giving my real number to strangers!",
                name: "Privacy Advocate",
                location: "Las Vegas, USA",
                rating: 4.5
              },
              {
                quote: "Textverified provides the highest quality numbers. I like how the numbers are non-voip so I can always get SMS verifications for hard to get accounts like Tinder and Bumble.",
                name: "Online Reseller",
                location: "London, UK",
                rating: 5.0
              },
              {
                quote: "I've used their services to scale my web application quickly and reliably. They make automation easy with their API and have even given me bulk discounts for being a power user.",
                name: "Entrepreneur",
                location: "Bangladesh",
                rating: 5.0
              },
              {
                quote: "I love their disposable numbers. I use their services for everything: SMS or text verifications and voice verifications. They are super responsive when you need help with the service.",
                name: "Savvy Online Saver",
                location: "Hong Kong",
                rating: 5.0
              }
            ].map((testimonial, i) => (
              <Card key={i} className="p-6" data-testid={`card-testimonial-${i}`}>
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < Math.floor(testimonial.rating) ? 'fill-primary text-primary' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="text-sm mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 lg:py-32 bg-card/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-faq-title">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              If you can't find what you're looking for, contact our support team!
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {[
              {
                question: "Where are your numbers from?",
                answer: "Our numbers come from major US phone companies. We guarantee you can verify any service, even those that don't accept virtual numbers such as Google."
              },
              {
                question: "When do you get new numbers?",
                answer: "We restock our numbers throughout each day. If we happen to be out of a particular service, we recommend to keep checking back as we are continually restocking."
              },
              {
                question: "How long do your short-term/temporary numbers last?",
                answer: "All of our verification numbers are meant for short-term and temporary use. Once a verification has ended, the number may be removed at any time. However, we do offer long-term phone number rentals from one day to an unlimited amount of time."
              },
              {
                question: "What can I use your numbers for?",
                answer: "Our numbers can be used for virtually any online service including popular ones like Amazon, Ticketmaster, and PayPal. You can use these numbers to register for new accounts, keep your information private, and stop one-time-codes (OTP) from spamming your personal phone."
              },
              {
                question: "Do you provide an API?",
                answer: "Yes! Feel free to integrate and build your own applications using our numbers. Check our documentation for the complete API reference."
              },
              {
                question: "Are your payments secure?",
                answer: "Yes, our payments are secure and you can pay with card (using Stripe), or with a wide range of cryptocurrencies. We have been verifying since 2019 and have helped users complete millions of verifications."
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} data-testid={`accordion-faq-${i}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              <span className="font-bold">TextVerified</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 TextVerified. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
