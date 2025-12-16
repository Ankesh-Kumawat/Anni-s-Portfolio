import { useOS, AppConfig } from "@/lib/os-context";

interface DesktopIconProps {
  app: AppConfig;
}

export function DesktopIcon({ app }: DesktopIconProps) {
  const { launchApp } = useOS();

  return (
    <button
      onClick={() => launchApp(app.id)}
      className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent/50 transition-colors w-24 cursor-pointer active:scale-95 duration-100"
    >
      <div className="w-14 h-14 p-3 bg-background border shadow-sm rounded-xl group-hover:shadow-md transition-all duration-200 flex items-center justify-center text-foreground">
        {app.icon}
      </div>
      <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground text-center line-clamp-2 select-none font-sans leading-tight">
        {app.title}
      </span>
    </button>
  );
}
