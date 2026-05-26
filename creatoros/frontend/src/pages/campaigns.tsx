import { useState } from "react";
import { useListCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, getListCampaignsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Plus, MoreHorizontal, Activity, PauseCircle, CheckCircle, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Campaigns() {
  const { data: campaigns, isLoading } = useListCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    brandName: '',
    productName: '',
    platform: 'instagram' as const,
    dealValue: 0,
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleCreate = () => {
    createCampaign.mutate({
      data: newCampaign
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey() });
        setIsCreateOpen(false);
        toast({ title: "Campaign Created", description: "New brand deal is now live." });
        setNewCampaign({ brandName: '', productName: '', platform: 'instagram', dealValue: 0, startDate: new Date().toISOString().split('T')[0] });
      }
    });
  };

  const handleUpdateStatus = (id: number, status: 'active' | 'paused' | 'completed' | 'draft') => {
    updateCampaign.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey() });
        toast({ title: "Status Updated", description: `Campaign is now ${status}.` });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    deleteCampaign.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey() });
        toast({ title: "Campaign Deleted" });
      }
    });
  };

  const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  if (isLoading) return <div className="animate-pulse">Loading campaigns...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" />
            Brand Campaigns
          </h1>
          <p className="text-muted-foreground mt-1">Manage active brand deals and track ROI in real-time.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0"><Plus className="h-4 w-4 mr-2"/> New Campaign</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Brand Deal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input value={newCampaign.brandName} onChange={e => setNewCampaign({...newCampaign, brandName: e.target.value})} placeholder="e.g. Nike" />
              </div>
              <div className="space-y-2">
                <Label>Product/Service</Label>
                <Input value={newCampaign.productName} onChange={e => setNewCampaign({...newCampaign, productName: e.target.value})} placeholder="e.g. Air Max" />
              </div>
              <div className="space-y-2">
                <Label>Deal Value (INR)</Label>
                <Input type="number" value={newCampaign.dealValue || ''} onChange={e => setNewCampaign({...newCampaign, dealValue: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={newCampaign.platform} onValueChange={(v: any) => setNewCampaign({...newCampaign, platform: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="x">X</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={newCampaign.startDate} onChange={e => setNewCampaign({...newCampaign, startDate: e.target.value})} />
              </div>
              <Button onClick={handleCreate} disabled={createCampaign.isPending} className="w-full">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(Array.isArray(campaigns) ? campaigns : []).map(campaign => (
          <Card key={campaign.id} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors flex flex-col">
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{campaign.brandName}</h3>
                  <p className="text-sm text-muted-foreground">{campaign.productName}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUpdateStatus(campaign.id, 'active')}><Activity className="h-4 w-4 mr-2"/> Mark Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(campaign.id, 'paused')}><PauseCircle className="h-4 w-4 mr-2"/> Pause</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(campaign.id, 'completed')}><CheckCircle className="h-4 w-4 mr-2"/> Mark Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(campaign.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2"/> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex gap-2 mb-6">
                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="capitalize">{campaign.status}</Badge>
                <Badge variant="outline" className="capitalize">{campaign.platform}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Deal Value</p>
                  <p className="font-semibold">{formatINR(campaign.dealValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Generated</p>
                  <p className="font-semibold text-primary">{formatINR(campaign.totalRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                  <p className="font-semibold">{campaign.totalConversions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conv. Rate</p>
                  <p className="font-semibold">{campaign.conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {campaigns?.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
            No brand campaigns yet. Create one to start tracking ROI.
          </div>
        )}
      </div>
    </div>
  );
}
