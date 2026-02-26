import React from "react";
import { AppId } from "@/lib/os-context";
import { CheckCircle2, XCircle, Info, Folder, File } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

async function fetchTerminalData() {
    try {
        const res = await fetch('/data/terminal.json?t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) return await res.json();
    } catch (e) {
        // Fallback to Firebase
    }

    try {
        const docSnap = await getDoc(doc(db, "terminal", "main"));
        if (docSnap.exists()) return docSnap.data();
    } catch (e) {
        console.error("Failed to fetch terminal data from Firebase:", e);
    }

    try {
        const aboutSnap = await getDoc(doc(db, "about", "main"));
        if (aboutSnap.exists()) {
            const aboutData = aboutSnap.data();
            return {
                about: aboutData.personal?.bio || "",
                contact: { email: "", twitter: "", github: "", linkedin: "" },
                skills: { technical: aboutData.skills || [] },
                skillLevels: [],
                username: "visitor",
                userRole: "Guest"
            };
        }
    } catch (e) {
        console.error("Failed to fetch about data fallback:", e);
    }

    throw new Error("Couldn't load terminal data");
}

// Dev jokes pool
const DEV_JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "A SQL query walks into a bar, sees two tables and asks: 'Can I JOIN you?'",
    "There are only 10 types of people: those who understand binary and those who don't.",
    "Why do Java developers wear glasses? Because they can't C#.",
    "How many programmers does it take to change a light bulb? None. That's a hardware problem.",
    "!false — It's funny because it's true.",
    "A programmer's wife tells him: 'Go to the store and buy a loaf of bread. If they have eggs, buy a dozen.' He comes home with 12 loaves.",
    "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
    "What's a programmer's favorite hangout place? Foo Bar.",
    "I told my computer I needed a break. Now it won't stop sending me Kit-Kat ads.",
    "Debugging: Being the detective in a crime movie where you are also the murderer.",
    "It works on my machine. Then we'll ship your machine.",
];

export function handleCommand(cmd: string, launchApp: (AppId: AppId) => void): string | React.ReactNode {
    const cleanCmd = cmd.trim().toLowerCase();
    const parts = cleanCmd.split(" ");
    const command = parts[0];
    const args = parts.slice(1).join(" ");

    switch (command) {
        case "help":
            return (
                <div className="space-y-4">
                    <div className="text-cyan-400 font-bold flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Command Reference
                    </div>
                    <div className="grid gap-1.5">
                        {[
                            ["help", "Show this help menu"],
                            ["commands", "Interactive command browser"],
                            ["neofetch", "System info (like real neofetch)"],
                            ["whoami", "Display current user"],
                            ["skills", "Show skills with progress bars"],
                            ["social", "Social media links"],
                            ["ls", "List directory contents"],
                            ["cat <file>", "Read file contents"],
                            ["open <app>", "Launch an application"],
                            ["date", "Show current date/time"],
                            ["uptime", "Show session uptime"],
                            ["echo <text>", "Print text to terminal"],
                            ["joke", "Random dev joke"],
                            ["matrix", "Enter the Matrix"],
                            ["sudo hire-me", "Try it ;)"],
                            ["clear", "Clear terminal screen"],
                        ].map(([cmd, desc]) => (
                            <div key={cmd} className="grid grid-cols-[160px_1fr] gap-4 px-2 py-1.5 rounded bg-zinc-900/50">
                                <span className="text-cyan-400 font-mono text-xs">{cmd}</span>
                                <span className="text-zinc-400 text-xs">{desc}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-zinc-500 text-xs pt-2 border-t border-zinc-800">
                        Tip: Type <span className="text-cyan-400">commands</span> for an interactive command browser
                    </div>
                </div>
            );

        case "neofetch": {
            const ua = navigator.userAgent;
            const browser = ua.includes("Edg/") ? "Edge"
                : ua.includes("Chrome") ? "Chrome"
                    : ua.includes("Firefox") ? "Firefox"
                        : ua.includes("Safari") ? "Safari" : "Unknown";
            const browserVer = ua.match(/(Chrome|Firefox|Edg|Safari)\/(\d+)/)?.[2] || "";
            const os = navigator.platform || "Web";
            const lang = navigator.language;
            const cores = navigator.hardwareConcurrency || "N/A";
            const res = `${window.screen.width}x${window.screen.height}`;
            const dpr = window.devicePixelRatio || 1;
            const mem = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "N/A";
            const online = navigator.onLine ? "Connected" : "Offline";
            const startTime = sessionStorage.getItem("boot-time");
            if (!startTime) sessionStorage.setItem("boot-time", Date.now().toString());
            const elapsed = startTime ? Date.now() - parseInt(startTime) : 0;
            const hrs = Math.floor(elapsed / 3600000);
            const mins = Math.floor((elapsed % 3600000) / 60000);
            const secs = Math.floor((elapsed % 60000) / 1000);
            const uptime = hrs > 0 ? `${hrs}h ${mins}m` : mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

            const infoLines: [string, string, string][] = [
                ["OS", "Portfolio OS v2.0.0", "text-cyan-400"],
                ["Host", os, "text-violet-400"],
                ["Browser", `${browser} ${browserVer}`, "text-pink-400"],
                ["Resolution", `${res} @ ${dpr}x`, "text-amber-400"],
                ["Uptime", uptime, "text-green-400"],
                ["Packages", "12 (apps)", "text-teal-400"],
                ["Shell", "portfolio-bash 2.0", "text-red-400"],
                ["WM", "Portfolio Window Manager", "text-blue-400"],
                ["Theme", "Glassmorphism Dark", "text-emerald-400"],
                ["Icons", "Lucide React", "text-orange-400"],
                ["CPU", `${cores} cores`, "text-indigo-400"],
                ["Memory", mem, "text-rose-400"],
                ["Locale", lang, "text-lime-400"],
                ["Network", online, "text-sky-400"],
            ];

            return (
                <div className="flex gap-5 items-start py-1">
                    <pre className="text-[11px] leading-[13px] font-mono flex-shrink-0 select-none" style={{
                        background: "linear-gradient(180deg, #06b6d4 0%, #8b5cf6 40%, #ec4899 70%, #f97316 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>{`
   ╭───────────────────────╮
   │  ┌─────────────────┐  │
   │  │  PORTFOLIO      │  │
   │  │      OS  v2.0   │  │
   │  │                 │  │
   │  │  ▸ visitor@pos  │  │
   │  │  ▸ _            │  │
   │  └─────────────────┘  │
   ╰──────────┬────────────╯
              │
         ╭────┴────╮
         ╰─────────╯`}
                    </pre>
                    <div className="space-y-0.5 text-[12px] font-mono min-w-0 pt-1">
                        <div className="font-bold" style={{
                            background: "linear-gradient(90deg, #06b6d4, #8b5cf6)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>visitor@portfolio-os</div>
                        <div className="text-zinc-600 text-[10px]">{'─'.repeat(28)}</div>
                        {infoLines.map(([label, value, color]) => (
                            <div key={label} className="flex">
                                <span className={`${color} font-bold w-[110px] flex-shrink-0`}>{label}</span>
                                <span className="text-zinc-300">{value}</span>
                            </div>
                        ))}
                        <div className="pt-2 space-y-1">
                            <div className="flex gap-[3px]">
                                {["bg-zinc-900", "bg-red-600", "bg-green-600", "bg-yellow-500", "bg-blue-600", "bg-violet-600", "bg-cyan-500", "bg-zinc-300"].map(c => (
                                    <div key={c} className={`w-[18px] h-[18px] rounded-[3px] ${c}`} />
                                ))}
                            </div>
                            <div className="flex gap-[3px]">
                                {["bg-zinc-600", "bg-red-400", "bg-green-400", "bg-amber-300", "bg-blue-400", "bg-purple-400", "bg-teal-300", "bg-white"].map(c => (
                                    <div key={c} className={`w-[18px] h-[18px] rounded-[3px] ${c}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        case "skills":
            return fetchTerminalData()
                .then(data => {
                    const skillLevels = data.skillLevels;
                    if (!skillLevels || skillLevels.length === 0) {
                        // Fallback: show technical skills as list
                        const tech = data.skills?.technical || [];
                        return (
                            <div className="space-y-2">
                                <div className="text-cyan-400 font-bold text-sm">Skills</div>
                                <div className="flex flex-wrap gap-2">
                                    {tech.map((s: string) => (
                                        <span key={s} className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-mono">{s}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div className="space-y-2">
                            <div className="text-cyan-400 font-bold text-sm">Skills & Proficiency</div>
                            {skillLevels.map((skill: any) => (
                                <div key={skill.name} className="space-y-0.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-zinc-300 font-mono">{skill.name}</span>
                                        <span className="text-zinc-500">{skill.level}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${skill.level}%`,
                                                background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                                                boxShadow: `0 0 8px ${skill.color}40`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })
                .catch(() => <div className="text-red-400">Error loading skills data</div>);

        case "social":
            return (
                <div className="space-y-2">
                    <div className="text-cyan-400 font-bold text-sm">Connect With Me</div>
                    <div className="grid gap-1.5">
                        {[
                            { name: "GitHub", url: "github.com/ankeshkumawat", color: "text-zinc-300" },
                            { name: "LinkedIn", url: "linkedin.com/in/ankeshkumawat", color: "text-blue-400" },
                            { name: "Twitter", url: "twitter.com/ankeshkumawat", color: "text-sky-400" },
                            { name: "Email", url: "ankeshkumawat.dev@gmail.com", color: "text-green-400" },
                        ].map(s => (
                            <div key={s.name} className="flex items-center gap-3 px-2 py-1.5 rounded bg-zinc-900/50">
                                <span className={`text-xs font-mono w-20 ${s.color}`}>{s.name}</span>
                                <span className="text-zinc-400 text-xs">{s.url}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );

        case "joke": {
            const joke = DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)];
            return (
                <div className="space-y-2 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <div className="text-amber-400 font-bold text-xs">Random Dev Joke</div>
                    <div className="text-zinc-300 text-sm leading-relaxed">{joke}</div>
                </div>
            );
        }

        case "matrix":
            return (
                <div className="space-y-1">
                    <div className="text-green-400 font-bold text-sm">Entering the Matrix...</div>
                    <pre className="text-green-500/80 text-[9px] leading-[11px] font-mono overflow-hidden">
                        {`01001000 01100101 01101100 01101100 01101111
01010111 01101111 01110010 01101100 01100100                      
╔══════════════════════════════════════════╗
║  Wake up, Neo...                        ║
║  The Matrix has you...                  ║
║  Follow the white rabbit.              ║
║                                          ║
║  Knock, knock.                          ║
╚══════════════════════════════════════════╝
01010100 01101000 01100101 01001101 01100001
01110100 01110010 01101001 01111000 00100001`}
                    </pre>
                    <div className="text-green-400/60 text-xs">There is no spoon.</div>
                </div>
            );

        case "sudo":
            if (args === "hire-me" || args === "hire me") {
                return (
                    <div className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20">
                        <div className="text-green-400 font-bold">Access Granted!</div>
                        <div className="text-zinc-300 text-sm">
                            Congratulations! You've unlocked the secret hiring protocol.
                        </div>
                        <div className="text-zinc-400 text-xs space-y-1">
                            <div>Initiating candidate evaluation... <span className="text-green-400">PASSED</span></div>
                            <div>Checking portfolio quality... <span className="text-green-400">EXCELLENT</span></div>
                            <div>Verifying skill match... <span className="text-green-400">98% MATCH</span></div>
                        </div>
                        <div className="text-emerald-400 text-xs pt-1 border-t border-green-500/20">
                            Reach out: ankeshkumawat.dev@gmail.com
                        </div>
                    </div>
                );
            }
            return (
                <div className="text-red-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    <span>sudo: permission denied. Nice try though.</span>
                </div>
            );

        case "rm":
            if (args.startsWith("-rf")) {
                return (
                    <div className="space-y-1">
                        <div className="text-red-400 font-bold text-sm">Nice try!</div>
                        <div className="text-zinc-400 text-xs">
                            This portfolio is protected by advanced anti-destruction protocols.
                        </div>
                        <div className="text-zinc-500 text-xs">
                            Also, you don't have root access. This is MY machine.
                        </div>
                    </div>
                );
            }
            return <div className="text-red-400">rm: missing operand</div>;

        case "uptime": {
            const bootTime = sessionStorage.getItem("boot-time");
            if (!bootTime) sessionStorage.setItem("boot-time", Date.now().toString());
            const elapsed = bootTime ? Date.now() - parseInt(bootTime) : 0;
            const mins = Math.floor(elapsed / 60000);
            const secs = Math.floor((elapsed % 60000) / 1000);
            return (
                <div className="text-zinc-300 text-sm font-mono">
                    up {mins}m {secs}s, 1 user, load average: 0.42, 0.38, 0.35
                </div>
            );
        }

        case "ls":
            return (
                <div className="space-y-3">
                    <div className="text-zinc-500 text-xs">Listing directory contents...</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400">about.txt</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <Folder className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400">projects/</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">skills.json</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400">contact.md</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400">settings.conf</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-zinc-900/50 border border-zinc-800">
                            <File className="w-4 h-4 text-red-400" />
                            <span className="text-red-400">resume.pdf</span>
                        </div>
                    </div>
                </div>
            );

        case "whoami":
            return fetchTerminalData()
                .then(data => (
                    <div className="space-y-2">
                        <div className="text-cyan-400 font-bold">{data.username}</div>
                        <div className="text-zinc-500 text-xs">{data.userRole}</div>
                    </div>
                ))
                .catch(() => (
                    <div className="text-red-400">Error loading user data</div>
                ));

        case "date": {
            const now = new Date();
            return (
                <div className="space-y-1">
                    <div className="text-cyan-400">{now.toLocaleString()}</div>
                    <div className="text-zinc-500 text-xs">
                        {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            );
        }

        case "echo":
            return args || "";

        case "cat":
            if (args === "about.txt" || args === "about") {
                return fetchTerminalData()
                    .then(data => (
                        <div className="space-y-2 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="text-cyan-400 font-bold">about.txt</div>
                            <div className="text-zinc-300">{data.about}</div>
                        </div>
                    ))
                    .catch(() => <div className="text-red-400">Error loading file</div>);
            } else if (args === "contact.md" || args === "contact") {
                return fetchTerminalData()
                    .then(data => (
                        <div className="space-y-2 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="text-cyan-400 font-bold">contact.md</div>
                            <div className="space-y-1 text-zinc-300">
                                <div>Email: {data.contact.email}</div>
                                <div>Twitter: {data.contact.twitter}</div>
                                <div>GitHub: {data.contact.github}</div>
                                <div>LinkedIn: {data.contact.linkedin}</div>
                            </div>
                        </div>
                    ))
                    .catch(() => <div className="text-red-400">Error loading file</div>);
            } else if (args === "skills.json" || args === "skills") {
                return fetchTerminalData()
                    .then(data => (
                        <div className="space-y-2 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                            <div className="text-cyan-400 font-bold">skills.json</div>
                            <pre className="text-green-400 text-xs overflow-x-auto">
                                {JSON.stringify(data.skills, null, 2)}
                            </pre>
                        </div>
                    ))
                    .catch(() => <div className="text-red-400">Error loading file</div>);
            } else if (!args) {
                return (
                    <div className="flex items-center gap-2 text-orange-400">
                        <XCircle className="w-4 h-4" />
                        <span>usage: cat &lt;filename&gt;</span>
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span>cat: {args}: No such file or directory</span>
                    </div>
                );
            }

        case "open": {
            const appsMap: Record<string, AppId> = {
                "about": "about",
                "projects": "projects",
                "settings": "settings",
                "terminal": "terminal",
                "vscode": "vscode",
                "browser": "browser",
                "notepad": "notepad",
                "calculator": "calculator",
                "gallery": "gallery",
                "contact": "contact",
                "spotify": "spotify",
                "youtube": "youtube",
                "db": "db",
                "database": "db",
            };

            if (appsMap[args]) {
                launchApp(appsMap[args]);
                return (
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Launching {args}...</span>
                    </div>
                );
            } else if (!args) {
                return (
                    <div className="flex items-center gap-2 text-orange-400">
                        <XCircle className="w-4 h-4" />
                        <span>usage: open &lt;app_name&gt;</span>
                    </div>
                );
            } else {
                return (
                    <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span>open: application '{args}' not found</span>
                    </div>
                );
            }
        }

        case "clear":
            return "";

        case "sudo":
            if (args === "hire-me" || args === "hire me") {
                return (
                    <div className="space-y-3">
                        <div className="text-green-400 font-bold animate-pulse">
                            🚀 ACCESS GRANTED
                        </div>
                        <div className="text-zinc-300">
                            Impressive! You know your way around a terminal.
                        </div>
                        <div className="text-cyan-400">
                            → Let's talk: Check the Contact app!
                        </div>
                        <div className="text-zinc-500 text-xs mt-2">
                            (Seriously though, I'd love to hear from you)
                        </div>
                    </div>
                );
            } else if (args.startsWith("rm")) {
                return (
                    <div className="space-y-2">
                        <div className="text-red-400 font-bold">⚠️ CRITICAL ERROR</div>
                        <div className="text-zinc-300">Nice try! But this portfolio is delete-proof 😎</div>
                        <div className="text-zinc-500 text-xs">
                            (Don't worry, nothing was harmed in the making of this joke)
                        </div>
                    </div>
                );
            }
            return (
                <div className="text-red-400">
                    sudo: {args}: command not found
                </div>
            );

        case "rm":
            if (args.includes("-rf") || args.includes("/")) {
                return (
                    <div className="space-y-2">
                        <div className="text-yellow-400">⚠️ WARNING: Dangerous command detected!</div>
                        <div className="text-zinc-300">
                            Deleting system files... Just kidding! 😄
                        </div>
                        <div className="text-zinc-500 text-xs">
                            This is a safe space. No files were harmed.
                        </div>
                    </div>
                );
            }
            return <div className="text-red-400">rm: missing operand</div>;

        case "hack":
        case "hacker":
            return (
                <div className="space-y-2">
                    <div className="text-green-400 font-mono">
                        [████████████████████] 100%
                    </div>
                    <div className="text-green-400">
                        Hacking mainframe... Access denied!
                    </div>
                    <div className="text-zinc-500 text-xs">
                        (This isn't Mr. Robot, but nice try 😉)
                    </div>
                </div>
            );

        case "coffee":
            return (
                <div className="space-y-2">
                    <div className="text-amber-600">☕</div>
                    <div className="text-zinc-300">
                        Brewing coffee... Done!
                    </div>
                    <div className="text-zinc-500 text-xs">
                        (Virtual coffee tastes just as good)
                    </div>
                </div>
            );

        case "":
            return "";

        default:
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span>command not found: {command}</span>
                    </div>
                    <div className="text-zinc-500 text-xs">
                        Type <span className="text-cyan-400">help</span> or <span className="text-cyan-400">commands</span> to see available commands
                    </div>
                </div>
            );
    }
}
