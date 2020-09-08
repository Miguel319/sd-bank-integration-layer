import { configureRoutes } from "./routes/index.routes";

import { Response } from "express";
/*Main dependencies */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/error.middleware";
import { Request } from "express";

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

configureRoutes(app);

app.use("/*", (req: Request, res: Response) =>
  res.sendFile(__dirname, "index.html")
);

// Error handler
app.use(errorHandler);

const PORT = 3004 || process.env.PORT;

app.listen(PORT, () =>
  console.log(`Servidor a la escucha en puerto: ${PORT}.`)
);
