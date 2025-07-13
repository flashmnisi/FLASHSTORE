import express from "express";
import multer from "multer";
import path from "path";
import { CreateCategories, getCategories } from "../controllers";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name + "-" + Date.now() + path.extname(file.originalname));
  },
});

const images = multer({storage:imageStorage}).array("images")

router.post("/CreateCategories", images, CreateCategories);
router.get("/getCategories",getCategories)

export { router as CategoryRoutes };



