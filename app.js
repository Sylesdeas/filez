import express from "express";
import db from "#db/client";
import { getFiles, createFile } from "#db/queries/files";
import {
  getFolders,
  getFolderById,
  getFolderByIdIncludingFiles,
} from "#db/queries/folders";
const app = express();

app.use(express.json());

app.get("/files", async (req, res, next) => {
  try {
    const files = await getFiles();
    res.send(files);
  } catch (error) {
    next(error);
  }
});

app.get("/folders", async (req, res, next) => {
  try {
    const folders = await getFolders();
    res.send(folders);
  } catch (error) {
    next(error);
  }
});

app.get("/folders/:id", async (req, res, next) => {
  try {
    const folder = await getFolderByIdIncludingFiles(req.params.id);

    if (!folder) {
      return res.status(404).send({ error: "Folder not found." });
    }

    res.send(folder);
  } catch (error) {
    next(error);
  }
});

app.post("/folders/:id/files", async (req, res, next) => {
  try {
    const folder = await getFolderById(req.params.id);

    if (!folder) {
      return res.status(404).send({ error: "Folder not found." });
    }

    if (!req.body) {
      return res.status(400).send({ error: "Request body required." });
    }

    const { name, size } = req.body;

    if (!name || size === undefined) {
      return res.status(400).send({ error: "Missing required fields." });
    }

    const file = await createFile({
      name,
      size,
      folder_id: req.params.id,
    });

    res.status(201).send(file);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: "Something went wrong." });
});

export default app;
