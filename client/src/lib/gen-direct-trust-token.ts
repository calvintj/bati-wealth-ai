"use server";

import jwt, { JwtHeader } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const genDirectTrustToken = async () => {
  const payload = {
    iss: process.env.BATI_DIRECT_TRUST_CLIENT_ID,
    aud: "tableau",
    jti: uuidv4(),
    scp: ["tableau:views:embed"],
    sub: process.env.BATI_DIRECT_TRUST_SUB_USER,
  };

  const secretKey = process.env.BATI_DIRECT_TRUST_SECRET_VALUE as string;

  const token = await jwt.sign(payload, secretKey, {
    expiresIn: "10m",
    algorithm: "HS256",
    header: {
      alg: "HS256",
      kid: process.env.BATI_DIRECT_TRUST_SECRET_ID,
      iss: process.env.BATI_DIRECT_TRUST_CLIENT_ID,
    } as unknown as JwtHeader,
  });

  return token;
};
