import { useState } from "react";
import { useGetCreatorProfile, useUpdateCreatorProfile, getGetCreatorProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, Sparkles, MessageSquareQuote } from "lucide-react";

export default function AvatarEngine() {
  const { data: profile, isLoading } = useGetCreatorProfile();
  const updateProfile = useUpdateCreatorProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [localProfile, setLocalProfile] = useState<any>(null);

  // Sync local state when profile loads
  if (profile && !localProfile) {
    setLocalProfile(profile);
  }

  const handleSave = () => {
    if (!localProfile) return;
    
    updateProfile.mutate({
      data: {
        avatarEnabled: localProfile.avatarEnabled,
        coreVibeConversational: localProfile.coreVibeConversational,
        coreVibeOperational: localProfile.coreVibeOperational,
        coreVibeRelational: localProfile.coreVibeRelational,
        coreVibeEthos: localProfile.coreVibeEthos,
        signatureSlang: localProfile.signatureSlang,
      }
    }, {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetCreatorProfileQueryKey(), data);
        toast({ title: "Avatar Engine Updated", description: "Your AI clone's brain has been synced." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update avatar settings.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading engine...</div>;
  }

  if (!localProfile) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            C.O.R.E. Avatar Engine
          </h1>
          <p className="text-muted-foreground mt-1">Configure your AI digital clone's personality, slang, and sales approach.</p>
        </div>
        <div className="flex items-center gap-4 bg-card/50 p-3 rounded-lg border border-border">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Avatar Status</span>
            <span className="text-xs text-muted-foreground">{localProfile.avatarEnabled ? 'Active & Engaging' : 'Offline'}</span>
          </div>
          <Switch 
            checked={localProfile.avatarEnabled} 
            onCheckedChange={(checked) => setLocalProfile({ ...localProfile, avatarEnabled: checked })}
          />
          <Button onClick={handleSave} disabled={updateProfile.isPending} className="ml-2">
            {updateProfile.isPending ? "Syncing..." : "Save Engine State"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Signature Slang</CardTitle>
              <CardDescription>Comma-separated Hinglish words your avatar uses naturally.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input 
                value={localProfile.signatureSlang || ''} 
                onChange={(e) => setLocalProfile({ ...localProfile, signatureSlang: e.target.value })}
                placeholder="e.g. bhai, scene set hai, chill maar, kya bolti public"
                className="bg-background/50"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-md">Conversational</CardTitle>
                <CardDescription>How the avatar greets and opens.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={localProfile.coreVibeConversational || ''} 
                  onChange={(e) => setLocalProfile({ ...localProfile, coreVibeConversational: e.target.value })}
                  placeholder="Hey bro! Kya chal raha hai?"
                  className="min-h-[120px] bg-background/50"
                />
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-md">Operational</CardTitle>
                <CardDescription>Sales approach and product knowledge.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={localProfile.coreVibeOperational || ''} 
                  onChange={(e) => setLocalProfile({ ...localProfile, coreVibeOperational: e.target.value })}
                  placeholder="Direct point pe aata hai, lists features clearly."
                  className="min-h-[120px] bg-background/50"
                />
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-md">Relational</CardTitle>
                <CardDescription>How it builds trust & handles objections.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={localProfile.coreVibeRelational || ''} 
                  onChange={(e) => setLocalProfile({ ...localProfile, coreVibeRelational: e.target.value })}
                  placeholder="Acts like an older sibling giving advice."
                  className="min-h-[120px] bg-background/50"
                />
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-md">Ethos</CardTitle>
                <CardDescription>Boundaries and values upheld.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={localProfile.coreVibeEthos || ''} 
                  onChange={(e) => setLocalProfile({ ...localProfile, coreVibeEthos: e.target.value })}
                  placeholder="Never overpromises, authentic reviews only."
                  className="min-h-[120px] bg-background/50"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-primary/20 shadow-[0_0_15px_rgba(249,115,22,0.1)] sticky top-6">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span className="flex items-center gap-2"><MessageSquareQuote className="h-4 w-4" /> Live Preview</span>
                <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">Simulation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col h-[400px]">
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-black/40">
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] text-sm">
                      Link kaha hai bhai course ka?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-sm">
                      Bhai check DM kar! Scene set hai ekdum, maine saari details bhej di hai waha. 😎
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%] text-sm">
                      Price thoda zyada lag raha hai yaar...
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%] text-sm">
                      Dekh bhai, quality content hai. Value for money full on milega. Tu tension mat le, long term investment samajh isko.
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-border/50 bg-muted/10 flex items-center gap-2">
                  <Input placeholder="Type to test avatar..." className="h-8 bg-background/50 border-border/50 text-sm" disabled />
                  <Button size="icon" className="h-8 w-8 shrink-0" disabled><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
