import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Gamepad2 } from "lucide-react";
import puzzleImage from "@assets/generated_images/Puzzle_blocks_game_thumbnail_ae1aac58.png";
import spaceImage from "@assets/generated_images/Space_shooter_game_thumbnail_84e7d836.png";
import candyImage from "@assets/generated_images/Candy_match_game_thumbnail_77257d62.png";
import racingImage from "@assets/generated_images/Racing_game_thumbnail_11a10b87.png";
import towerImage from "@assets/generated_images/Tower_defense_game_thumbnail_4a9a7a20.png";
import platformImage from "@assets/generated_images/Platform_adventure_game_thumbnail_6341b6b4.png";

const GAMES = [
  {
    id: "1",
    title: "Puzzle Master",
    description: "Match colorful blocks and solve challenging puzzles",
    thumbnailUrl: puzzleImage,
    gameUrl: "https://example.com/puzzle",
    isActive: true,
  },
  {
    id: "2",
    title: "Space Shooter",
    description: "Defend the galaxy from alien invaders",
    thumbnailUrl: spaceImage,
    gameUrl: "https://example.com/space",
    isActive: true,
  },
  {
    id: "3",
    title: "Candy Match",
    description: "Sweet matching puzzle adventure",
    thumbnailUrl: candyImage,
    gameUrl: "https://example.com/candy",
    isActive: true,
  },
  {
    id: "4",
    title: "Speed Racer",
    description: "Race through neon highways",
    thumbnailUrl: racingImage,
    gameUrl: "https://example.com/racing",
    isActive: true,
  },
  {
    id: "5",
    title: "Tower Defense",
    description: "Build towers and defend your kingdom",
    thumbnailUrl: towerImage,
    gameUrl: "https://example.com/tower",
    isActive: true,
  },
  {
    id: "6",
    title: "Platform Adventure",
    description: "Jump and explore colorful worlds",
    thumbnailUrl: platformImage,
    gameUrl: "https://example.com/platform",
    isActive: true,
  },
];

export default function Games() {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();
  const [selectedGame, setSelectedGame] = useState<typeof GAMES[0] | null>(null);
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [gamesPlayedCount, setGamesPlayedCount] = useState(0);
  const [showEarnings, setShowEarnings] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const handlePlayGame = (game: typeof GAMES[0]) => {
    if (user && user.gameLives > 0) {
      // Check if we need to show ad (every 3 games)
      if (gamesPlayedCount > 0 && gamesPlayedCount % 3 === 0) {
        setShowAd(true);
        setAdCountdown(5);
        setCanSkip(false);
        setSelectedGame(game);
      } else {
        setSelectedGame(game);
        setGamesPlayedCount(prev => prev + 1);
        // Deduct a life
        setUser({ ...user, gameLives: user.gameLives - 1 });
      }
    }
  };

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

  const handleSkipAd = () => {
    if (canSkip) {
      // Calculate earnings: simulate ad value of 100, user gets 20%, admin gets 80%
      const adValue = 100;
      const userEarning = Math.floor(adValue * 0.2);
      setEarnedPoints(userEarning);
      
      if (user) {
        setUser({ ...user, gemasGoPoints: user.gemasGoPoints + userEarning, gameLives: user.gameLives - 1 });
      }
      
      setShowAd(false);
      setShowEarnings(true);
      setGamesPlayedCount(prev => prev + 1);
      
      setTimeout(() => {
        setShowEarnings(false);
      }, 3000);
    }
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          {t("games")}
        </h1>
        <p className="text-muted-foreground">
          Choose a game and start playing! Watch an ad every 3 games to keep playing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {GAMES.map((game) => (
          <Card
            key={game.id}
            className="hover-elevate active-elevate-2 overflow-hidden transition-transform"
            data-testid={`card-game-${game.id}`}
          >
            <CardHeader className="p-0">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={game.thumbnailUrl}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-serif mb-2">
                {game.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {game.description}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                onClick={() => handlePlayGame(game)}
                disabled={!user || user.gameLives === 0}
                data-testid={`button-play-${game.id}`}
              >
                <Gamepad2 className="w-4 h-4 mr-2" />
                {t("playNow")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Ad Dialog */}
      <Dialog open={showAd} onOpenChange={setShowAd}>
        <DialogContent className="sm:max-w-2xl" data-testid="dialog-ad">
          <DialogHeader>
            <DialogTitle>{t("watchAd")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Gamepad2 className="w-8 h-8 text-primary" />
                </div>
                <p className="text-lg font-medium">Advertisement</p>
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
              <span className="text-4xl">💎</span>
            </div>
            <h3 className="text-2xl font-serif font-bold">
              {t("earnedPoints", { points: earnedPoints })}
            </h3>
            <p className="text-muted-foreground">
              Keep watching ads to earn more GemasGo points!
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Game iframe Dialog */}
      <Dialog open={!!selectedGame && !showAd} onOpenChange={() => handleCloseGame()}>
        <DialogContent className="sm:max-w-4xl h-[80vh]" data-testid="dialog-game">
          <DialogHeader>
            <DialogTitle>{selectedGame?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              <Gamepad2 className="w-16 h-16 text-primary mx-auto" />
              <p className="text-lg font-medium">Game would load here</p>
              <p className="text-sm text-muted-foreground">
                In production, the game iframe would be embedded here
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
