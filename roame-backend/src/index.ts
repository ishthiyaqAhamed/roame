import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Roame API is running 🚗" });
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Roame API listening on http://localhost:${PORT}`);
});