import { Doctor, Prisma } from "@prisma/client";
import { paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constaint";
import { prisma } from "../../shared/prisma";
import { IUpdateDoctorSpecialties } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, specialties, ...filterDate } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
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
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
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

const updateDoctorInfoDb = async (
  id: string,
  payload: Partial<IUpdateDoctorSpecialties>
) => {
  const doctorInfo = await prisma.doctor.findFirstOrThrow({
    where: {
      id,
    },
  });
  const { specialties, ...doctorData } = payload;

  return await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const specialties of deleteSpecialtyIds) {
        await tnx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialitiesId: specialties.specialtyId,
          },
        });
      }

      const createSpecialtyIds = specialties.filter(
        (specialties) => !specialties.isDeleted
      );

      for (const specialties of createSpecialtyIds) {
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialitiesId: specialties.specialtyId,
          },
        });
      }
    }
    const updatedData = await tnx.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialities: true,
          },
        },
      },
    });
    return updatedData;
  });
};

export const doctorService = {
  getAllFromDB,
  updateDoctorInfoDb,
};
