import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import api from "./api.js";

const app = express();
app.use(cors());                 // allow mobile/web during dev
app.use(express.json());
app.use(morgan("dev"));

app.use("/ms-api", api);         // base path stays similar to your PHP ms-api

app.get("/", (_req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
