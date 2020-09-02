import { Response, NextFunction } from "express";
/*Main dependencies */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/error.middleware";
import { setupRoutes } from "./routes/index.routes";
import { Request } from "express";
import { logger } from "./utils/logger";

const app = express();
app.use(cors());
dotenv.config();

// Mongosose configuration
mongoose
  .connect(String(process.env.DB_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    // Seeder
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

setupRoutes(app);

// Error handler
app.use(errorHandler);

const PORT = 3002 || process.env.PORT;

app.listen(PORT, () =>
  console.log(`Servidor a la escucha en puerto: ${PORT}.`)
);
