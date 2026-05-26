import React, { useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import { WaitlistButton } from "@/components/waitlist-modal";
import { AIAssistant } from "@/components/ai-assistant";

const ThemeInitializer = () => {
  useEffect(() => { document.documentElement.classList.add("dark"); }, []);
  return null;
};

const Dashboard    = React.lazy(() => import("@/pages/dashboard"));
const AvatarEngine = React.lazy(() => import("@/pages/avatar"));
const Campaigns    = React.lazy(() => import("@/pages/campaigns"));
const Products     = React.lazy(() => import("@/pages/products"));
const Links        = React.lazy(() => import("@/pages/links"));
const Conversations= React.lazy(() => import("@/pages/conversations"));
const AuraFarming  = React.lazy(() => import("@/pages/aura-farming"));
const Report       = React.lazy(() => import("@/pages/report"));

import { SidebarLayout } from "@/components/layout/sidebar-layout";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

function AppRoutes() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("cos_authed"));
  const [location] = useLocation();

  useEffect(() => {
    const check = () => setAuthed(!!localStorage.getItem("cos_authed"));
    window.addEventListener("storage", check);
    const interval = setInterval(check, 300);
    return () => { window.removeEventListener("storage", check); clearInterval(interval); };
  }, []);

  // Public routes — always accessible
  if (!authed) {
    return (
      <>
        <Switch>
          <Route path="/login" component={Login} />
          <Route component={Landing} />
        </Switch>
        <AIAssistant />
        <WaitlistButton />
      </>
    );
  }

  // Landing page accessible from inside the app too
  if (location === "/landing") return <Landing />;

  return (
    <SidebarLayout>
      <React.Suspense fallback={<div className="p-8 text-muted-foreground animate-pulse">Loading…</div>}>
        <Switch>
          <Route path="/"              component={Dashboard}    />
          <Route path="/avatar"        component={AvatarEngine} />
          <Route path="/campaigns"     component={Campaigns}    />
          <Route path="/products"      component={Products}     />
          <Route path="/links"         component={Links}        />
          <Route path="/conversations" component={Conversations}/>
          <Route path="/aura-farming"  component={AuraFarming}  />
          <Route path="/report"        component={Report}       />
          <Route component={NotFound} />
        </Switch>
      </React.Suspense>
    </SidebarLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeInitializer />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
