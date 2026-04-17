import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  CommunicationLogEntry,
  OwnerDeliveryLog,
  ProjectRecord,
  UploadedAsset,
  UserRecord,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

const rootDirectory =
  process.env.STORAGE_ROOT ||
  path.resolve(process.cwd(), "../../storage/optimise-ai");

export function getStorageRoot() {
  return rootDirectory;
}

export function getProjectDirectory(projectId: string) {
  return path.join(rootDirectory, "projects", projectId);
}

export function getLegacyProjectDirectory(projectId: string) {
  return path.join(process.cwd(), "storage", "optimise-ai", "projects", projectId);
}

export async function ensureProjectDirectory(projectId: string) {
  const projectDirectory = getProjectDirectory(projectId);
  await mkdir(projectDirectory, { recursive: true });
  return projectDirectory;
}

function collectionPath(name: string) {
  return path.join(rootDirectory, `${name}.json`);
}

async function ensureStorage() {
  await mkdir(path.join(rootDirectory, "uploads"), { recursive: true });
  await mkdir(path.join(rootDirectory, "projects"), { recursive: true });
}

async function readCollection<T>(name: string): Promise<T[]> {
  await ensureStorage();

  try {
    const file = await readFile(collectionPath(name), "utf8");
    return JSON.parse(file) as T[];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }
}

async function writeCollection<T>(name: string, records: T[]) {
  await ensureStorage();
  await writeFile(collectionPath(name), JSON.stringify(records, null, 2));
}

export async function listUsers() {
  return readCollection<UserRecord>("users");
}

export async function findUserByEmail(email: string) {
  const users = await listUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(userId: string) {
  const users = await listUsers();
  return users.find((user) => user.id === userId) ?? null;
}

export async function countUsers() {
  const users = await listUsers();
  return users.length;
}

export async function saveUser(user: UserRecord) {
  const users = await listUsers();
  const nextUsers = [...users.filter((entry) => entry.id !== user.id), user];
  await writeCollection("users", nextUsers.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
}

export async function listProjects() {
  return readCollection<ProjectRecord>("projects");
}

export async function listProjectsForUser(userId: string) {
  const projects = await listProjects();
  return projects
    .filter((project) => project.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function findProjectById(projectId: string) {
  const projects = await listProjects();
  return projects.find((project) => project.id === projectId) ?? null;
}

export async function saveProject(project: ProjectRecord) {
  const projects = await listProjects();
  const nextProjects = [
    ...projects.filter((entry) => entry.id !== project.id),
    project,
  ].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  await writeCollection("projects", nextProjects);
}

export async function saveUpload(projectId: string, file: File): Promise<UploadedAsset> {
  await ensureStorage();

  const uploadDirectory = path.join(rootDirectory, "uploads", projectId);
  await mkdir(uploadDirectory, { recursive: true });

  const extension = path.extname(file.name);
  const safeName = slugify(path.basename(file.name, extension)) || "reference-file";
  const storedName = `${Date.now()}-${safeName}${extension}`;
  const filePath = path.join(uploadDirectory, storedName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return {
    name: file.name,
    storedName,
    path: filePath,
    size: file.size,
    type: file.type || "application/octet-stream",
  };
}

export async function appendOwnerDeliveryLog(entry: OwnerDeliveryLog) {
  const entries = await readCollection<OwnerDeliveryLog>("owner-delivery-log");
  entries.unshift(entry);
  await writeCollection("owner-delivery-log", entries);
}

export async function listOwnerDeliveryLog() {
  return readCollection<OwnerDeliveryLog>("owner-delivery-log");
}

export async function appendCommunicationLog(entry: CommunicationLogEntry) {
  const entries = await readCollection<CommunicationLogEntry>("communications-log");
  entries.unshift(entry);
  await writeCollection("communications-log", entries);
}

export async function listCommunicationLog() {
  return readCollection<CommunicationLogEntry>("communications-log");
}
