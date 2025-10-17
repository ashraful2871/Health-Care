import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helper/paginationHelper";
import { doctorFilterableFields } from "./doctor.constaint";
import { prisma } from "../../shared/prisma";

const getAllFromDB = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterDate } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorFilterableFields.map(
        (field) =>
          ({
            [field]: {
              contains: searchTerm,
              mode: "insensitive",
            },
          } as Prisma.DoctorWhereInput)
      ),
    });
  }

  if (Object.keys(filterDate).length > 0) {
    const filterCondition = Object.keys(filterDate).map((key) => ({
      [key]: {
        equals: (filterDate as any)[key],
      },
    }));

    andConditions.push(...filterCondition);
  }
  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });
  return {
    meta: { page, limit, total },
    data: result,
  };
};

export const doctorService = {
  getAllFromDB,
};
