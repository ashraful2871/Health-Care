import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helper/paginationHelper";
import { doctorFilterableFields } from "./doctor.constaint";

const getAllFromDB = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterDate } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    OR: doctorFilterableFields.map((field) => ({
      field: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
  }

  if (Object.keys(filterDate).length > 0) {
    const filterCondition = Object.keys(filterDate).map((key) => ({
      [key]: {
        equals: (filterDate as any)[key],
      },
    }));

    andConditions.push(...filterCondition);
  }
};

export const doctorService = {
  getAllFromDB,
};
