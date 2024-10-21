import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sign } from "@utils";

const client = new PrismaClient();

export const verifyUser = async (req: Request, res: Response) => {
  const user = req.user as any;
  const userData = user.profile._json;

  const existingUser = await client.user.findFirst({
    where: { email: userData.email },
  });

  if (existingUser) {
    const payload = {
      userId: userData.sub,
      role: "user",
    };

    const token = sign(payload);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    return res.redirect("/menu");
  } else {
    await client.user.create({
      data: {
        email: userData.email,
        fullname: userData.name,
        google_id: userData.sub,
        password: "change",
      },
    });
    return res.redirect("/menu");
  }
};
