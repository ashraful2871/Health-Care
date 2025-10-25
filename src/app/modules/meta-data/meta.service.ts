import { PaymentStatus, UserRole } from "@prisma/client";
import { IJWTPayload } from "../../type/common";
import ApiError from "../../Errors/apiError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../shared/prisma";
import { tr } from "zod/v4/locales";

const fetchDashboardMetaData = async (user: IJWTPayload) => {
  let metadata;

  switch (user.role) {
    case UserRole.ADMIN:
      metadata = await getAdminMetaData();
      break;

    case UserRole.PATIENT:
      metadata = await getPatientMetaData(user);
      break;

    case UserRole.DOCTOR:
      metadata = await getDoctorMetadata(user);
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

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    adminCount,
    doctorCount,
    patientCount,
    totalRevenue,
    appointmentCount,
    paymentCount,
    barChartData,
    pieChartData,
  };
};

const getDoctorMetadata = async (user: IJWTPayload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: { id: true },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenueCount = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });

  const fromAppointmentStatusDistribution = appointmentStatusDistribution.map(
    ({ status, _count }) => ({ status, count: Number(_count.id) })
  );

  return {
    appointmentCount,
    reviewCount,
    patientCount,
    totalRevenueCount,
    fromAppointmentStatusDistribution,
  };
};

const getPatientMetaData = async (user: IJWTPayload) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formattedAppointmentStatusDistribution,
  };
};

const getBarChartData = async () => {
  const appointmentCountPerMonth = await prisma.$queryRaw`
    SELECT 
    DATE_TRUNC('month', "createdAt") AS month,
    CAST(COUNT(*) AS INTEGER) AS count
    FROM " appointments"
    GROUP BY month
    ORDER BY month ASC;
    `;

  return appointmentCountPerMonth;
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const fromAppointmentStatusDistribution = appointmentStatusDistribution.map(
    ({ status, _count }) => ({ status, count: Number(_count.id) })
  );

  return fromAppointmentStatusDistribution;
};
export const metaService = { fetchDashboardMetaData };
