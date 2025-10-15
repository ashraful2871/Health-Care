import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../type/common";

const insertIntoDB = async (
  user: IJWTPayload,
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
    isBooked: false,
  }));

  return await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });
};

export const doctorScheduleService = {
  insertIntoDB,
};
