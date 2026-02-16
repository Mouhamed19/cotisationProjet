import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

interface MemberReport {
  id: string;
  full_name: string;
  monthly_amount: number;
  paid: number;
  pending: number;
  late: number;
  total_paid: number;
  due: number;
}

const Reports = () => {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [report, setReport] = useState<MemberReport[]>([]);

  useEffect(() => { fetchReport(); }, [year]);

  const fetchReport = async () => {
    const { data: members } = await supabase.from("members").select("*").eq("is_active", true).order("full_name");
    const { data: contributions } = await supabase.from("contributions").select("*").eq("year", Number(year));

    if (!members) return;

    const currentMonth = Number(year) === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;

    const reportData: MemberReport[] = members.map((m) => {
      const memberContribs = contributions?.filter((c) => c.member_id === m.id) || [];
      const paid = memberContribs.filter((c) => c.status === "paid").length;
      const pending = memberContribs.filter((c) => c.status === "pending").length;
      const late = memberContribs.filter((c) => c.status === "late").length;
      const totalPaid = memberContribs.filter((c) => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0);
      const due = (currentMonth * Number(m.monthly_amount)) - totalPaid;

      return {
        id: m.id,
        full_name: m.full_name,
        monthly_amount: Number(m.monthly_amount),
        paid,
        pending,
        late,
        total_paid: totalPaid,
        due: Math.max(0, due),
      };
    });

    setReport(reportData);
  };

  const exportCSV = () => {
    const headers = ["Nom", "Montant/mois", "Mois payés", "En attente", "En retard", "Total payé", "Reste dû"];
    const rows = report.map((r) => [
      r.full_name, r.monthly_amount, r.paid, r.pending, r.late, r.total_paid, r.due,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rapport-cotisations-${year}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totals = report.reduce(
    (acc, r) => ({
      totalPaid: acc.totalPaid + r.total_paid,
      totalDue: acc.totalDue + r.due,
      totalMonths: acc.totalMonths + r.paid,
    }),
    { totalPaid: 0, totalDue: 0, totalMonths: 0 }
  );

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className="text-sm text-muted-foreground">Bilan des cotisations par membre</p>
        </div>
        <div className="flex gap-3">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" /> Exporter CSV
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total perçu</p>
            <p className="text-2xl font-bold text-success">{totals.totalPaid.toLocaleString()} FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total dû</p>
            <p className="text-2xl font-bold text-destructive">{totals.totalDue.toLocaleString()} FCFA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Mois payés (total)</p>
            <p className="text-2xl font-bold">{totals.totalMonths}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Détail par membre — {year}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Montant/mois</TableHead>
                <TableHead className="text-center">Payés</TableHead>
                <TableHead className="text-center">Attente</TableHead>
                <TableHead className="text-center">Retard</TableHead>
                <TableHead>Total payé</TableHead>
                <TableHead>Reste dû</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucun membre actif</TableCell></TableRow>
              ) : (
                report.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.full_name}</TableCell>
                    <TableCell>{r.monthly_amount.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-success/10 text-success text-sm font-medium">{r.paid}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-warning/10 text-warning text-sm font-medium">{r.pending}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-destructive/10 text-destructive text-sm font-medium">{r.late}</span>
                    </TableCell>
                    <TableCell className="font-medium text-success">{r.total_paid.toLocaleString()} FCFA</TableCell>
                    <TableCell className={`font-medium ${r.due > 0 ? "text-destructive" : "text-success"}`}>
                      {r.due.toLocaleString()} FCFA
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
