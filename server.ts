import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is required text");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// --- Mock Data Store ---
let projects = [
  { id: "1", name: "Alpha API", status: "active", health: "healthy", version: "1.2.0", url: "https://example.com" },
  { id: "2", name: "Beta Web", status: "active", health: "degraded", version: "0.9.5", url: "" },
  { id: "3", name: "Gamma Worker", status: "maintenance", health: "offline", version: "2.0.1", url: "" },
];

let tasks = [
  { id: "101", projectId: "1", title: "Implement new auth flow", status: "in-progress", assignee: "Alex M." },
  { id: "102", projectId: "1", title: "Cache redis queries", status: "pending", assignee: "Sam D." },
  { id: "103", projectId: "2", title: "Update tailwind config", status: "completed", assignee: "Jordan T." },
];

let deployments = [
  { id: "201", projectId: "1", status: "success", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), env: "production" },
  { id: "202", projectId: "2", status: "failed", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), env: "production" },
  { id: "203", projectId: "3", status: "success", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), env: "staging" },
];

// Generic Collections: { [projectId]: { [collectionName]: any[] } }
const dataStore: Record<string, Record<string, any[]>> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---
  const apiRouter = express.Router();

  // Projects
  apiRouter.get("/projects", (req, res) => {
    res.json(projects);
  });

  apiRouter.get("/projects/:id", (req, res) => {
    const p = projects.find((x) => x.id === req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  });

  apiRouter.post("/projects", (req, res) => {
    const p = {
      id: Math.random().toString(36).substring(7),
      name: req.body.name || "New Registry",
      status: "active",
      health: "healthy",
      version: "1.0.0",
      url: req.body.url || ""
    };
    projects.push(p);
    res.status(201).json(p);
  });

  apiRouter.patch("/projects/:id", (req, res) => {
    const index = projects.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    projects[index] = { ...projects[index], ...req.body };
    res.json(projects[index]);
  });

  apiRouter.delete("/projects/:id", (req, res) => {
    projects = projects.filter(p => p.id !== req.params.id);
    res.status(200).json({ success: true });
  });

  // Project Generic Data Services (API for connected apps)
  apiRouter.get("/projects/:id/data/:collection", (req, res) => {
    const { id, collection } = req.params;
    const records = dataStore[id]?.[collection] || [];
    res.json(records);
  });

  apiRouter.post("/projects/:id/data/:collection", (req, res) => {
    const { id, collection } = req.params;
    if (!dataStore[id]) dataStore[id] = {};
    if (!dataStore[id][collection]) dataStore[id][collection] = [];
    
    const record = { _id: Math.random().toString(36).substring(7), ...req.body, _createdAt: new Date().toISOString() };
    dataStore[id][collection].push(record);
    res.status(201).json(record);
  });

  // Project AI Service
  apiRouter.post("/projects/:id/ai/generate", async (req, res) => {
    try {
      const ai = getAI();
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "No prompt provided" });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to generate AI content" });
    }
  });

  // Tasks
  apiRouter.get("/tasks", (req, res) => {
    if (req.query.projectId) {
      res.json(tasks.filter(t => t.projectId === req.query.projectId));
    } else {
      res.json(tasks);
    }
  });

  apiRouter.post("/tasks", (req, res) => {
    const newTask = {
      id: Math.random().toString(36).substring(7),
      ...req.body
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
  });

  apiRouter.patch("/tasks/:id", (req, res) => {
    const index = tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    tasks[index] = { ...tasks[index], ...req.body };
    res.json(tasks[index]);
  });

  // Deployments
  apiRouter.get("/deployments", (req, res) => {
    if (req.query.projectId) {
      res.json(deployments.filter(d => d.projectId === req.query.projectId));
    } else {
      res.json(deployments);
    }
  });

  // System status
  apiRouter.get("/system/status", (req, res) => {
    const activeDeployments = deployments.filter(d => d.env === "production" && d.status === "success").length;
    res.json({
      projects: projects.length,
      tasks_pending: tasks.filter(t => t.status !== "completed").length,
      healthy_services: projects.filter(p => p.health === "healthy").length,
      system_load: "42%",
      last_updated: new Date().toISOString()
    });
  });

  app.use("/api", apiRouter);

  // --- Vite Middleware (Development) or Static (Production) ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
