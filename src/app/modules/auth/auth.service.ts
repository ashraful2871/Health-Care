import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtHelper } from "../../helper/jwtHelper";
import ApiError from "../../Errors/apiError";
import status from "http-status";
const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(status.BAD_REQUEST, "password Is incorrect");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    "secret",
    "1h"
  );
  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    "secret",
    "1h"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const authService = { login };
