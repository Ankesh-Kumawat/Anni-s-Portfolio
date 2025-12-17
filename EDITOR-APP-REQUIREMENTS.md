# Editor App Requirements

## Phase 1: Complete Analysis ✅

### Apps with Personal Details:

#### 1. **About App** (`client/src/components/apps/about/`)
**Files:**
- `ProfileSidebar.tsx`
- `AboutContent.tsx`

**Personal Data Fields:**
- Avatar Image: `https://github.com/shadcn.png`
- Name/Title: `"Design Engineer"`
- Location: `"San Francisco, CA"`
- Bio/About: Long text paragraph
- Social Links: GitHub, LinkedIn, Email, Website (buttons only, no URLs)
- Skills: Array `["React", "TypeScript", "Next.js", ...]`
- Experience: Array of objects:
  - Job Title: `"Senior Frontend Engineer"`
  - Company: `"TechCorp Inc."`
  - Period: `"2023 - Present"`
  - Description: Text

#### 2. **Contact App** (`client/src/components/apps/contact/`)
**Files:**
- `ContactSidebar.tsx`

**Personal Data Fields:**
- Email: `"ankeshkumawat155@gmail.com"`
- Address/Location: `"Rajasthan, India"`
- Copyright Text: `"© 2025 Portfolio OS"`

#### 3. **Projects App** (`client/src/components/apps/projects/`)
**Files:**
- `data.ts` (PROJECTS array)

**Personal Data Fields:**
- Projects: Array of project objects:
  - id, name, tagline, description
  - status, platform, techStack
  - overview, problem, solution, outcome
  - features, architecture, challenges
  - images, github, liveDemo

#### 4. **Browser App** (`client/src/components/apps/browser/`)
**Files:**
- `BrowserHome.tsx`

**Personal Data Fields:**
- Social Links Array (SOCIAL_LINKS):
  - Portfolio: `https://anni-portfolio-eight.vercel.app/`
  - GitHub: `https://github.com/ankeshkumawat`
  - LinkedIn: `https://linkedin.com/in/ankesh-kumawat`
  - Instagram, Twitter, YouTube, Dev.to, Medium URLs

#### 5. **Terminal App** (`client/src/components/apps/terminal/`)
**Files:**
- `commands.tsx`

**Personal Data Fields:**
- Username: `visitor@portfolio-os`
- About text: "Design Engineer based in SF..."
- Contact info in `cat contact.md`:
  - Email: `hello@example.com`
  - Twitter, GitHub, LinkedIn URLs
- Skills in `cat skills.json`:
  - Languages, Frameworks, Tools, Databases arrays

#### 6. **Settings App** (`client/src/components/apps/settings/`)
**Files:**
- `AccountSettings.tsx`

**Personal Data Fields:**
- Avatar: `https://github.com/shadcn.png`
- Name: `"John Doe"`
- Role: `"Administrator"`

#### 7. **Database App** (`client/src/components/apps/database/`)
**Files:**
- `data.ts`

**Personal Data Fields:**
- USER_DATA array:
  - user_id: `"U-0001"`
  - name: `"Ankesh Kumawat"`
  - nickname: `"Anni"`
  - role: `"System Owner"`
  - profession: `"Flutter Developer"`
  - primary_stack: `"Flutter (Android, Web)"`
  - focus_area: Text
- PROJECTS_DATA: Project details (P-001 to P-004)

#### 8. **Gallery App** (`client/src/components/apps/gallery/`)
**Files:**
- `constants.ts`

**Personal Data Fields:**
- IMAGES: Array of Unsplash image URLs (generic nature photos)
- ❌ NO PERSONAL DATA

#### 9. **Notepad App** (`client/src/components/apps/notepad/`)
**Files:**
- `index.tsx` (DEFAULT_NOTES)

**Personal Data Fields:**
- Default Note "About Me":
  - Name: `"Anni"`
  - Bio: "I'm a passionate developer..."
  - Skills/Tech Stack: React, TypeScript, Flutter, etc.
  - Projects list
  - Contact: Email, GitHub, Twitter, LinkedIn
  - Philosophy and focus areas

#### 10. **Spotify/DevTunes App** (`client/src/components/apps/spotify/`)
**Files:**
- `data.ts`
- `utils/metadata.ts`

**Personal Data Fields:**
- Playlist name: `"My Music Collection"`
- Songs: Auto-loaded from `/public/music/` folder
- ❌ NO HARDCODED PERSONAL DATA (dynamic music files)

#### 11. **VSCode App** (`client/src/components/apps/vscode/`)
**Files:**
- `constants.ts`

**Personal Data Fields:**
- Package.json name: `"portfolio-os"`
- README content: Generic project description
- ❌ NO PERSONAL DATA (just demo code files)

#### 12. **YouTube App** (`client/src/components/apps/youtube/`)
**Files:**
- `constants.ts`

**Personal Data Fields:**
- VIDEOS: Array of generic video data (Unsplash thumbnails)
- ❌ NO PERSONAL DATA (just demo videos)

---

## Summary of Apps with Personal Data:

### ✅ Apps with Personal Data (7):
1. **About** - Avatar, Name, Title, Location, Bio, Skills, Experience
2. **Contact** - Email, Address
3. **Projects** - Full project portfolio
4. **Browser** - Social media links
5. **Terminal** - Username, About, Contact, Skills
6. **Settings** - Avatar, Name, Role
7. **Database** - Complete user profile and projects
8. **Notepad** - About Me note with bio and contact

### ❌ Apps without Personal Data (4):
1. **Gallery** - Generic nature photos
2. **Spotify/DevTunes** - Dynamic music files
3. **VSCode** - Demo code files
4. **YouTube** - Generic video list

---

## Phase 2: Centralized Data Structure ✅

### New Folder Structure:
```
public/
  data/                    (NEW - Single source of truth)
    about.json            ✅ Created
    contact.json          ✅ Created
    projects.json         (To be created)
    gallery.json          (To be created)
    terminal.json         ✅ Created
    database.json         ✅ Created
    notepad.json          ✅ Created
    social.json           ✅ Created (browser links)
    settings.json         ✅ Created
    
  assets/
    music/                (Already exists)
    images/               (To be organized)
      projects/
      personal/
```

### Benefits:
- ✅ Single folder for all data
- ✅ Easy to edit/replace
- ✅ No hunting across multiple files
- ✅ Clean, organized structure
- ✅ Perfect for editor app

### Next Steps:
1. Create projects.json with all project data
2. Create gallery.json with folder structure
3. Update all apps to fetch from /data/*.json
4. Organize images in /assets/images/

---

## Phase 3: Implementation (To be filled)
...
