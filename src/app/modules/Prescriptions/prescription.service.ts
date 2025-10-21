import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
  UserRole,
} from "@prisma/client";
import { IJWTPayload } from "../../type/common";
import { prisma } from "../../shared/prisma";
import ApiError from "../../Errors/apiError";
import { StatusCodes } from "http-status-codes";

const createAppointment = async (
  user: IJWTPayload,
  payload: Partial<Prescription>
) => {
  const appointmentData = await prisma.appointment.findFirstOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },

    include: {
      doctor: true,
    },
  });

  if (user.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email))
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This is not your appointment"
      );
  }

  return await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
    include: {
      patient: true,
    },
  });
};

export const prescriptionsService = {
  createAppointment,
};
