import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OSProvider } from "@/lib/os-context";
import { TaskbarProvider } from "@/lib/taskbar-context";
import { VolumeProvider } from "@/lib/volume-context";
import { SpotifyProvider } from "@/lib/spotify-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Desktop } from "@/components/os/Desktop";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Desktop} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="portfolio-os-theme">
        <TooltipProvider>
          <VolumeProvider>
            <SpotifyProvider>
              <TaskbarProvider>
                <OSProvider>
                  <Toaster />
                  <Router />
                </OSProvider>
              </TaskbarProvider>
            </SpotifyProvider>
          </VolumeProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
