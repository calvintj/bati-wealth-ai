import { createProxyMiddleware } from "http-proxy-middleware";
import { NextApiRequest, NextApiResponse } from "next";

import { Constants } from "@/consts/constants";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

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

  return proxy(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
  });
}
