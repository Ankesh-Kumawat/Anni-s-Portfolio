import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OSProvider } from "@/lib/os-context";
import { TaskbarProvider } from "@/lib/taskbar-context";
import { VolumeProvider } from "@/lib/volume-context";
import { SpotifyProvider } from "@/lib/spotify-context";
import { BrightnessProvider } from "@/lib/brightness-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Desktop } from "@/components/os/Desktop";
import { OSNotificationContainer } from "@/components/os/OSNotificationContainer";
import NotFound from "@/pages/not-found";
import Editor from "@/pages/editor";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="portfolio-os-theme">
        <BrightnessProvider>
          <TooltipProvider>
            <VolumeProvider>
              <SpotifyProvider>
                <TaskbarProvider>
                  <OSProvider>
                    <Toaster />
                    <OSNotificationContainer />
                    <Switch>
                      <Route path="/" component={Desktop} />
                      <Route path="/editor" component={Editor} />
                      <Route component={NotFound} />
                    </Switch>
                  </OSProvider>
                </TaskbarProvider>
              </SpotifyProvider>
            </VolumeProvider>
          </TooltipProvider>
        </BrightnessProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
