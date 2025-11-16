import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Gamepad2, TrendingUp, Store, Video, LayoutDashboard, LogOut, Settings, Gem } from "lucide-react";
import logoImage from "@assets/generated_images/GemasGo_purple_gemstone_logo_cabf5ffa.png";

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const userMenuItems = [
    {
      title: t("games"),
      url: "/dashboard/games",
      icon: Gamepad2,
      testId: "nav-games",
    },
    {
      title: t("ads"),
      url: "/dashboard/ads",
      icon: TrendingUp,
      testId: "nav-ads",
    },
    {
      title: t("store"),
      url: "/dashboard/store",
      icon: Store,
      testId: "nav-store",
    },
    {
      title: t("promotions"),
      url: "/dashboard/promotions",
      icon: Video,
      testId: "nav-promotions",
    },
  ];

  const adminMenuItems = user?.isAdmin ? [
    {
      title: t("adminPanel"),
      url: "/admin",
      icon: LayoutDashboard,
      testId: "nav-admin",
    },
  ] : [];

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="GemasGo" className="w-10 h-10" />
          <div>
            <h2 className="font-serif font-bold text-lg">GemasGo</h2>
            <p className="text-xs text-muted-foreground">{user?.username}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {t("dashboard")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={item.testId}
                  >
                    <a href={item.url} onClick={(e) => {
                      e.preventDefault();
                      setLocation(item.url);
                    }}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {adminMenuItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={location === item.url}
                      data-testid={item.testId}
                    >
                      <a href={item.url} onClick={(e) => {
                        e.preventDefault();
                        setLocation(item.url);
                      }}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
