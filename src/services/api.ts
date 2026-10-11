import type { ContactForm } from "../types";
import { parseProjectsPayload } from "../types";

async function request(path: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("Le service est temporairement indisponible. Réessayez plus tard.");
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Trop de tentatives. Merci de réessayer un peu plus tard.");
    }
    throw new Error("Une erreur est survenue. Merci de réessayer plus tard.");
  }
  if (response.status === 204) return undefined;

  try {
    return await response.json();
  } catch {
    throw new Error("Le service a renvoyé une réponse invalide.");
  }
}

export async function getProjects() {
  return parseProjectsPayload(await request("/api/projects"));
}

export async function sendContact(contact: ContactForm): Promise<void> {
  await request("/api/contact", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}
