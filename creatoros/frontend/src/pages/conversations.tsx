import { useState } from "react";
import { useListConversations, useGetConversation } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Conversations() {
  const { data: conversations, isLoading } = useListConversations();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: detail, isLoading: isDetailLoading } = useGetConversation(selectedId as number, { 
    query: { enabled: !!selectedId } as any
  });

  const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  if (isLoading) return <div className="animate-pulse">Loading conversations...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          DM Conversations
        </h1>
        <p className="text-muted-foreground mt-1">Live feed of your AI avatar chatting with followers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(conversations) ? conversations : []).map((conv) => (
          <Card 
            key={conv.id} 
            className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedId(conv.id)}
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-sm">@{conv.followerHandle}</p>
                  <p className="text-xs text-muted-foreground capitalize">{conv.platform}</p>
                </div>
                <Badge variant={conv.status === 'converted' ? 'default' : conv.status === 'active' ? 'secondary' : 'outline'}>
                  {conv.status}
                </Badge>
              </div>
              <div className="bg-muted/50 rounded p-2 mb-4">
                <p className="text-xs text-muted-foreground italic line-clamp-2">"{conv.triggerComment}"</p>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">{conv.messageCount} msgs</span>
                {conv.revenueGenerated > 0 && (
                  <span className="font-medium text-primary">{formatINR(conv.revenueGenerated)}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b border-border/50 shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Chat with @{detail?.conversation?.followerHandle}</span>
              {detail?.conversation?.revenueGenerated ? (
                <Badge variant="default">{formatINR(detail.conversation.revenueGenerated)} Generated</Badge>
              ) : null}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 bg-black/20 space-y-4">
            {isDetailLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              (Array.isArray(detail?.messages) ? detail.messages : []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'avatar' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-2xl px-4 py-2 max-w-[85%] text-sm ${
                    msg.role === 'avatar' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted text-muted-foreground rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
