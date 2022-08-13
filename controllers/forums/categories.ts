import { Request, Response } from "express";
import { prisma } from "./../../prisma/prisma";

export default async function categories(req: Request, res: Response) {
  const categories = await prisma.category.findMany();
  return res.status(200).json({
    categories,
  });
}
