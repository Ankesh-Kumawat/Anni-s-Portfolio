# Portfolio OS Editor - Full UI Redesign Master Prompt

## Project Context
This is a **Portfolio OS Editor** built with React + TypeScript + Tailwind CSS + Vite. It's a multi-step editor where users can configure their portfolio website. The editor is at `/editor` route.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Vite, Shadcn UI, Firebase, Lucide Icons

---

## 🎯 CRITICAL REQUIREMENTS

### 1. REMOVE PAGINATION/TABS SYSTEM
- Currently there are 11 steps with a sidebar navigation and Previous/Next buttons
- **REMOVE this completely** - Replace with a **single-page scrollable layout**
- All sections should be visible on one page, user scrolls down to see everything
- Remove the step indicator, progress bar for steps, and navigation buttons

### 2. SCREEN SCALE FIX
- Current issue: The editor renders at 80% zoom on desktop (see `vite.config.ts` or CSS)
- **FIX THIS** - Remove any zoom/scale CSS. Editor should render at 100% normal size
- Remove `#scale-root { zoom: 0.8; }` or similar CSS if present
- The editor should fill the full viewport normally

### 3. FILE STRUCTURE RENAME
Rename the file structure from `steps/Step1Personal/` to clean `pages/` structure:

**Current Structure (BAD):**
```
editor/
  steps/
    Step1Personal/
    Step2Contact/
    Step3Social/
    Step4Projects/
    Step5Notepad/
    Step6Advanced/
    Step7Review.tsx
    Step8Music/
    Step9YouTube/
    Step10Preferences/
    Step11Apps/
    TechStackManager.tsx
```

**New Structure (GOOD):**
```
editor/
  pages/
    PersonalInfo/
      index.tsx
      ProfileCardPreview.tsx
      BasicInfo.tsx
      BioCard.tsx
      SkillsSection.tsx
      ExperienceSection.tsx
    Contact/
      index.tsx
      EmailField.tsx
      LocationField.tsx
      CopyrightField.tsx
      WelcomeMessage.tsx
      LivePreview.tsx
    SocialLinks/
      index.tsx
      PlatformSelector.tsx
      LinksList.tsx
      SocialStats.tsx
      SocialPreview.tsx
      platforms.ts
    Projects/
      index.tsx
      ProjectCard.tsx
      ProjectForm.tsx
      ImageGallery.tsx
      StatsCard.tsx
      constants.ts
      types.ts
      useProjectHandlers.ts
    Notepad/
      index.tsx
      NotesList.tsx
      NotepadStats.tsx
    Advanced/
      index.tsx
      DatabaseSettings.tsx
      TerminalSettings.tsx
      SettingsApp.tsx
      AdvancedStats.tsx
    Music/
      index.tsx
    YouTube/
      index.tsx
    Preferences/
      index.tsx
    Apps/
      index.tsx
    Review/
      index.tsx (was Step7Review.tsx)
    TechStacks/
      index.tsx (was TechStackManager.tsx)
  components/
    EditorLayout.tsx
    Sidebar.tsx
    SectionCard.tsx
  types.ts
  index.tsx (main editor)
  lib/
    completionCalculator.ts
    generator.ts
```

### 4. UPDATE ALL IMPORTS
After renaming files, update ALL import paths in:
- `editor/index.tsx`
- All page files that import from other pages
- `App.tsx` if it imports editor

---

## 🎨 FULL UI REDESIGN SPECIFICATIONS

### A. Editor Layout (`editor/index.tsx`)

**Remove:**
- Step-based navigation sidebar
- Previous/Next buttons
- Step progress indicator
- Mobile blocker (keep it but simplify)

**Replace With:**
```
┌─────────────────────────────────────────────────────────┐
│ HEADER: PortfolioOS Editor    [Save] [Logout]           │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ SIDEBAR  │  MAIN CONTENT (Single Scrollable Page)       │
│ (Sticky) │                                              │
│          │  ┌──────────────────────────────────────┐    │
│ • Profile│  │ Profile Card Preview + Basic Info     │    │
│ • Contact│  │ Bio Section                           │    │
│ • Social │  │ Skills Matrix                         │    │
│ • Projects│ │ Work Experience                       │    │
│ • Notepad│  │ Contact Info                          │    │
│ • Music  │  │ Social Links                          │    │
│ • YouTube│  │ Projects Gallery                      │    │
│ • Apps   │  │ Notepad                               │    │
│ • Settings│ │ Music Library                         │    │
│ • Review │  │ YouTube                               │    │
│          │  │ Settings                              │    │
│          │  │ Review & Download                     │    │
│          │  └──────────────────────────────────────┘    │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**Sidebar Design:**
- Fixed/sticky on left side
- Width: 220px
- Dark glassmorphism style (bg-white/5 backdrop-blur-xl)
- Each item is a smooth scroll link (not route change)
- Clicking sidebar item scrolls to that section
- Active section highlighted based on scroll position
- Icons + Labels for each section
- Smooth scroll behavior

**Main Content:**
- Single scrollable container
- Each section is a card/component
- Sections have `id` attributes for scroll targeting
- Smooth scroll on sidebar click
- Full width, max-width ~1200px centered

### B. Header Design

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] PortfolioOS    [Save Button] [Logout Button]     │
└─────────────────────────────────────────────────────────┘
```

- Sticky top, full width
- Glassmorphism: bg-black/20 backdrop-blur-3xl
- Logo: Gradient violet-fuchsia icon
- Title: "PortfolioOS" with gradient text
- Save button: Gradient violet-fuchsia, rounded-xl
- Logout: Subtle ghost button
- Height: ~56px (compact)

### C. Sidebar Component

```tsx
// Sidebar should be a separate component
// It highlights based on scroll position (Intersection Observer)
// Clicking scrolls to section smoothly
```

**Design:**
- Background: `bg-white/[0.03] backdrop-blur-xl`
- Border: `border border-white/5`
- Rounded: `rounded-2xl`
- Each nav item:
  - Icon (Lucide) + Text label
  - Active: `bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 border border-violet-500/20`
  - Hover: `bg-white/5`
  - Padding: `px-3 py-2.5`
  - Rounded: `rounded-xl`
  - Font: `text-xs font-semibold`

### D. Section Cards (All sections follow this pattern)

Every section (PersonalInfo, Contact, Social, etc.) should be wrapped in a consistent card design:

```tsx
<div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 p-6 mb-6">
  {/* Section Header */}
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-white">Section Title</h2>
      <p className="text-xs text-zinc-500">Section description</p>
    </div>
  </div>
  
  {/* Section Content */}
  {children}
</div>
```

**Color Theme:**
- Background: `bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950`
- Cards: `bg-white/[0.03]` with `backdrop-blur-xl`
- Borders: `border-white/5` or `border-white/10`
- Primary gradient: `from-violet-500 to-fuchsia-500`
- Text: White for headings, zinc-400/500 for secondary
- Inputs: `bg-white/5 border-white/10 rounded-xl text-white`

### E. Form Inputs Design

All form inputs should follow this pattern:
```tsx
<input className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all" />
```

Labels:
```tsx
<label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
  <Icon className="w-4 h-4 text-violet-400" />
  Label Text
</label>
```

### F. Buttons Design

**Primary Button:**
```tsx
<button className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all">
  Button Text
</button>
```

**Secondary Button:**
```tsx
<button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-medium rounded-xl border border-white/10 transition-all">
  Button Text
</button>
```

**Danger Button:**
```tsx
<button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 transition-all">
  Delete
</button>
```

### G. Profile Card Preview (Left side of PersonalInfo)

Keep the existing ProfileCardPreview but update colors:
- Card background: `bg-gradient-to-br from-white via-zinc-50/90 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950`
- Border: `border border-white/10`
- Rounded: `rounded-3xl`
- Shadow: `shadow-xl`
- Avatar glow: `bg-gradient-to-r from-violet-500 to-fuchsia-500`

### H. Skills Section

- Category selector: Grid of cards with icons
- Skill chips: Toggle buttons with gradient when selected
- Selected skills: Displayed in a drawer with remove buttons
- Save button at the bottom

### I. Experience Section

- Timeline design with vertical line
- Each experience card with border and hover effect
- Add button in header
- Remove button on each card

### J. Contact Section

- Email, Location, Copyright fields
- Welcome message textarea
- Live preview of contact info

### K. Social Links Section

- Platform selector with icons
- Links list with add/remove
- Social stats display

### L. Projects Section

- Project cards grid
- Add/Edit project form
- Image gallery for project screenshots
- Stats cards

### M. Other Sections (Notepad, Music, YouTube, Apps, Settings, Review)

- Follow same card design pattern
- Each section is self-contained
- Consistent styling

---

## 🔧 TECHNICAL REQUIREMENTS

### 1. Scroll Spy Implementation
Use Intersection Observer to detect which section is in view and highlight corresponding sidebar item:

```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => {
    observer.observe(document.getElementById(section.id)!);
  });

  return () => observer.disconnect();
}, []);
```

### 2. Smooth Scroll
```tsx
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};
```

### 3. Remove Zoom CSS
Search and remove any of these from `index.css` or global styles:
```css
/* REMOVE THESE */
#scale-root { zoom: 0.8; }
@media (min-width: 1024px) { #scale-root { zoom: 0.8; } }
```

### 4. Fix Editor Height
Editor should be `h-screen` (full viewport height) with:
- Header: fixed height ~56px
- Content: `flex-1 overflow-y-auto`
- Sidebar: `sticky top-0 h-screen`

---

## 📋 CHECKLIST FOR AI

Before delivering the code, verify:

- [ ] All 11 steps converted to single-page sections
- [ ] Sidebar is sticky and scrolls to sections
- [ ] No pagination/navigation buttons remain
- [ ] Files renamed to `pages/` structure
- [ ] All imports updated
- [ ] Screen scale is 100% (no zoom)
- [ ] All components follow the glassmorphism dark theme
- [ ] Forms have consistent styling
- [ ] Buttons have gradient styles
- [ ] ProfileCardPreview works correctly
- [ ] Skills section toggle works
- [ ] Experience timeline works
- [ ] All save buttons work (Firebase)
- [ ] No TypeScript errors
- [ ] Responsive on large screens (min 1024px)

---

## 🎨 COLOR PALETTE REFERENCE

```
Background: #09090b (zinc-950)
Card: rgba(255,255,255,0.03) with backdrop-blur
Border: rgba(255,255,255,0.05)
Primary Gradient: #8b5cf6 → #d946ef (violet-500 → fuchsia-500)
Text Primary: #ffffff
Text Secondary: #71717a (zinc-500)
Text Muted: #52525b (zinc-600)
Success: #22c55e (green-500)
Danger: #ef4444 (red-500)
```

---

## ⚠️ IMPORTANT NOTES

1. **DO NOT change any business logic** - Only UI/styling changes
2. **Keep all Firebase integrations working** - Save buttons must still work
3. **Keep all existing functionality** - Just reorganize and restyle
4. **Test that data loads correctly** from Firebase
5. **Keep the MobileBlocker** component but it should be simpler
6. **The editor is desktop-only** (min 1024px width)

---

**Give this prompt to the AI along with access to the codebase. The AI should be able to implement all changes based on these specifications.**