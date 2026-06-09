import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { contactRouter } from "./src/routes/contact.routes.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";
import { apiLimiter } from "./src/middlewares/rate-limit.middleware.js";
import { noStoreForApi, requestIdMiddleware, requireJsonContent } from "./src/middlewares/security.middleware.js";
import { env, validateProductionEnv } from "./src/config/env.js";

validateProductionEnv();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "../..");

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(requestIdMiddleware);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-site" },
  contentSecurityPolicy: false
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.frontendOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origem nao permitida por CORS."));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "X-Admin-Token"],
  maxAge: 600
}));
app.use(noStoreForApi);
app.use(requireJsonContent);
app.use(express.json({ limit: "8kb", strict: true }));
app.use(morgan(env.isProduction ? "combined" : "dev"));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api", apiLimiter, contactRouter);
app.use(express.static(frontendPath, {
  extensions: ["html"],
  index: "index.html",
  maxAge: env.isProduction ? "1h" : 0
}));
app.get("*", (_request, response) => {
  response.sendFile(path.join(frontendPath, "index.html"));
});
app.use(errorMiddleware);

app.listen(env.port, () => {
  console.log(`Padaria Inove API rodando na porta ${env.port}`);
});
