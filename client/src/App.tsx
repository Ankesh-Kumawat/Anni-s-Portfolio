import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OSProvider } from "@/lib/os-context";
import { TaskbarProvider } from "@/lib/taskbar-context";
import { VolumeProvider } from "@/lib/volume-context";
import { SpotifyProvider } from "@/lib/spotify-context";
import { SystemStateProvider, useSystemState } from "@/lib/system-state-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Desktop } from "@/components/os/Desktop";
import { BootScreen } from "@/components/os/BootScreen";
import { LockScreen } from "@/components/os/LockScreen";
import NotFound from "@/pages/not-found";

function SystemRouter() {
  const { state, setState } = useSystemState();

  if (state === "boot") {
    return <BootScreen onBootComplete={() => setState("lock")} />;
  }

  if (state === "lock") {
    return <LockScreen onUnlock={() => setState("desktop")} />;
  }

  if (state === "shutdown") {
    return <BootScreen onBootComplete={() => setState("lock")} />;
  }

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
          <SystemStateProvider>
            <VolumeProvider>
              <SpotifyProvider>
                <TaskbarProvider>
                  <OSProvider>
                    <Toaster />
                    <SystemRouter />
                  </OSProvider>
                </TaskbarProvider>
              </SpotifyProvider>
            </VolumeProvider>
          </SystemStateProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
