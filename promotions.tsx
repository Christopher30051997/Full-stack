import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Video, Youtube, TrendingUp, ThumbsUp, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { SiTiktok, SiFacebook, SiYoutube } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

const promotionSchema = z.object({
  platform: z.enum(["youtube", "tiktok", "facebook"]),
  videoUrl: z.string().url("Please enter a valid URL"),
  duration: z.number().min(1).max(30),
  goalType: z.enum(["likes", "views"]),
  goalAmount: z.number().min(100).max(1000000),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

const MOCK_PROMOTIONS = [
  {
    id: "1",
    platform: "youtube",
    videoUrl: "https://youtube.com/watch?v=example1",
    duration: 7,
    goalType: "views",
    goalAmount: 10000,
    cost: 500,
    status: "approved",
  },
  {
    id: "2",
    platform: "tiktok",
    videoUrl: "https://tiktok.com/@user/video/example2",
    duration: 3,
    goalType: "likes",
    goalAmount: 5000,
    cost: 300,
    status: "pending",
  },
];

export default function Promotions() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      platform: "youtube",
      videoUrl: "",
      duration: 7,
      goalType: "views",
      goalAmount: 1000,
    },
  });

  const duration = form.watch("duration");
  const goalType = form.watch("goalType");
  const goalAmount = form.watch("goalAmount");

  // Calculate estimated cost based on AI formula
  useState(() => {
    const baseCost = goalType === "views" ? 0.05 : 0.1;
    const cost = Math.ceil(goalAmount * baseCost * (duration / 7));
    setEstimatedCost(cost);
  });

  const onSubmit = async (data: PromotionFormData) => {
    if (user && user.gemasGoPoints >= estimatedCost) {
      toast({
        title: t("success"),
        description: "Video promotion submitted for approval!",
      });
      form.reset();
    } else {
      toast({
        title: t("error"),
        description: "Not enough GemasGo points!",
        variant: "destructive",
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <SiYoutube className="w-5 h-5 text-red-500" />;
      case "tiktok":
        return <SiTiktok className="w-5 h-5" />;
      case "facebook":
        return <SiFacebook className="w-5 h-5 text-blue-500" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />{t("approved")}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t("rejected")}</Badge>;
      case "active":
        return <Badge variant="default">{t("active")}</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t("pending")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          {t("promotions")}
        </h1>
        <p className="text-muted-foreground">
          Promote your YouTube, TikTok, or Facebook videos and boost your engagement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Promotion Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                {t("promoteVideo")}
              </CardTitle>
              <CardDescription>
                Fill in the details below and our AI will calculate the cost
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("platform")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-platform">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="youtube" data-testid="option-youtube">
                              <div className="flex items-center gap-2">
                                <SiYoutube className="w-4 h-4 text-red-500" />
                                <span>YouTube</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="tiktok" data-testid="option-tiktok">
                              <div className="flex items-center gap-2">
                                <SiTiktok className="w-4 h-4" />
                                <span>TikTok</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="facebook" data-testid="option-facebook">
                              <div className="flex items-center gap-2">
                                <SiFacebook className="w-4 h-4 text-blue-500" />
                                <span>Facebook</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("videoUrl")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://..."
                            data-testid="input-video-url"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("duration")}: {field.value} days</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={30}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            data-testid="slider-duration"
                          />
                        </FormControl>
                        <FormDescription>
                          How long do you want your video promoted?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("goalType")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-goal-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="views" data-testid="option-views">
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{t("views")}</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="likes" data-testid="option-likes">
                              <div className="flex items-center gap-2">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{t("likes")}</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("goalAmount")}: {field.value.toLocaleString()}</FormLabel>
                        <FormControl>
                          <Slider
                            min={100}
                            max={100000}
                            step={100}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            data-testid="slider-goal-amount"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t("estimatedCost")}:</span>
                      <span className="text-2xl font-mono font-bold text-primary" data-testid="text-estimated-cost">
                        {estimatedCost} GemasGo
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Cost calculated by AI based on duration, goal type, and target amount
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!user || user.gemasGoPoints < estimatedCost}
                    data-testid="button-submit-promotion"
                  >
                    {t("submitForApproval")}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        {/* Info & Stats */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="font-serif">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-sm">Submit your video details and goals</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-sm">AI calculates the cost automatically</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-sm">Admin reviews and approves your promotion</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                  4
                </div>
                <p className="text-sm">Your video gets promoted to our community</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Your Promotions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
                  data-testid={`promo-${promo.id}`}
                >
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(promo.platform)}
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{promo.platform}</p>
                      <p className="text-xs text-muted-foreground">{promo.goalAmount.toLocaleString()} {promo.goalType}</p>
                    </div>
                  </div>
                  {getStatusBadge(promo.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Promotions Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-serif font-bold mb-4">Featured Promotions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.filter(p => p.status === "approved").map((promo) => (
            <Card key={promo.id} className="hover-elevate active-elevate-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  {getPlatformIcon(promo.platform)}
                  {getStatusBadge(promo.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Goal:</span>
                    <span className="font-mono">{promo.goalAmount.toLocaleString()} {promo.goalType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-mono">{promo.duration} days</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href={promo.videoUrl} target="_blank" rel="noopener noreferrer">
                    Watch Video
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
