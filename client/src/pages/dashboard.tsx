import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard, History, Phone, Calendar, Settings, LogOut, Plus, Copy, Check } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User, Transaction, Verification, Rental } from "@shared/schema";
import { format } from "date-fns";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState("10");

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

  // Fetch transactions
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
  });

  // Fetch active rentals
  const { data: rentals = [] } = useQuery<Rental[]>({
    queryKey: ["/api/rentals"],
    enabled: isAuthenticated,
  });

  // Fetch recent verifications
  const { data: verifications = [] } = useQuery<Verification[]>({
    queryKey: ["/api/verifications"],
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

  const creditBalance = parseFloat(user.creditBalance || "0");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">TextVerified</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild data-testid="button-settings">
                <a href="/admin">
                  <Settings className="w-5 h-5" />
                </a>
              </Button>
              <Button variant="ghost" asChild data-testid="button-logout">
                <a href="/api/logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
            Welcome back{user.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Manage your verifications, rentals, and account credits
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Credit Balance */}
          <Card data-testid="card-credit-balance">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-balance-amount">
                ${creditBalance.toFixed(2)}
              </div>
              <Dialog open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4 w-full" data-testid="button-buy-credits">
                    <Plus className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-buy-credits">
                  <DialogHeader>
                    <DialogTitle>Buy Credits</DialogTitle>
                    <DialogDescription>
                      Add credits to your account to purchase verifications and rentals
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="5"
                        step="5"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        placeholder="10"
                        data-testid="input-credit-amount"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["10", "25", "50"].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => setCreditAmount(amount)}
                          data-testid={`button-preset-${amount}`}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full" data-testid="button-proceed-payment">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Payments are processed securely through Stripe
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Active Rentals */}
          <Card data-testid="card-active-rentals">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-rentals-count">
                {rentals.filter(r => r.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Phone numbers you're currently renting
              </p>
            </CardContent>
          </Card>

          {/* Recent Verifications */}
          <Card data-testid="card-recent-verifications">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verifications Today</CardTitle>
              <Phone className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-verifications-count">
                {verifications.filter(v => {
                  const today = new Date();
                  const created = new Date(v.createdAt);
                  return created.toDateString() === today.toDateString();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Successful verifications today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Rentals Table */}
        {rentals.filter(r => r.status === 'active').length > 0 && (
          <Card className="mb-8" data-testid="card-rentals-table">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Active Rentals
              </CardTitle>
              <CardDescription>
                Your currently rented phone numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentals.filter(r => r.status === 'active').map((rental) => (
                    <TableRow key={rental.id} data-testid={`row-rental-${rental.id}`}>
                      <TableCell className="font-mono" data-testid={`text-phone-${rental.id}`}>
                        {rental.phoneNumber}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rental.type === 'renewable' ? 'default' : 'secondary'}>
                          {rental.type === 'renewable' ? 'Renewable' : 'Non-Renewable'}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`text-expires-${rental.id}`}>
                        {format(new Date(rental.expiresAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" data-testid={`button-copy-${rental.id}`}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        <Card data-testid="card-transaction-history">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <CardDescription>
              Your recent credit purchases and usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Purchase credits to get started
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id} data-testid={`row-transaction-${transaction.id}`}>
                      <TableCell data-testid={`text-date-${transaction.id}`}>
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'purchase' ? 'default' : 'secondary'}>
                          {transaction.type === 'purchase' ? 'Purchase' : 'Deduction'}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`text-description-${transaction.id}`}>
                        {transaction.description}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${transaction.type === 'purchase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} data-testid={`text-amount-${transaction.id}`}>
                        {transaction.type === 'purchase' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
