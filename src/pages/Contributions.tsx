import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

interface Member { id: string; full_name: string; monthly_amount: number; }
interface Contribution {
  id: string; member_id: string; amount: number; month: number; year: number;
  status: string; paid_at: string | null; notes: string | null;
  members: { full_name: string } | null;
}

const Contributions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMonth, setFilterMonth] = useState(String(new Date().getMonth() + 1));
  const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()));

  const [form, setForm] = useState({
    member_id: "", amount: "", month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()), status: "paid", notes: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [filterMonth, filterYear, filterStatus]);

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("id, full_name, monthly_amount").eq("is_active", true).order("full_name");
    setMembers(data || []);
  };

  const fetchContributions = async () => {
    let query = supabase
      .from("contributions")
      .select("*, members(full_name)")
      .eq("year", Number(filterYear))
      .order("month", { ascending: true });

    if (filterMonth !== "all") query = query.eq("month", Number(filterMonth));
    if (filterStatus !== "all") query = query.eq("status", filterStatus);

    const { data } = await query;
    setContributions(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const selectedMember = members.find((m) => m.id === form.member_id);
    const { error } = await supabase.from("contributions").insert({
      member_id: form.member_id,
      amount: Number(form.amount) || selectedMember?.monthly_amount || 0,
      month: Number(form.month),
      year: Number(form.year),
      status: form.status,
      paid_at: form.status === "paid" ? new Date().toISOString() : null,
      notes: form.notes.trim() || null,
      recorded_by: user.id,
    });

    if (error) {
      toast({ title: "Erreur", description: error.message.includes("unique") ? "Ce membre a déjà une cotisation pour ce mois." : error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Cotisation enregistrée" });
    setDialogOpen(false);
    setForm({ member_id: "", amount: "", month: String(new Date().getMonth() + 1), year: String(new Date().getFullYear()), status: "paid", notes: "" });
    fetchContributions();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from("contributions").update({
      status: newStatus,
      paid_at: newStatus === "paid" ? new Date().toISOString() : null,
    }).eq("id", id);
    fetchContributions();
  };

  const handleMemberSelect = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    setForm({ ...form, member_id: memberId, amount: String(member?.monthly_amount || "") });
  };

  const filtered = contributions.filter((c) =>
    c.members?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cotisations</h1>
          <p className="text-sm text-muted-foreground">Suivi des paiements mensuels</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Enregistrer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle cotisation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Membre *</Label>
                <Select value={form.member_id} onValueChange={handleMemberSelect}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un membre" /></SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Mois *</Label>
                  <Select value={form.month} onValueChange={(v) => setForm({ ...form, month: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m, i) => (
                        <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Année *</Label>
                  <Select value={form.year} onValueChange={(v) => setForm({ ...form, year: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Montant (FCFA) *</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="0" />
              </div>
              <div className="space-y-2">
                <Label>Statut *</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Payé</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="late">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optionnel..." />
              </div>
              <Button type="submit" className="w-full" disabled={!form.member_id}>Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterMonth} onValueChange={setFilterMonth}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les mois</SelectItem>
            {MONTHS.map((m, i) => (
              <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterYear} onValueChange={setFilterYear}>
          <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="paid">Payé</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="late">En retard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden sm:table-cell">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucune cotisation trouvée</TableCell></TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.members?.full_name}</TableCell>
                    <TableCell>{MONTHS[c.month - 1]} {c.year}</TableCell>
                    <TableCell>{Number(c.amount).toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <Select value={c.status} onValueChange={(v) => handleStatusChange(c.id, v)}>
                        <SelectTrigger className={`w-[120px] h-8 text-xs ${
                          c.status === "paid" ? "text-success" : c.status === "late" ? "text-destructive" : "text-warning"
                        }`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">✅ Payé</SelectItem>
                          <SelectItem value="pending">⏳ En attente</SelectItem>
                          <SelectItem value="late">⚠️ En retard</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{c.notes || "—"}</TableCell>
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

export default Contributions;
