import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Gem, Heart } from "lucide-react";

export function PointsDisplay() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <Card className="px-4 py-2 bg-primary/10 border-primary/20">
        <div className="flex items-center gap-2">
          <Gem className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">{t("gemasGoPoints")}</p>
            <p className="text-lg font-mono font-bold text-primary" data-testid="text-gemasgo-points">
              {user.gemasGoPoints.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="px-4 py-2 bg-destructive/10 border-destructive/20">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-destructive" />
          <div>
            <p className="text-xs text-muted-foreground">{t("gameLives")}</p>
            <p className="text-lg font-mono font-bold text-destructive" data-testid="text-game-lives">
              {user.gameLives}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
