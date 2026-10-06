import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(0).optional(),
}).strict();

const projectFields = {
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1000),
  project_type: z.string().trim().min(1).max(40),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20),
  preview_type: z.enum(["chart", "code", "dashboard", "graph"]),
  url: z.url().refine(value => value.startsWith("https://"), "URL must use HTTPS"),
  accent: z.enum(["violet", "cyan"]),
  published: z.boolean(),
};

export const createProjectSchema = z.object({
  id: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  ...projectFields,
}).strict();

export const updateProjectSchema = z.object(projectFields).partial().strict().refine(
  value => Object.keys(value).length > 0,
  "At least one project field must be provided",
);
