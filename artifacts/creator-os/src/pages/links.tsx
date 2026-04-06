import { useState } from "react";
import { useListLinks, useCreateLink, useListCampaigns, useListProducts, getListLinksQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Link2, Plus, Copy, ExternalLink } from "lucide-react";

export default function Links() {
  const { data: links, isLoading } = useListLinks();
  const { data: campaigns } = useListCampaigns();
  const { data: products } = useListProducts();
  const createLink = useCreateLink();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    destinationUrl: '',
    label: '',
    campaignId: '' as string | number,
    productId: '' as string | number,
  });

  const handleCreate = () => {
    createLink.mutate({
      data: {
        destinationUrl: newLink.destinationUrl,
        label: newLink.label || null,
        campaignId: newLink.campaignId ? Number(newLink.campaignId) : null,
        productId: newLink.productId ? Number(newLink.productId) : null,
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLinksQueryKey() });
        setIsCreateOpen(false);
        toast({ title: "Link Created", description: "Your tracking link is ready." });
        setNewLink({ destinationUrl: '', label: '', campaignId: '', productId: '' });
      }
    });
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`https://go.crtr.os/${code}`);
    toast({ title: "Copied to clipboard" });
  };

  const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  if (isLoading) return <div className="animate-pulse">Loading links...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Link2 className="h-8 w-8 text-primary" />
            Linkrunner Hub
          </h1>
          <p className="text-muted-foreground mt-1">Generate tracking links to attribute exact sales to your avatar.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0"><Plus className="h-4 w-4 mr-2"/> Generate Link</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Tracking Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Destination URL</Label>
                <Input value={newLink.destinationUrl} onChange={e => setNewLink({...newLink, destinationUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Label (Optional)</Label>
                <Input value={newLink.label} onChange={e => setNewLink({...newLink, label: e.target.value})} placeholder="e.g. IG Bio Link" />
              </div>
              <div className="space-y-2">
                <Label>Attach to Campaign (Optional)</Label>
                <Select value={String(newLink.campaignId)} onValueChange={v => setNewLink({...newLink, campaignId: v})}>
                  <SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {campaigns?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.brandName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Attach to Product (Optional)</Label>
                <Select value={String(newLink.productId)} onValueChange={v => setNewLink({...newLink, productId: v})}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {products?.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={createLink.isPending} className="w-full">Create Shortlink</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Short Code</TableHead>
                <TableHead>Label / Target</TableHead>
                <TableHead className="text-right">Total Clicks</TableHead>
                <TableHead className="text-right">Unique</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links?.map(link => (
                <TableRow key={link.id}>
                  <TableCell className="font-mono text-sm font-medium text-primary">/{link.shortCode}</TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{link.label || 'Unnamed Link'}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[250px]" title={link.destinationUrl}>
                      {link.destinationUrl}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{link.totalClicks}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{link.uniqueClicks}</TableCell>
                  <TableCell className="text-right font-medium">{link.conversions}</TableCell>
                  <TableCell className="text-right font-medium text-primary">{formatINR(link.revenue)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(link.shortCode)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {links?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No tracking links created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
