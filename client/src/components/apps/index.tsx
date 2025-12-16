import React from "react";
import { AppConfig } from "@/lib/os-context";
import { User, Briefcase, Terminal as TerminalIcon, Settings as SettingsIcon, Mail, Code, Globe, Image, FileText, Music, Video, Database as DatabaseIcon } from "lucide-react";

import About from "./about";
import Projects from "./projects";
import Terminal from "./terminal";
import Settings from "./settings";
import VSCode from "./vscode";
import Browser from "./browser";
import Notepad from "./notepad";
import Gallery from "./gallery";
import Contact from "./contact";
import Spotify from "./spotify";
import YouTube from "./youtube";
import Database from "./database";


export const APPS: AppConfig[] = [
  {
    id: "about",
    title: "About Me",
    icon: <User className="w-full h-full text-blue-500" />,
    component: <About />,
    width: 1000,
    height: 700
  },
  {
    id: "projects",
    title: "Projects",
    icon: <Briefcase className="w-full h-full text-purple-500" />,
    component: <Projects />,
    width: 1000,
    height: 700
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: <TerminalIcon className="w-full h-full text-zinc-800 dark:text-zinc-200" />,
    component: <Terminal />,
    width: 900,
    height: 650
  },
  {
    id: "settings",
    title: "Settings",
    icon: <SettingsIcon className="w-full h-full text-gray-500" />,
    component: <Settings />,
    width: 900,
    height: 650
  },
  {
    id: "vscode",
    title: "VS Code",
    icon: <Code className="w-full h-full text-blue-600" />,
    component: <VSCode />,
    width: 1000,
    height: 700
  },
  {
    id: "browser",
    title: "Browser",
    icon: <Globe className="w-full h-full text-green-500" />,
    component: <Browser />,
    width: 1000,
    height: 700
  },
  {
    id: "notepad",
    title: "Notepad",
    icon: <FileText className="w-full h-full text-orange-500" />,
    component: <Notepad />,
    width: 1000,
    height: 700
  },

  {
    id: "gallery" as any, // ID for Gallery
    title: "Gallery",
    icon: <Image className="w-full h-full text-pink-500" />,
    component: <Gallery />,
    width: 1000,
    height: 700
  },
  {
    id: "contact",
    title: "Contact",
    icon: <Mail className="w-full h-full text-red-500" />,
    component: <Contact />,
    width: 900,
    height: 650
  },
  {
    id: "spotify" as any,
    title: "Spotify",
    icon: <Music className="w-full h-full text-green-600" />,
    component: <Spotify />,
    width: 1000,
    height: 700
  },
  {
    id: "youtube" as any,
    title: "YouTube",
    icon: <Video className="w-full h-full text-red-600" />,
    component: <YouTube />,
    width: 1100,
    height: 800
  },
  {
    id: "db" as any,
    title: "Database",
    icon: <DatabaseIcon className="w-full h-full text-blue-400" />,
    component: <Database />,
    width: 1000,
    height: 700
  }
];
