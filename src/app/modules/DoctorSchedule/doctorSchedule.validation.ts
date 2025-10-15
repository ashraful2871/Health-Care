import z from "zod";

export const createDoctorScheduleValidationZodSchema = z.object({
  body: z.object({
    scheduleIds: z.array(z.string()),
  }),
});
