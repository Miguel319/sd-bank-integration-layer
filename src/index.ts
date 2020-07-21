/*Main dependencies */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import accountRouter from "./routes/account.routes";
import beneficiaryRouter from "./routes/beneficiary.routes"

const app = express();
app.use(cors());
dotenv.config();

const BASE_URL: string = "/api/v1";

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
app.use(`${BASE_URL}/accounts`, accountRouter);
app.use(`${BASE_URL}/beneficiaries`, beneficiaryRouter);


//Middles erros
//app.use(err)


const PORT = 3001 || process.env.PORT;

app.listen(PORT, () => console.log("Server listening..."));
