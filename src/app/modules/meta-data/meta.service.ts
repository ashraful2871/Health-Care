import { PaymentStatus, UserRole } from "@prisma/client";
import { IJWTPayload } from "../../type/common";
import ApiError from "../../Errors/apiError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../shared/prisma";

const fetchDashboardMetaData = async (user: IJWTPayload) => {
  let metadata;

  switch (user.role) {
    case UserRole.ADMIN:
      metadata = "admin metadata";
      break;

    case UserRole.PATIENT:
      metadata = "patient metadata";
      break;

    case UserRole.DOCTOR:
      metadata = "doctor metaData";
      break;

    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, "invalid request Data");
  }

  return metadata;
};

const getAdminMetaData = async () => {
  const adminCount = await prisma.admin.count();
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.doctor.count();
  const appointmentCount = await prisma.appointment.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });
};

export const metaService = { fetchDashboardMetaData };
