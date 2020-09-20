/*Main dependencies */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { errorHandler } from "./shared/middlewares/error.middleware";
import { setupCoreRoutes } from "./apis/core/routes/index.routes";
import { setupTellerRoutes } from "./apis/teller/routes/index.routes";
import { setupInternetBankingRoutes } from "./apis/internet-banking/routes/index.routes";

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

// Routes
setupCoreRoutes(app);
setupInternetBankingRoutes(app);
setupTellerRoutes(app);

// app.use("/*", (req: Request, res: Response) =>
//   res.sendFile(__dirname, "index.html")
// );

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Servidor a la escucha en el puerto: ${PORT}.`)
);
