import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const Dashboard = () => {
  const [stats, setStats] = useState({ totalMembers: 0, totalPaid: 0, totalPending: 0, totalLate: 0 });
  const [chartData, setChartData] = useState<{ month: string; paid: number; pending: number }[]>([]);
  const [recentContributions, setRecentContributions] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchChart();
    fetchRecent();
  }, []);

  const fetchStats = async () => {
    const { count: totalMembers } = await supabase.from("members").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { data: contributions } = await supabase.from("contributions").select("status, amount").eq("year", new Date().getFullYear());

    const totalPaid = contributions?.filter((c) => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0) || 0;
    const totalPending = contributions?.filter((c) => c.status === "pending").length || 0;
    const totalLate = contributions?.filter((c) => c.status === "late").length || 0;

    setStats({ totalMembers: totalMembers || 0, totalPaid, totalPending, totalLate });
  };

  const fetchChart = async () => {
    const year = new Date().getFullYear();
    const { data } = await supabase.from("contributions").select("month, status, amount").eq("year", year);

    const monthlyData = MONTHS.map((m, i) => {
      const monthContribs = data?.filter((c) => c.month === i + 1) || [];
      return {
        month: m,
        paid: monthContribs.filter((c) => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0),
        pending: monthContribs.filter((c) => c.status !== "paid").reduce((s, c) => s + Number(c.amount), 0),
      };
    });
    setChartData(monthlyData);
  };

  const fetchRecent = async () => {
    const { data } = await supabase
      .from("contributions")
      .select("*, members(full_name)")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecentContributions(data || []);
  };

  const statCards = [
    { label: "Membres actifs", value: stats.totalMembers, icon: Users, color: "text-primary" },
    { label: "Total perçu", value: `${stats.totalPaid.toLocaleString()} FCFA`, icon: CheckCircle, color: "text-success" },
    { label: "En attente", value: stats.totalPending, icon: CreditCard, color: "text-warning" },
    { label: "En retard", value: stats.totalLate, icon: AlertTriangle, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble des cotisations {new Date().getFullYear()}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon className={`h-8 w-8 ${s.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cotisations mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="paid" fill="hsl(var(--success))" name="Payé" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="hsl(var(--warning))" name="En attente" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dernières cotisations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentContributions.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune cotisation enregistrée.</p>
          ) : (
            <div className="space-y-3">
              {recentContributions.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{c.members?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{MONTHS[c.month - 1]} {c.year}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{Number(c.amount).toLocaleString()} FCFA</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "paid" ? "bg-success/10 text-success" :
                      c.status === "late" ? "bg-destructive/10 text-destructive" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {c.status === "paid" ? "Payé" : c.status === "late" ? "Retard" : "En attente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
