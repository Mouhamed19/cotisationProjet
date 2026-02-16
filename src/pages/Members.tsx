import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Member {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  monthly_amount: number;
  is_active: boolean;
  created_at: string;
}

const Members = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", monthly_amount: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("full_name");
    setMembers(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      monthly_amount: Number(form.monthly_amount) || 0,
    };

    if (editingMember) {
      const { error } = await supabase.from("members").update(payload).eq("id", editingMember.id);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Membre modifié" });
    } else {
      const { error } = await supabase.from("members").insert({ ...payload, created_by: user.id });
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Membre ajouté" });
    }

    setDialogOpen(false);
    setEditingMember(null);
    setForm({ full_name: "", email: "", phone: "", monthly_amount: "" });
    fetchMembers();
  };

  const handleEdit = (m: Member) => {
    setEditingMember(m);
    setForm({ full_name: m.full_name, email: m.email || "", phone: m.phone || "", monthly_amount: String(m.monthly_amount) });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce membre ?")) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Membre supprimé" });
    fetchMembers();
  };

  const filtered = members.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Membres</h1>
          <p className="text-sm text-muted-foreground">{members.length} collaborateurs inscrits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingMember(null); setForm({ full_name: "", email: "", phone: "", monthly_amount: "" }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Ajouter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMember ? "Modifier le membre" : "Nouveau membre"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Nom complet *</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Montant mensuel (FCFA) *</Label>
                <Input type="number" value={form.monthly_amount} onChange={(e) => setForm({ ...form, monthly_amount: e.target.value })} required min="0" />
              </div>
              <Button type="submit" className="w-full">{editingMember ? "Modifier" : "Ajouter"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
                <TableHead>Montant/mois</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucun membre trouvé</TableCell></TableRow>
              ) : (
                filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.full_name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{m.email || "—"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{m.phone || "—"}</TableCell>
                    <TableCell>{Number(m.monthly_amount).toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(m)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
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

export default Members;
