import express from "express";
import * as SectionsController from "../controllers/section";

const router = express.Router();

router.post("/", SectionsController.createSection);

router.get("/:todoId/getSections", SectionsController.getSections);

router.get("/:sectionId/getSection", SectionsController.getSection);

router.patch("/:sectionId", SectionsController.updateSection);

router.delete("/:sectionId", SectionsController.deleteSection);

export default router;