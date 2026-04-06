import React, { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Ensure dark mode is active
const ThemeInitializer = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return null;
};

// Pages
const Dashboard = React.lazy(() => import("@/pages/dashboard"));
const AvatarEngine = React.lazy(() => import("@/pages/avatar"));
const Campaigns = React.lazy(() => import("@/pages/campaigns"));
const Products = React.lazy(() => import("@/pages/products"));
const Links = React.lazy(() => import("@/pages/links"));
const Conversations = React.lazy(() => import("@/pages/conversations"));
const Report = React.lazy(() => import("@/pages/report"));

import { SidebarLayout } from "@/components/layout/sidebar-layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <SidebarLayout>
      <React.Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/avatar" component={AvatarEngine} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/products" component={Products} />
          <Route path="/links" component={Links} />
          <Route path="/conversations" component={Conversations} />
          <Route path="/report" component={Report} />
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
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
