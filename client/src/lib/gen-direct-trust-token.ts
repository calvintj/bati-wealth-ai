"use server";

import crypto from "crypto";
import jwt, { JwtHeader } from "jsonwebtoken";

export const genDirectTrustToken = async () => {
  const payload = {
    iss: process.env.BATI_DIRECT_TRUST_CLIENT_ID,
    aud: "tableau",
    jti: crypto.randomUUID(),
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
