import { useOS, AppConfig } from "@/lib/os-context";
import { useSystemState } from "@/lib/system-state-context";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Grid, Search, Power, Settings as SettingsIcon, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StartMenuProps {
  apps: AppConfig[];
}

export function StartMenu({ apps }: StartMenuProps) {
  const { launchApp } = useOS();
  const { lock, shutdown } = useSystemState();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "fixed bottom-6 left-6 z-50 rounded-full h-10 w-10 bg-background/80 backdrop-blur-md border shadow-lg transition-all hover:scale-105 active:scale-95",
            open && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
          )}
        >
          <Grid className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 mb-4 ml-6 bg-background/95 backdrop-blur-xl border shadow-2xl rounded-xl overflow-hidden"
        side="top"
        align="start"
      >
        <Command className="rounded-xl border-none">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Type to search apps..." className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto p-2">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Applications">
              {apps.map((app) => (
                <CommandItem
                  key={app.id}
                  onSelect={() => {
                    launchApp(app.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg hover:bg-accent aria-selected:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted/50">
                    {app.icon}
                  </div>
                  <span className="font-medium">{app.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="System">
              <CommandItem onSelect={() => { launchApp('settings'); setOpen(false); }} className="flex items-center gap-2 cursor-pointer">
                <SettingsIcon className="w-4 h-4" />
                <span>Settings</span>
              </CommandItem>
              <CommandItem onSelect={() => { lock(); setOpen(false); }} className="flex items-center gap-2 cursor-pointer">
                <Lock className="w-4 h-4" />
                <span>Lock</span>
              </CommandItem>
              <CommandItem onSelect={() => { shutdown(); setOpen(false); }} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                <Power className="w-4 h-4" />
                <span>Shut Down</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
