import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Gem, Sparkles } from "lucide-react";

export default function Ads() {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    if (showAd && adCountdown > 0) {
      const timer = setTimeout(() => {
        setAdCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showAd && adCountdown === 0) {
      setCanSkip(true);
    }
  }, [showAd, adCountdown]);

  const handleWatchAd = () => {
    setShowAd(true);
    setAdCountdown(5);
    setCanSkip(false);
  };

  const handleSkipAd = () => {
    if (canSkip) {
      // Calculate earnings: simulate ad value of 100, user gets 20%, admin gets 80%
      const adValue = 100;
      const userEarning = Math.floor(adValue * 0.2);
      setEarnedPoints(userEarning);
      
      if (user) {
        setUser({ ...user, gemasGoPoints: user.gemasGoPoints + userEarning });
      }
      
      setShowAd(false);
      setShowEarnings(true);
      
      setTimeout(() => {
        setShowEarnings(false);
      }, 3000);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          {t("ads")}
        </h1>
        <p className="text-muted-foreground">
          Watch advertisements to earn GemasGo points. You earn 20% of each ad value!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              How It Works
            </CardTitle>
            <CardDescription className="text-base">
              Our intelligent system automatically calculates your earnings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Watch Advertisements</p>
                  <p className="text-sm text-muted-foreground">
                    Click the button below to start watching ads
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Earn GemasGo Points</p>
                  <p className="text-sm text-muted-foreground">
                    You receive 20% of each ad value
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Automatic Distribution</p>
                  <p className="text-sm text-muted-foreground">
                    AI calculates and credits points instantly
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="font-medium">Redeem Rewards</p>
                  <p className="text-sm text-muted-foreground">
                    Use your points in the store
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={handleWatchAd} data-testid="card-watch-ad">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-serif">{t("watchAd")}</CardTitle>
            <CardDescription>
              Earn 20 GemasGo points per ad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" data-testid="button-watch-ad">
              <Gem className="w-4 h-4 mr-2" />
              Start Watching
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Your Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ads Watched Today</span>
              <span className="font-mono font-bold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Points Earned Today</span>
              <span className="font-mono font-bold text-primary">240</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Earnings</span>
              <span className="font-mono font-bold text-primary">{user?.gemasGoPoints || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Earnings Split</CardTitle>
            <CardDescription>Transparent distribution system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your Share</span>
                <span className="font-mono font-bold text-primary">20%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Platform Share</span>
                <span className="font-mono font-bold">80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Dialog */}
      <Dialog open={showAd} onOpenChange={setShowAd}>
        <DialogContent className="sm:max-w-2xl" data-testid="dialog-ad">
          <DialogHeader>
            <DialogTitle>{t("watchAd")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium">Advertisement Playing</p>
                <p className="text-sm text-muted-foreground">
                  {canSkip ? t("skipAd") : t("adCountdown", { seconds: adCountdown })}
                </p>
                <Progress value={((5 - adCountdown) / 5) * 100} />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleSkipAd}
              disabled={!canSkip}
              data-testid="button-skip-ad"
            >
              {canSkip ? t("skipAd") : t("adCountdown", { seconds: adCountdown })}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Earnings Notification */}
      <Dialog open={showEarnings} onOpenChange={setShowEarnings}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-earnings">
          <div className="text-center space-y-4 py-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Gem className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-bold">
              {t("earnedPoints", { points: earnedPoints })}
            </h3>
            <p className="text-muted-foreground">
              Keep watching ads to earn more GemasGo points!
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ad Value:</span>
                <span className="font-mono">100 points</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Your Share (20%):</span>
                <span className="font-mono font-bold text-primary">{earnedPoints} points</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Platform Share (80%):</span>
                <span className="font-mono">80 points</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
