import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Users, CreditCard, FileText, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/members", icon: Users, label: "Membres" },
  { to: "/contributions", icon: CreditCard, label: "Cotisations" },
  { to: "/reports", icon: FileText, label: "Rapports" },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-sidebar-primary">CotisApp</h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Gestion des cotisations</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.to
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 truncate mb-2">{user?.email}</p>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-lg font-bold text-primary">CotisApp</h1>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileOpen && (
          <div className="md:hidden bg-card border-b p-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  location.pathname === item.to ? "bg-secondary text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start mt-2">
              <LogOut className="h-4 w-4 mr-2" /> Déconnexion
            </Button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};
