export const SKILL_COLORS: Record<string, string> = {
    // Frontend
    "React": "#61dafb",
    "React.js": "#61dafb",
    "Next.js": "#cbd5e1",
    "NextJS": "#cbd5e1",
    "Vue": "#4fc08d",
    "Vue.js": "#4fc08d",
    "Angular": "#dd0031",
    "Svelte": "#ff3e00",
    "HTML": "#e34f26",
    "HTML5": "#e34f26",
    "CSS": "#1572b6",
    "CSS3": "#1572b6",
    "JavaScript": "#f7df1e",
    "TypeScript": "#3178c6",
    "Tailwind": "#06b6d4",
    "Tailwind CSS": "#06b6d4",
    "Sass": "#cc6699",
    "Bootstrap": "#7952b3",
    "Redux": "#764abc",
    "Figma": "#f24e1e",

    // Backend
    "Node.js": "#68a063",
    "Node": "#68a063",
    "Express": "#94a3b8",
    "Express.js": "#94a3b8",
    "Python": "#3776ab",
    "Django": "#092e20",
    "Flask": "#94a3b8",
    "FastAPI": "#009688",
    "Java": "#b07219",
    "Spring Boot": "#6db33f",
    "C#": "#239120",
    ".NET": "#512bd4",
    "PHP": "#777bb4",
    "Laravel": "#ff2d20",
    "Go": "#00add8",
    "Golang": "#00add8",
    "Rust": "#dea584",
    "Ruby": "#cc342d",
    "Ruby on Rails": "#cc342d",
    "C++": "#00599c",
    "C": "#555555",

    // Mobile
    "Flutter": "#02569b",
    "Dart": "#0175c2",
    "React Native": "#61dafb",
    "Swift": "#f05138",
    "Kotlin": "#7f52ff",
    "Android": "#3ddc84",
    "iOS": "#94a3b8",

    // Database
    "MongoDB": "#47a248",
    "PostgreSQL": "#336791",
    "MySQL": "#4479a1",
    "SQLite": "#003b57",
    "Redis": "#dc382d",
    "Firebase": "#ffca28",
    "Supabase": "#3ecf8e",
    "Prisma": "#2d3748",
    "GraphQL": "#e10098",

    // DevOps & Tools
    "Git": "#f05032",
    "GitHub": "#cbd5e1",
    "GitLab": "#fc6d26",
    "Docker": "#2496ed",
    "Kubernetes": "#326ce5",
    "AWS": "#ff9900",
    "Azure": "#0078d4",
    "Google Cloud": "#4285f4",
    "GCP": "#4285f4",
    "Vercel": "#cbd5e1",
    "Netlify": "#00c7b7",
    "Heroku": "#430098",
    "Linux": "#fcc624",
    "Ubuntu": "#e95420",
    "Bash": "#4eaa25",
    "Jest": "#c21325",
    "Cypress": "#17202c"
};

// Fallback colors for unknown skills
const FALLBACK_COLORS = [
    "#06b6d4", // Cyan
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f97316", // Orange
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#f43f5e", // Rose
    "#84cc16", // Lime
];

/**
 * Gets a reliable color for a given skill name
 */
export function getSkillColor(skillName: string): string {
    // Direct match (case-insensitive)
    const normalizedName = skillName.trim();
    const entry = Object.entries(SKILL_COLORS).find(
        ([key]) => key.toLowerCase() === normalizedName.toLowerCase()
    );

    if (entry) return entry[1];

    // Partial match (e.g., "React.js / Next.js" -> uses React color)
    for (const [key, color] of Object.entries(SKILL_COLORS)) {
        if (normalizedName.toLowerCase().includes(key.toLowerCase())) {
            return color;
        }
    }

    // Hash string to get consistent fallback color
    let hash = 0;
    for (let i = 0; i < normalizedName.length; i++) {
        hash = normalizedName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % FALLBACK_COLORS.length;
    return FALLBACK_COLORS[index];
}
