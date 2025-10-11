import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { createPatientInput } from "./user.interface";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.patient.profilePhoto = uploadedResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });

    return await tnx.patient.create({
      data: req.body.patient,
    });
  });
  return result;
};

const getAllFromDb = async ({
  page,
  limit,
  searchTerm,
  sortBy,
  sortOrder,
  role,
  status,
}: {
  page: number;
  limit: number;
  searchTerm: any;
  sortBy: any;
  sortOrder: any;
  role: any;
  status: any;
}) => {
  const pageNumber = page || 1;
  const limitNumber = limit || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const result = await prisma.user.findMany({
    skip,
    take: limitNumber,
    where: {
      email: {
        contains: searchTerm,
        mode: "insensitive",
      },
      status: status,
      role: role,
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  return result;
};

export const userService = { createPatient, getAllFromDb };
