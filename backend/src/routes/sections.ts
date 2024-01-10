import express from "express";
import * as SectionsController from "../controllers/section";

const router = express.Router();

router.get("/", SectionsController.getSections);

router.post("/", SectionsController.createSection);

router.get("/:sectionId", SectionsController.getSection);

router.patch("/:sectionId", SectionsController.updateSection);

router.delete("/:sectionId", SectionsController.deleteSection);

export default router;