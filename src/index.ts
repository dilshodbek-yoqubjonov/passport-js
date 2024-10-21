import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./config/passport";
import passport from "passport";
import { ErrorHandlerMiddleware } from "@middlewares";
import { PrismaClient } from "@prisma/client";
import { sign } from "@utils";
import { verifyUser } from "@controllers";
let client = new PrismaClient();
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(router);

app.use(
  session({
    secret: "SECRET_KEY",
    resave: false,
    saveUninitialized: true,
  })
);

app.get(
  "/verify",
  passport.authenticate("google", { failureRedirect: "/" }),
  verifyUser
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware);

let PORT = process.env.APP_PORT || 8000;
app.listen(PORT, () => {
  console.log(PORT);
});
