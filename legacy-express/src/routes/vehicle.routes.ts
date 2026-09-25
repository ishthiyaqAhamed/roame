import { Router } from "express";
import { createVehicle, listVehicles } from "../controllers/vehicle.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.post("/", requireAuth, requireRole("OWNER"), createVehicle);
router.get("/", listVehicles);

export default router;