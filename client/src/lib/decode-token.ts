"use server";

import jwt from "jsonwebtoken";

export const decodeToken = async (token: string) => {
  return await jwt.decode(token);
};
