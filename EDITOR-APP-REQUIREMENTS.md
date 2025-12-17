# Portfolio Editor App - Requirements

## Current Status ✅

### Centralized Data Structure (Completed)

All portfolio apps now fetch data from centralized JSON files located in `client/public/data/`:

```
client/public/data/
  ├── about.json          ✅ Personal info, skills, experience
  ├── contact.json        ✅ Email, location, message
  ├── notepad.json        ✅ Default notes content
  ├── social.json         ✅ Social media links (Browser app)
  ├── terminal.json       ✅ Terminal commands data
  ├── database.json       ✅ User profile data
  ├── settings.json       ✅ Account settings
  ├── projects.json       ✅ All 4 projects with full details
  └── gallery.json        ✅ Folder structure with images
```

### Assets Organization (Completed)

```
client/public/assets/
  ├── music/              ✅ All music files (27 songs)
  ├── projects/           ✅ Project screenshots
  └── personal/           ✅ Personal photos
```

### Benefits:
- ✅ Single source of truth for all data
- ✅ Easy to edit/replace data
- ✅ No cache issues (cache busting implemented)
- ✅ Clean, organized structure
- ✅ Ready for editor app integration

---

## Editor App Requirements 🎯

### Concept: Portfolio Data Generator (SaaS Level)

**Goal:** Create a separate web app where users can fill their portfolio data step-by-step and download a ready-to-use package.

### Core Features:

#### 1. **Step-by-Step Form System** (JSON Structure Mapped)

**Each step maps exactly to JSON files:**

##### **Step 1: Personal Info** → `about.json`
```json
{
  "personal": {
    "name": "...",
    "title": "...",
    "location": "...",
    "avatar": "...",
    "bio": "..."
  },
  "skills": ["..."],
  "experience": [...]
}
```
- Text inputs: name, title, location
- Textarea: bio (with character count)
- Image upload: avatar (with preview)
- Skills: Dynamic tag input (add/remove)
- Experience: Repeatable form fields (add/remove jobs)

##### **Step 2: Contact Info** → `contact.json`
```json
{
  "email": "...",
  "location": "...",
  "message": "...",
  "copyright": "..."
}
```
- Email input with validation
- Location text input
- Message textarea
- Copyright text input

##### **Step 3: Social Links** → `social.json`
```json
{
  "links": [
    { "name": "...", "url": "...", "platform": "..." }
  ]
}
```
- Dynamic list of social links
- Platform selector (github, linkedin, twitter, etc.)
- URL validation
- Add/remove links

##### **Step 4: Projects** → `projects.json`
```json
{
  "projects": [
    {
      "id": "...",
      "name": "...",
      "tagline": "...",
      "description": "...",
      "status": "...",
      "platform": "...",
      "techStack": ["..."],
      "overview": "...",
      "problem": "...",
      "solution": "...",
      "outcome": "...",
      "features": [{"title": "...", "description": "..."}],
      "architecture": {...},
      "challenges": [...],
      "images": ["..."],
      "github": "...",
      "liveDemo": "..."
    }
  ]
}
```
- Add/edit/delete projects
- Rich form for each project
- Image upload for screenshots (multiple)
- Tech stack: dynamic tag input
- Features: repeatable fields
- Challenges: repeatable fields
- Architecture: nested object form

##### **Step 5: Gallery** → `gallery.json`
```json
{
  "folders": [
    {
      "id": "...",
      "name": "...",
      "coverImage": "...",
      "children": [...]
    }
  ],
  "directImages": [...]
}
```
- Folder tree builder
- Drag-drop image upload
- Organize images into folders
- Set cover images

##### **Step 6: Notepad** → `notepad.json`
```json
{
  "defaultNotes": [
    {
      "id": "...",
      "title": "...",
      "content": "...",
      "isPinned": true/false
    }
  ]
}
```
- Add/edit notes
- Markdown editor with preview
- Pin/unpin notes

##### **Step 7: Terminal & Database** → `terminal.json`, `database.json`
```json
// terminal.json
{
  "username": "...",
  "userRole": "...",
  "about": "...",
  "contact": {...},
  "skills": {...}
}

// database.json
{
  "user": {
    "user_id": "...",
    "name": "...",
    "nickname": "...",
    ...
  }
}
```
- Auto-populated from previous steps
- Allow manual override

##### **Step 8: Settings & Music** → `settings.json` + music files
```json
// settings.json
{
  "account": {
    "name": "...",
    "role": "...",
    "avatar": "..."
  }
}
```
- Music file upload (optional)
- Settings configuration
- Final review of all data

##### **Step 9: Review & Download**
- Preview all JSON files
- Preview uploaded assets
- Edit any section (go back to step)
- Generate & Download ZIP

#### 2. **Resource Picker**
- **Image Upload:** Avatar, project screenshots, gallery photos
- **File Upload:** Music files for DevTunes app
- **Preview:** Show how data will look in portfolio

#### 3. **UI/UX Design**
- **Match Portfolio Design:** Use same shadcn/ui components
- **Responsive:** Works on mobile, tablet, desktop
- **Clean & Modern:** Same aesthetic as portfolio OS

#### 4. **Output Generation**
- **Generate ZIP file** containing:
  ```
  portfolio-data.zip
    ├── data/              (All JSON files)
    │   ├── about.json
    │   ├── contact.json
    │   ├── projects.json
    │   ├── gallery.json
    │   ├── notepad.json
    │   ├── social.json
    │   ├── terminal.json
    │   ├── database.json
    │   └── settings.json
    └── assets/            (All uploaded resources)
        ├── music/         (Uploaded songs)
        ├── projects/      (Project images)
        └── personal/      (Personal photos)
  ```

#### 5. **User Workflow**
1. User opens editor app
2. Fills data step-by-step
3. Uploads images/files
4. Reviews everything
5. Clicks "Generate & Download"
6. Gets ZIP file
7. Extracts ZIP
8. Replaces `client/public/data/` and `client/public/assets/` folders
9. Portfolio updated! ✅

### Technical Stack:
- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui (same as portfolio)
- **File Handling:** JSZip library for ZIP generation
- **Image Processing:** Browser-based (canvas API)
- **State Management:** React Context or Zustand
- **Form Validation:** Zod + React Hook Form

### Benefits:
- ✅ No coding required for users
- ✅ Visual, intuitive interface
- ✅ Instant preview
- ✅ One-click portfolio update
- ✅ Reusable for multiple portfolios
- ✅ SaaS-ready architecture

### Folder Structure:
```
client/src/
  ├── pages/
  │   ├── not-found.tsx
  │   └── editor/              (NEW - Hidden route)
  │       ├── index.tsx        (Main editor page)
  │       ├── steps/
  │       │   ├── Step1Personal.tsx
  │       │   ├── Step2Contact.tsx
  │       │   ├── Step3Social.tsx
  │       │   ├── Step4Projects.tsx
  │       │   ├── Step5Gallery.tsx
  │       │   ├── Step6Notepad.tsx
  │       │   ├── Step7Advanced.tsx
  │       │   └── Step8Review.tsx
  │       ├── components/
  │       │   ├── StepIndicator.tsx
  │       │   ├── FormField.tsx
  │       │   └── ImageUpload.tsx
  │       └── lib/
  │           ├── generator.ts  (ZIP generation)
  │           └── validator.ts  (Data validation)
```

### Access Control:
- **Hidden Route:** `/editor` (no links in portfolio)
- **Access:** Only by typing URL manually
- **No Navigation:** Not in menu, not in apps
- **Secret URL:** Users must know the exact path

### Route Setup:
```tsx
// App.tsx
<Switch>
  <Route path="/" component={Desktop} />
  <Route path="/editor" component={Editor} />  // Hidden route
  <Route component={NotFound} />
</Switch>
```

---

## Next Steps:
1. ✅ Create `/editor` route in App.tsx
2. ✅ Build editor page structure
3. ✅ Install JSZip dependency
4. ✅ Create step components
5. ✅ Implement form logic
6. ✅ Add ZIP generation
7. ✅ Test & deploy
