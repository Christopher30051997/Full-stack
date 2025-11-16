import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Sparkles, Gamepad2, TrendingUp, Gift } from "lucide-react";
import logoImage from "@assets/generated_images/GemasGo_purple_gemstone_logo_cabf5ffa.png";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function Landing() {
  const [isLogin, setIsLogin] = useState(false);
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const { setUser } = useAuth();

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onRegister = async (data: RegisterFormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      const user = await response.json();
      setUser(user);
      setLocation("/dashboard");
    } catch (error: any) {
      alert(error.message || "Registration failed");
    }
  };

  const onLogin = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const user = await response.json();
      setUser(user);
      setLocation("/dashboard");
    } catch (error: any) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex flex-col">
      <header className="p-4 flex justify-end">
        <LanguageSelector />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <img src={logoImage} alt="GemasGo" className="w-24 h-24" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground">
              GemasGo
            </h1>
            <p className="text-lg text-muted-foreground max-w-sm mx-auto">
              {t("welcomeMessage")}
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">
                {isLogin ? t("login") : t("createAccount")}
              </CardTitle>
              <CardDescription>
                {isLogin ? t("dontHaveAccount") : t("alreadyHaveAccount")}
                {" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setIsLogin(!isLogin)}
                  data-testid="button-toggle-auth-mode"
                >
                  {isLogin ? t("register") : t("login")}
                </Button>
              </CardDescription>
            </CardHeader>

            {!isLogin ? (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("name")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-username"
                              placeholder={t("name")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("emailOptional")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              data-testid="input-email"
                              placeholder={t("emailOptional")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              data-testid="input-password"
                              placeholder={t("password")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter className="flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      data-testid="button-register"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t("register")}
                    </Button>

                    <div className="text-xs text-center text-muted-foreground">
                      <a href="#" className="hover:underline">
                        {t("privacyPolicy")}
                      </a>
                      {" • "}
                      <a href="#" className="hover:underline">
                        {t("termsOfUse")}
                      </a>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            ) : (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("name")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-username-login"
                              placeholder={t("name")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              data-testid="input-password-login"
                              placeholder={t("password")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      data-testid="button-login"
                    >
                      {t("login")}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Gamepad2 className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">{t("games")}</p>
            </div>
            <div className="space-y-2">
              <TrendingUp className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">{t("ads")}</p>
            </div>
            <div className="space-y-2">
              <Gift className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">{t("store")}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
