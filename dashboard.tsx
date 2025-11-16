import { useLocation, Route, Switch } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PointsDisplay } from "@/components/PointsDisplay";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Games from "./games";
import Ads from "./ads";
import Store from "./store";
import Promotions from "./promotions";
import Admin from "./admin";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  if (!user) {
    setLocation("/");
    return null;
  }

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </div>
            <div className="flex items-center gap-4">
              <PointsDisplay />
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <Bell className="w-5 h-5" />
              </Button>
              <LanguageSelector />
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background">
            <Switch>
              <Route path="/dashboard/games" component={Games} />
              <Route path="/dashboard/ads" component={Ads} />
              <Route path="/dashboard/store" component={Store} />
              <Route path="/dashboard/promotions" component={Promotions} />
              <Route path="/admin" component={Admin} />
              <Route path="/dashboard">
                {() => {
                  setLocation("/dashboard/games");
                  return null;
                }}
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
