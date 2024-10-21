import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { verify, sign } from "@utils";

import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";
let client = new PrismaClient();

const code = Math.floor(100000 + Math.random() * 900000).toString();
export class getHomePage {
  static async getRegister(req: Request, res: Response, next: NextFunction) {
    res.render("./register/index");
  }

  static async postInfo(req: Request, res: Response, next: NextFunction) {
    let { fullname, email, password } = await req.body;
    let redisClient = createClient();
    await redisClient.connect();
    // redis
    await redisClient.setEx(email, 120, code);
    async function sendEmail(email: string, code: string): Promise<void> {
      const templatePath = path.join(
        process.cwd(),
        "src",
        "views",
        "index.ejs"
      );
      const template = fs.readFileSync(templatePath, "utf8");

      const html = ejs.render(template, { code, fullname });

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "azizkobulovbackend@gmail.com",
          pass: "wavnvetevsxjyzjf",
        },
      });

      try {
        const info = await transporter.sendMail({
          from: "azizkobulovbackend@gmail.com",
          to: email,
          html: html,
        });

        console.log("Email sent:", info.response);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
    try {
      let users = await client.user.create({
        data: {
          fullname,
          email,
          password,
        },
      });

      const payload = {
        userId: users?.id,
        role: "user",
      };

      const token = sign(payload);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
      });

      await sendEmail(email, code);
      res.redirect("/verify-user");
    } catch (error) {
      next(error);
    }
  }

  static async getCode(req: Request, res: Response, next: NextFunction) {
    let { verificationCode, email } = req.body;

    let redisClient = createClient();
    await redisClient.connect();

    let redisCode = await redisClient.get(email);

    let number = verificationCode == redisCode;
    if (number) {
      let users = await client.user.findFirst({
        where: {
          email,
        },
      });

      res.redirect("/menu");
    } else {
      res.send({
        success: false,
        message: "Code is incorrect or time has expired",
      });
    }
  }

  static async getVerifyPage(req: Request, res: Response, next: NextFunction) {
    res.render("./verify/index");
  }

  static async getMenuPage(req: Request, res: Response, next: NextFunction) {
    res.render("./mainpage/index");
  }
}
