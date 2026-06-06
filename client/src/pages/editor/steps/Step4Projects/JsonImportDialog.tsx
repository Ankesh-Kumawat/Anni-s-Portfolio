import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileJson, CheckCircle, AlertCircle, Copy } from "lucide-react";
import type { EditorData } from "../../types";

interface JsonImportDialogProps {
  data: EditorData;
  setData: React.Dispatch<React.SetStateAction<EditorData>>;
}

const PROJECT_TEMPLATE = {
  name: "Project Name",
  tagline: "Short one-liner about the project",
  description: "Brief description of what the project does",
  status: "Completed",
  platform: "Web",
  techStack: ["React", "TypeScript"],
  overview: "Detailed overview of the project",
  problem: "What problem does this solve?",
  solution: "How did you solve it?",
  outcome: "What was the result?",
  features: [
    { title: "Feature 1", description: "Description of feature 1" },
  ],
  architecture: {
    structure: "How the project is structured",
    dataHandling: "How data is handled",
    scalability: "Scalability considerations",
    performance: "Performance optimizations",
  },
  challenges: [
    {
      challenge: "Challenge faced",
      solution: "How it was solved",
      learning: "What was learned",
    },
  ],
  github: "",
  liveDemo: "",
};

function validateProject(project: any): string[] {
  const errors: string[] = [];
  if (!project.name) errors.push("name is required");
  if (!project.tagline) errors.push("tagline is required");
  if (!project.description) errors.push("description is required");
  if (!project.status) errors.push("status is required");
  if (!project.platform) errors.push("platform is required");
  if (!Array.isArray(project.techStack)) errors.push("techStack must be an array");
  if (!Array.isArray(project.features)) errors.push("features must be an array");
  if (!project.architecture || typeof project.architecture !== "object")
    errors.push("architecture must be an object");
  if (!Array.isArray(project.challenges)) errors.push("challenges must be an array");
  return errors;
}

function sanitizeProject(raw: any) {
  return {
    id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: raw.name || "",
    tagline: raw.tagline || "",
    description: raw.description || "",
    status: raw.status || "In Development",
    platform: raw.platform || "Web",
    techStack: Array.isArray(raw.techStack) ? raw.techStack : [],
    overview: raw.overview || "",
    problem: raw.problem || "",
    solution: raw.solution || "",
    outcome: raw.outcome || "",
    features: Array.isArray(raw.features)
      ? raw.features.map((f: any) => ({
          title: f.title || "",
          description: f.description || "",
        }))
      : [],
    architecture: {
      structure: raw.architecture?.structure || "",
      dataHandling: raw.architecture?.dataHandling || "",
      scalability: raw.architecture?.scalability || "",
      performance: raw.architecture?.performance || "",
    },
    challenges: Array.isArray(raw.challenges)
      ? raw.challenges.map((c: any) => ({
          challenge: c.challenge || "",
          solution: c.solution || "",
          learning: c.learning || "",
        }))
      : [],
    coverImage: "",
    coverImages: {},
    images: [],
    platformImages: {},
    github: raw.github || "",
    liveDemo: raw.liveDemo || "",
  };
}

export function JsonImportDialog({ data, setData }: JsonImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [imported, setImported] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleParse = () => {
    setParseError(null);
    setValidationErrors([]);
    setPreview(null);

    try {
      let parsed = JSON.parse(jsonInput);

      // Support single project or array of projects
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      const allErrors: string[] = [];
      const validProjects: any[] = [];

      parsed.forEach((item: any, i: number) => {
        const errs = validateProject(item);
        if (errs.length > 0) {
          allErrors.push(`Project ${i + 1}: ${errs.join(", ")}`);
        } else {
          validProjects.push(sanitizeProject(item));
        }
      });

      if (allErrors.length > 0) {
        setValidationErrors(allErrors);
      }

      if (validProjects.length > 0) {
        setPreview(validProjects);
      }
    } catch (e: any) {
      setParseError(`Invalid JSON: ${e.message}`);
    }
  };

  const handleImport = () => {
    if (!preview || preview.length === 0) return;

    setData((prev) => ({
      ...prev,
      projects: {
        projects: [...prev.projects.projects, ...preview],
      },
    }));

    setImportCount(preview.length);
    setImported(true);
    setJsonInput("");
    setPreview(null);
    setParseError(null);
    setValidationErrors([]);

    setTimeout(() => {
      setOpen(false);
      setImported(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setJsonInput(text);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handlePasteTemplate = () => {
    setJsonInput(JSON.stringify(PROJECT_TEMPLATE, null, 2));
    setParseError(null);
    setValidationErrors([]);
    setPreview(null);
  };

  const handleReset = () => {
    setJsonInput("");
    setParseError(null);
    setValidationErrors([]);
    setPreview(null);
    setImported(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) handleReset(); }}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="lg" className="gap-2">
          <Upload className="w-4 h-4" />
          Import JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        {imported ? (
          <div className="py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">Import Successful!</h3>
            <p className="text-muted-foreground mt-2">{importCount} project{importCount > 1 ? "s" : ""} added</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                Import Projects from JSON
              </DialogTitle>
              <DialogDescription>
                Paste your JSON below or upload a .json file. Images are skipped — upload them manually after import.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePasteTemplate}
                  className="gap-2"
                >
                  <Copy className="w-3 h-3" />
                  Paste Template
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-3 h-3" />
                  Upload .json File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setParseError(null);
                  setValidationErrors([]);
                  setPreview(null);
                }}
                placeholder='Paste JSON here...\n\nFormat: single project object or array of projects'
                className="w-full h-[300px] p-4 text-sm font-mono bg-muted rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {parseError && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {parseError}
                </div>
              )}

              {validationErrors.length > 0 && (
                <div className="space-y-1 p-3 bg-destructive/10 rounded-lg text-sm">
                  {validationErrors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-destructive">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {err}
                    </div>
                  ))}
                </div>
              )}

              {preview && preview.length > 0 && (
                <div className="p-3 bg-green-500/10 rounded-lg text-sm space-y-1">
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {preview.length} project{preview.length > 1 ? "s" : ""} ready to import
                  </div>
                  {preview.map((p: any, i: number) => (
                    <div key={i} className="text-muted-foreground ml-6">
                      {i + 1}. {p.name} — {p.platform} ({p.techStack.join(", ") || "no tech stack"})
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {preview ? (
                <Button type="button" onClick={handleImport} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import {preview.length} Project{preview.length > 1 ? "s" : ""}
                </Button>
              ) : (
                <Button type="button" onClick={handleParse} disabled={!jsonInput.trim()}>
                  Parse JSON
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
