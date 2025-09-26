const express = require("express");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const storage = new Storage();

const BUCKET_NAME = process.env.BUCKET_NAME;

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const blob = storage.bucket(BUCKET_NAME).file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).send("Upload error");
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${blob.name}`;
      res.status(200).send({ url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(8080, () => console.log("Server started on port 8080"));
