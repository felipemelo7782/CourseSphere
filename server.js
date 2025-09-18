// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import jsonServer from "json-server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// JSON Server
const router = jsonServer.router(path.join(__dirname, "mock", "db.json"));
const middlewares = jsonServer.defaults();

app.use("/api", middlewares, router);

// Servindo frontend (React build)
app.use(express.static(path.join(__dirname, "front", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "front", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
