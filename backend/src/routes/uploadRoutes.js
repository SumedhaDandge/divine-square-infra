
import express from "express";
import { uploadS3 } from "../config/s3Config.js";

const router = express.Router();

router.post("/s3", uploadS3.array("files", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const fileUrls = req.files.map((file) => file.location); // S3 returns 'location'

    return res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: fileUrls,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
