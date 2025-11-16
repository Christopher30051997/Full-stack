import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gem, Heart, Flame, Bitcoin, Shield } from "lucide-react";
import { SiBitcoin, SiEthereum, SiTether } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

const FREE_FIRE_TIERS = [
  { tier: 1, amount: 100, cost: 500, label: "Starter Pack" },
  { tier: 2, amount: 500, cost: 2000, label: "Popular Pack" },
  { tier: 3, amount: 1000, cost: 3500, label: "Premium Pack" },
];

const GAME_LIVES_TIERS = [
  { tier: 1, amount: 5, cost: 100, label: "5 Lives" },
  { tier: 2, amount: 10, cost: 180, label: "10 Lives" },
  { tier: 3, amount: 25, cost: 400, label: "25 Lives" },
  { tier: 4, amount: 50, cost: 750, label: "50 Lives" },
];

const GEMASGO_TIERS = [
  { tier: 1, amount: 1000, cost: "$10 USDT", label: "Starter Package" },
  { tier: 2, amount: 5000, cost: "$45 USDT", label: "Popular Package" },
  { tier: 3, amount: 10000, cost: "$85 USDT", label: "Premium Package" },
];

export default function Store() {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handlePurchase = (item: any, type: string) => {
    if (type === "gemasgo") {
      setSelectedPurchase({ ...item, type });
      setShowConfirmDialog(true);
    } else {
      if (user && user.gemasGoPoints >= item.cost) {
        setUser({ ...user, gemasGoPoints: user.gemasGoPoints - item.cost });
        
        if (type === "lives") {
          setUser({ ...user, gameLives: user.gameLives + item.amount, gemasGoPoints: user.gemasGoPoints - item.cost });
        }
        
        toast({
          title: t("success"),
          description: `Successfully purchased ${item.label}!`,
        });
      } else {
        toast({
          title: t("error"),
          description: "Not enough GemasGo points!",
          variant: "destructive",
        });
      }
    }
  };

  const confirmPurchase = () => {
    toast({
      title: t("pending"),
      description: "Your purchase request has been submitted. Admin will process it shortly.",
    });
    setShowConfirmDialog(false);
    setSelectedPurchase(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          {t("store")}
        </h1>
        <p className="text-muted-foreground">
          Redeem your GemasGo points for exciting rewards or purchase more points with crypto
        </p>
      </div>

      <Tabs defaultValue="free-fire" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="free-fire" data-testid="tab-free-fire">
            <Flame className="w-4 h-4 mr-2" />
            {t("freeFireDiamonds")}
          </TabsTrigger>
          <TabsTrigger value="lives" data-testid="tab-lives">
            <Heart className="w-4 h-4 mr-2" />
            {t("buyGameLives")}
          </TabsTrigger>
          <TabsTrigger value="buy-gemasgo" data-testid="tab-buy-gemasgo">
            <Gem className="w-4 h-4 mr-2" />
            {t("buyGemasGo")}
          </TabsTrigger>
          <TabsTrigger value="receipts" data-testid="tab-receipts">
            <Shield className="w-4 h-4 mr-2" />
            {t("paymentReceipts")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="free-fire" className="space-y-6">
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                Free Fire Diamond Redemption
              </CardTitle>
              <CardDescription>
                Exchange your GemasGo points for Free Fire diamonds
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FREE_FIRE_TIERS.map((tier) => (
              <Card key={tier.tier} className="hover-elevate active-elevate-2" data-testid={`card-ff-tier-${tier.tier}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-serif">{tier.label}</CardTitle>
                    <Badge variant="secondary">{t("tier", { tier: tier.tier })}</Badge>
                  </div>
                  <CardDescription>
                    {tier.amount} Free Fire Diamonds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cost:</span>
                      <span className="text-2xl font-mono font-bold text-primary">
                        {tier.cost}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">You get:</span>
                      <span className="text-xl font-mono font-bold">
                        {tier.amount} 💎
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(tier, "freeFire")}
                    disabled={!user || user.gemasGoPoints < tier.cost}
                    data-testid={`button-redeem-ff-${tier.tier}`}
                  >
                    {t("redeem")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lives" className="space-y-6">
          <Card className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Game Lives
              </CardTitle>
              <CardDescription>
                Purchase extra lives to keep playing your favorite games
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GAME_LIVES_TIERS.map((tier) => (
              <Card key={tier.tier} className="hover-elevate active-elevate-2" data-testid={`card-lives-tier-${tier.tier}`}>
                <CardHeader>
                  <CardTitle className="font-serif">{tier.label}</CardTitle>
                  <CardDescription>
                    Continue gaming without interruption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cost:</span>
                      <span className="text-2xl font-mono font-bold text-primary">
                        {tier.cost}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Lives:</span>
                      <span className="text-xl font-mono font-bold text-red-500">
                        +{tier.amount}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(tier, "lives")}
                    disabled={!user || user.gemasGoPoints < tier.cost}
                    data-testid={`button-buy-lives-${tier.tier}`}
                  >
                    {t("purchase")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="buy-gemasgo" className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                <Gem className="w-6 h-6 text-primary" />
                Buy GemasGo with Cryptocurrency
              </CardTitle>
              <CardDescription>
                Purchase GemasGo points using USDT, Bitcoin, Ethereum, or Binance Coin
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GEMASGO_TIERS.map((tier) => (
              <Card key={tier.tier} className="hover-elevate active-elevate-2" data-testid={`card-gemasgo-tier-${tier.tier}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-serif">{tier.label}</CardTitle>
                    <Badge variant="default">{tier.tier === 2 ? "Popular" : tier.tier === 3 ? "Best Value" : "Basic"}</Badge>
                  </div>
                  <CardDescription>
                    Get {tier.amount.toLocaleString()} GemasGo points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price:</span>
                      <span className="text-2xl font-mono font-bold">
                        {tier.cost}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Points:</span>
                      <span className="text-xl font-mono font-bold text-primary">
                        {tier.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-center pt-2">
                      <SiTether className="w-6 h-6 text-green-500" />
                      <SiBitcoin className="w-6 h-6 text-orange-500" />
                      <SiEthereum className="w-6 h-6 text-blue-500" />
                      <Bitcoin className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handlePurchase(tier, "gemasgo")}
                    data-testid={`button-buy-gemasgo-${tier.tier}`}
                  >
                    {t("purchase")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Payment Receipts
              </CardTitle>
              <CardDescription>
                View payment confirmations and receipts from admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 space-y-4">
                <Shield className="w-16 h-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  No receipts yet. When you purchase GemasGo with crypto, the admin will send you a payment confirmation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent data-testid="dialog-purchase-confirmation">
          <DialogHeader>
            <DialogTitle>Confirm Crypto Purchase</DialogTitle>
            <DialogDescription>
              Your purchase request will be sent to the admin for processing
            </DialogDescription>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Package:</span>
                  <span className="font-medium">{selectedPurchase.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">GemasGo Points:</span>
                  <span className="font-mono font-bold text-primary">{selectedPurchase.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="font-mono font-bold">{selectedPurchase.cost}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The admin will send you payment instructions and a receipt once your purchase is confirmed.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPurchase} data-testid="button-confirm-purchase">
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
