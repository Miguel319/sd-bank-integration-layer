import { createLogger, transports, format } from "winston";
import dotenv from "dotenv";

require("winston-mongodb");

dotenv.config();

export const logger = createLogger({
  transports: [
    new (transports as any).MongoDB({
      db: String(process.env.DB_URI),
      options: { useUnifiedTopology: true },
      level: "info",
      collection: "coreLogs",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new (transports as any).MongoDB({
      db: String(process.env.DB_URI),
      options: { useUnifiedTopology: true },
      level: "error",
      collection: "coreLogs",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});
