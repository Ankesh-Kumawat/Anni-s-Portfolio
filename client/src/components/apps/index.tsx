import React from "react";
import { AppConfig } from "@/lib/os-context";
import { User, Briefcase, Terminal as TerminalIcon, Settings as SettingsIcon, Mail, Code, Globe, Image, FileText, Music, Video, Database as DatabaseIcon, Edit3 } from "lucide-react";

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
    title: "DevTunes",
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
  },
  {
    id: "editor" as any,
    title: "Portfolio Editor",
    icon: <Edit3 className="w-full h-full text-indigo-500" />,
    component: <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center space-y-4">
        <Edit3 className="w-16 h-16 mx-auto text-indigo-500" />
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Editor</h2>
        <p className="text-gray-600 max-w-md">This app opens in a new page for better experience.</p>
        <a
          href="/editor"
          target="_blank"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Open Editor
        </a>
      </div>
    </div>,
    width: 600,
    height: 400
  }
];
