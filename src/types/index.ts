export type Project = {
  id: string;
  title: string;
  desc: string;
  type: string;
  tech: string[];
  preview: "chart" | "code" | "dashboard" | "graph";
  href: string;
  accent: string;
};

export type ContactForm = {
  name: string;
  email: string;
  message: string;
  website: string;
};

type ProjectApiRecord = {
  id: string;
  title: string;
  description: string;
  project_type: string;
  technologies: string[];
  preview_type: Project["preview"];
  url: string;
  accent: "violet" | "cyan";
};

function isProjectApiRecord(value: unknown): value is ProjectApiRecord {
  if (!value || typeof value !== "object") return false;
  const project = value as Record<string, unknown>;
  return typeof project.id === "string"
    && typeof project.title === "string"
    && typeof project.description === "string"
    && typeof project.project_type === "string"
    && Array.isArray(project.technologies)
    && project.technologies.every(technology => typeof technology === "string")
    && ["chart", "code", "dashboard", "graph"].includes(String(project.preview_type))
    && typeof project.url === "string"
    && ["violet", "cyan"].includes(String(project.accent));
}

export function parseProjectsPayload(value: unknown): Project[] {
  if (!value || typeof value !== "object" || !("projects" in value) || !Array.isArray(value.projects)) {
    throw new Error("The projects response has an invalid format.");
  }
  if (!value.projects.every(isProjectApiRecord)) {
    throw new Error("The projects response has an invalid format.");
  }
  return value.projects.map(project => ({
    id: project.id,
    title: project.title,
    desc: project.description,
    type: project.project_type,
    tech: project.technologies,
    preview: project.preview_type,
    href: project.url,
    accent: `var(--${project.accent})`,
  }));
}
