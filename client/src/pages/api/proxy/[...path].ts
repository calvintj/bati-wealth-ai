import { createProxyMiddleware } from "http-proxy-middleware";
import { NextApiRequest, NextApiResponse } from "next";

import { Constants } from "@/consts/constants";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Helper to run middleware in Next.js API routes
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// WARNING: this is for dev environtment only and should not be used for production
// NEXT_PUBLIC_BASE_API_URL should be just directly point to backend url instead this proxy url
// PURPOSE: bypass cors
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const proxy = createProxyMiddleware({
    target: Constants.BASE_API_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/proxy": "",
    },
  });

  await runMiddleware(req, res, proxy);
}
